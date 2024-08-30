Immediate:
[] set up controllers.
[] add rough service functions for controllers.
[] add respective routes.
[] set up local postgres db
[] create meaningful env vars where needed
    - [] start addressing the below
[] run API, and test endpoint additions.

___________________________________________________________________________________
[] look into what the last 2 options are, and what a session secret should be(likely a uuid, or concatination of a few, maybe even some decodable hashed value)

app.ts
```js
app.use(session({
  secret: process.env.SESSION_SECRET || 'session-secret',
  resave: false,
  saveUninitialized: false,
}));
```

[] connect postgres instance remote or local to app

config/db.ts
```js
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/bookclub', {
  dialect: 'postgres',
});
```

[] configure google 0auth, and optimal values for respective env vars
[] NOTE: currently using session-based auth, and session-based auth may require additional configuration for load balancing.
[] NOTE: sessions can be more secure but are vulnerable to CSRF attacks if not properly protected.
[] NOTE: sessions can be easily destroyed on the server-side. 
   - How, and how do we prevent this.

config/passport.ts
```js
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
```


[x] change user type for user model interface

config/passport.ts
```js
passport.serializeUser((user: unknown, done) => {
  done(null, user.id);
})
```

[] create a meaningful and secure pepper for this env var(used on line 50 as well)
models/User.ts
```js
  public async validatePassword(password: string): Promise<boolean> {
    const pepper: string = process.env.PASSWORD_PEPPER || 'unh-senha-aleatoria-pepper';
    return argon2.verify(this.password, `${password}${this.passwordSalt}${pepper}`);
  }
```

[x] may need to create a union type that represents image formats
models/types.ts
```js
  coverImage: string; // may need to create a union type that represents possible image formats?
```

BABE RECS:
[x] NOTE: add active and inactive fields for bookclubs
[x] NOTE: all book clubs to be public or private
[x] NOTE: add roles to bookclub: [admin, participant]
[] NOTE: Theming:
//       all users to add images for background, and change colors
//       provide preset themes.
//       upload pictures and generate color palette similar to google forms.
[] NOTE: scheduling for bookclub conversations, that generates .ics calender events
[] NOTE: Polling as an interactive chat feature.

deploy:
[] create local-dev and production .env files for respective environments
   - use the terminal command: [ set | more ] to list env vars in respective env to prevent naming collisions  