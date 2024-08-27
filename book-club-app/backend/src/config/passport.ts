import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return done(null, false, { message: 'Incorrect Email.' });
    }
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return done(null, false, { message: 'Incorrect Password.' });
    }
    return done(null, user);
  } catch (error) {
    return done(error as Error);
  }
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ where: { googleId: profile.id } });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails?.[0].value,
        name: profile.displayName,
      });
    }
    return done(null, user);
  } catch (error) {
    return done(error as Error)
  }
}));

// change user type for user model interface
passport.serializeUser((user: unknown, done) => {
  done(null, user.id);
})

passport.deserializeUser((id: number, done) => {
  try {
    const user = User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error as Error);
  }
});
