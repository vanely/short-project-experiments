import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';
import { UserInterface } from '../models/types';

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
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    console.log(`Google Oauth profile 'passport.ts'\n${profile}`)
    const existingUser = await User.findOne({ where: { googleId: profile.id } });
    if (!existingUser) {
      const newUser = await User.create({
        googleId: (profile.id as unknown) as string,
        email: (profile.emails?.[0].value as unknown) as string,
        firstName: (profile.displayName as unknown) as string,
      });
      return done(null, newUser);
    }
  } catch (error) {
    return done(error as Error)
  }
}));

passport.serializeUser((user: Express.User, done) => {
  const typedUser = user as UserInterface;
  done(null, typedUser.id);
})

passport.deserializeUser((id: number, done) => {
  try {
    const user = User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error as Error);
  }
});
