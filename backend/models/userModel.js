import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// instance methods
// this points to the user object
// these methods can be called on the user object in the controller or any other modules
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Salting is simply the addition of a unique, random string of characters known only to the site to each password before it is hashed, typically this “salt” is placed in front of each password. The salt value needs to be stored by the site, which means sometimes sites use the same salt for every password.
userSchema.pre('save', async function (next) {
  // if we want to update the name or email and not the password, we dont want to update the password in that case, but if we do updated the password in this middleware, it is gonna create a new hash for the password and we are not gonna be able to login, so we need to check if the password is modified or not
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
