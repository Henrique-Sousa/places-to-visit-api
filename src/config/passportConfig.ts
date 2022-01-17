import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import fs from 'fs';
import User from '../models/user';

const PUB_KEY = fs.readFileSync(`${__dirname}/../../jwt_RS256_key_pub.pem`, 'utf8');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  const user = await User.findOne({ _id: jwtPayload.sub });

  if (user) {
    return done(null, user);
  }
  return done(null, false);
}));
