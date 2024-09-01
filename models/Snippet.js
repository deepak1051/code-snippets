import mongoose from 'mongoose';

const snippetSchema = new mongoose.Schema({
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
