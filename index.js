import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import snippetRoutes from './routes/snippets.route.js';

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('connected to db'))
  .catch((err) => console.log(err.message));
const app = express();

app.use(express.json());

app.use('/api/snippets', snippetRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`running on port ${port}`));
