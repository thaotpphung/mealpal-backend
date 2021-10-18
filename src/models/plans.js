const mongoose = require('mongoose');

const planSchema = mongoose.Schema({
  planName: {
    type: String,
    required: [true, "Plan's name is required"],
    maxlength: [40, 'Must have less or equal than 40 characters'],
  },
  userId: { type: String, required: [true, 'userId is required'] },
  planDescription: {
    type: String,
    maxlength: [100, 'Must have less or equal than 40 characters'],
  },
  planCreatedTime: {
    type: Date,
    default: new Date(),
  },
  planTags: { type: [String], default: [] },
  likes: { type: [String], default: [] },
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
