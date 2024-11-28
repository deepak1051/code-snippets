import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

passport.serializeUser((user, done) => {
  console.log('serializing user', user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('deserializing user', id);
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);

      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) return done(null, existingUser);

      try {
        const user = await new User({
          googleId: profile.id,
          avatar: profile.photos[0].value,
          name: profile.displayName,
        }).save();

        done(null, user);
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5000/auth/github/callback' // Ensure this matches in development
          : 'https://code-snippets-y4ua.onrender.com/auth/github/callback',

      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);

      const existingUser = await User.findOne({ githubId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      try {
        // Create a new user if not found
        const newUser = await new User({
          githubId: profile.id,
          avatar: profile.photos[0].value,
          name: profile.displayName,
        }).save();

        done(null, newUser);
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    }
  )
);
