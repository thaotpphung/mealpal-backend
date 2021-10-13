import mongoose from 'mongoose';

const weekSchema = mongoose.Schema({
  weekName: { type: String, required: true },
  planId: { type: String },
  userId: { type: String, required: true },
  weekTags: { type: [String], default: [] },
  weekDiet: { type: String },
});

export default mongoose.model('Week', weekSchema);
