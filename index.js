import 'dotenv/config';
import mongoose from 'mongoose';
import app from './src/app.js';
import path from 'node:path';
import express from 'express';

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('connected to db'))
  .catch((err) => console.log(err.message));

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

console.log(process.env.NODE_ENV);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`running on port ${port}`));
