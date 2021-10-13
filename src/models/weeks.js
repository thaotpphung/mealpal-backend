import mongoose from 'mongoose';

const weekSchema = mongoose.Schema({
  weekName: { type: String, required: true },
  weekDescription: { type: String, default: '' },
  planId: { type: String },
  userId: { type: String, required: true },
  weekTags: { type: [String], default: [] },
  weekDiet: { type: String, default: '' },
});

export default mongoose.model('Week', weekSchema);
