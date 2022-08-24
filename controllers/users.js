import { BadRequestError, UnAuthorizedError } from '../errors/CustomError.js';
import User from '../models/user.js';

export const signupUser = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    throw new BadRequestError('passwords do not match');
  }
  const user = await User.create({
    name: `${firstName} ${lastName}`,
    password,
    email,
  });
  if (!user) {
    throw new BadRequestError('please input the required fields');
  }
  const token = await user.createJWT();

  res.status(201).json({ result: user, token });
};
export const signinUser = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnAuthorizedError('invalid Credentials');
  }

  if (!(await user.isPasswordCorrect(password))) {
    throw new UnAuthorizedError('Invalid Password');
  }
  const token = await user.createJWT();

  res.status(200).json({ result: user, token });
};
