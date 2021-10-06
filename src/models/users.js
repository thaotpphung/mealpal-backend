import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  fullName: { type: String },
  email: { type: String },
  password: { type: String },
  currentPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
  },
  currentWeek: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Week',
  },
});

export default mongoose.model('User', userSchema);
