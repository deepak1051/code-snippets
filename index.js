import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import snippetRoutes from './routes/snippets.route.js';
import authRoutes from './routes/auth.route.js';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('connected to db'))
  .catch((err) => console.log(err.message));
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/snippets', snippetRoutes);
app.use('/api/auth', authRoutes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();

  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`running on port ${port}`));
