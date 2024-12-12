import multer from 'multer';

export const upload = multer({
  dest: path.resolve(__dirname, '../../public/uploads'),
});
