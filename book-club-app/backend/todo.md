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

config/passport.ts
```js
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
```


[] change user type for user model interface

config/passport.ts
```js
passport.serializeUser((user: unknown, done) => {
  done(null, user.id);
})
```

create a meaningful and secure pepper for this env var(used on line 50 as well)
models/User.ts
```js
  public async validatePassword(password: string): Promise<boolean> {
    const pepper: string = process.env.PASSWORD_PEPPER || 'unh-senha-aleatoria-pepper';
    return argon2.verify(this.password, `${password}${this.passwordSalt}${pepper}`);
  }
```


