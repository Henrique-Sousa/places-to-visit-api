import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import { controllerFunction } from './functions';
import User from '../models/user';

const logUserIn: controllerFunction = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      res.send(`Could not find user with email [${email}].`);
    } else {
      const result = await bcrypt.compare(password, user.password);

      if (result) {
        const { _id } = user;
        const expiresIn = '1d';

        const payload = {
          sub: _id,
          iat: Date.now(),
        };

        const PRIV_KEY = fs.readFileSync(`${__dirname}/../../jwt_RS256_key_pub.pem`, 'utf8');
        const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn, algorithm: 'RS256' });

        const userToSend = {
          _id: user._id,
          name: user.name,
        };

        res.send({
          token: `Bearer ${signedToken}`,
          user: userToSend,
        });
      }

      res.status(401);
      res.send('You entered the wrong password');
    }
  } catch (e) {
    console.log(e);
  }
};

export default logUserIn;
