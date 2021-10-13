const mongoose = require('mongoose');

const planSchema = mongoose.Schema({
  planName: { type: String, required: true },
  userId: { type: String, required: true },
  planDescription: { type: String },
  planCreatedTime: {
    type: Date,
    default: new Date(),
  },
  planTags: { type: [String], default: [] },
  likes: { type: [String], default: [] },
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
