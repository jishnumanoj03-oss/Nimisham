import mongoose from 'mongoose';

const workflowStepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  image: {
    url: String,
    publicId: String,
  },
  software: {
    type: String,
  },
  duration: {
    type: String,
  },
  orderIndex: {
    type: Number,
    required: true,
  },
});

const creativeProcessSchema = new mongoose.Schema(
  {
    artwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artwork',
      required: true,
      unique: true, // One process per artwork
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    inspiration: {
      text: { type: String, default: '' },
      references: [{ type: String }],
      mood: { type: String, default: '' },
      goal: { type: String, default: '' },
    },
    techniques: {
      type: [String],
      default: [],
    },
    workflowSteps: [workflowStepSchema],
    creativeNotes: {
      type: String,
      default: '',
    },
    lessonsLearned: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

creativeProcessSchema.index({ artwork: 1 });
creativeProcessSchema.index({ creator: 1 });

const CreativeProcess = mongoose.model('CreativeProcess', creativeProcessSchema);

export default CreativeProcess;
