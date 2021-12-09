const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    maxlength: [40, 'Must have less than or equal to 40 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    maxlength: [40, 'Must have less than or equal to 40 characters'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    maxlength: [40, 'Must have less than or equal to 40 characters'],
    unique: true,
  },
  bio: {
    type: String,
    default: '',
    maxlength: [400, 'Must have less than or equal to 400 characters'],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  isVerified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  currentWeek: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Week',
  },
  weekView: { type: String, default: 'board' },
  recipeView: { type: String, default: 'board' },
  preferredDiet: { type: String, default: '' },
  calories: { type: Number, default: 0 },
  avatar: { type: String, default: '' },
  utilToken: { type: String, select: false },
  utilTokenExpiresIn: { type: Date, select: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
