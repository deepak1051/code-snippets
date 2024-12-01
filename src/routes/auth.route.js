import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/fail',
  }),
  (req, res) => {
    res.redirect(
      process.env.NODE_ENV === 'development' ? 'http://localhost:5173/' : '/'
    );
  }
);

router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/github/callback',
  passport.authenticate('github'),
  (req, res) => {
    res.redirect(
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : 'https://code-snippets-y4ua.onrender.com'
    );
  }
);

router.get('/api/current_user', (req, res) => {
  console.log(req.user);

  res.send(req.user);
});

router.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect(
    process.env.NODE_ENV === 'development' ? 'http://localhost:5173/' : '/'
  );
});

export default router;
