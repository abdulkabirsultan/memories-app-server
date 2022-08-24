import { UnAuthorizedError } from '../errors/CustomError.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';
const auth = async (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken || !authToken.startsWith('Bearer ')) {
    throw new UnAuthorizedError('Invalid Credentials');
  }
  // let userId;
  try {
    const token = authToken.split(' ')[1];

    if (token.startsWith('eyJ')) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      req.user = { username: payload?.name, userId: payload?.id };
    } else {
      const { data } = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      req.user = { username: data?.name, userId: data?.sub };
    }

    next();
  } catch (error) {
    throw new UnAuthorizedError('Invalid Credentials');
  }
};
export default auth;
