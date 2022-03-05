import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/erroMiddleware.js';
// import products from './data/products.js';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// upload folder is not gonna be accessible as default, so we need to make it a static folder so that it can get loaded in the browser

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
  // logging to the console about the requests
  app.use(morgan('dev'));
}

// will allow us to accept json data in our body and works like body-parser
app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('API is running ....');
// });

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// __dirname is not available when using es6 module syntax, but only available when using commonjs
// so we need to do path.resolve(), which will mimick and act in the same way
const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  // any route that is not the above api routes, will be pointing to index.html
  // the below can be intrepreted as __dirname/frontend/build/index.html
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running ....');
  });
}

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
