import express from 'express';
// import asyncHandler from 'express-async-handler';
// import Product from '../models/productModel.js';
const router = express.Router();
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddlware.js';

// @desc    Fetches all products
// @route   GET /api/products
// @access  Public
// router.get(
//   '/',
//   asyncHandler(async (req, res) => {
//     const products = await Product.find({});
//     // purposefully thrown the error to test the error handler on the frontend, if the message is viewed or not
//     // res.status(401);
//     // throw new Error('some error has fucked up the server , FUCK u');
//     res.json(products);
//   })
// );
router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router.get('/top', getTopProducts);

// @desc    Fetches single products
// @route   GET /api/products/:id
// @access  Public
// router.get(
//   '/:id',
//   asyncHandler(async (req, res) => {
//     const product = await Product.findById(req.params.id);

//     if (product) {
//       res.json(product);
//     } else {
//       res.status(404);
//       // express will catch the below error and send it to the error handler on its own
//       // no need to write next(error)
//       throw new Error('Product not Found');
//     }
//   })
// );
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

export default router;
