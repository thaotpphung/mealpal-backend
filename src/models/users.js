const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fullName: { type: String },
  email: { type: String },
  password: { type: String },
  currentWeek: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Week',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
