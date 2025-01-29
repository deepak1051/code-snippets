import mongoose from 'mongoose';

const snippetSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  isDraft: {
    type: Boolean,
    default: false,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },
  steps: [
    {
      stepTitle: {
        type: String,
        required: true,
      },
      stepCode: {
        type: String,
        required: true,
      },
    },
  ],
});

const Snippet = new mongoose.model('Snippet', snippetSchema);

export default Snippet;
