import cookieSession from 'cookie-session';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'node:path';
import passport from 'passport';
import { fileURLToPath } from 'url';
import authRoutes from './api/auth/auth.route.js';
import snippetRoutes from './api/snippets/snippets.route.js';
import razorpayRoutes from './api/razorpay/index.js';

import './services/passport.js';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express();
app.use('/public', express.static(path.resolve(__dirname, '../public')));

app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(
  cookieSession({
    keys: [process.env.COOKIE_KEY], // Encrypts the cookie
    maxAge: 30 * 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes);
app.use('/api/snippets', snippetRoutes);
app.use('/api/orders', razorpayRoutes);

export default app;
