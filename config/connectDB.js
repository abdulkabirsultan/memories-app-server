import mongoose from 'mongoose';

const connect = async (url) => {
  await mongoose.connect(url, console.log('Database connected successfully'));
};
export default connect;
