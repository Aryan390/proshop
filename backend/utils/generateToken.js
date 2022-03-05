import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // payload is an object with property 'id'
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
