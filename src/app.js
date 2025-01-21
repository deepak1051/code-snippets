import cookieSession from 'cookie-session';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import authRoutes from './api/auth/auth.route.js';
import snippetRoutes from './api/snippets/snippets.route.js';
import categoryRoutes from './api/category/category.route.js';

import './services/passport.js';

const app = express();

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
app.use('/api/categories', categoryRoutes);

export default app;
