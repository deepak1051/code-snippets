import express from 'express';
import path from 'node:path';
import { auth } from '../../middleware/auth.middleware.js';
import fs from 'node:fs';
import {
  createCategory,
  getAllCategory,
  getCategorySnippet,
} from './category.ct.js';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const router = express.Router();
const uploadDir = path.join(process.cwd(), '/public/data/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fieldSize: 3e7 }, //30mb
});

router.get('/', getAllCategory);

router.get('/:categoryId', getCategorySnippet);

router.post(
  '/',
  // auth,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  // (req, res) => {
  //   res.send('It Worked');
  // }
  createCategory
);

export default router;
