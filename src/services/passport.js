import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientID,
      clientSecret: process.env.googleClientSecret,
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
      callbackURL: '/auth/github/callback',
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
