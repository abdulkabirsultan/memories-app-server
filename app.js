import * as dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express from 'express';
import connect from './config/connectDB.js';
import notFound from './middlewares/not-found.js';

// Middlewares
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import postsRouter from './routes/posts.js';
import userRouter from './routes/users.js';
import errorHandlerMiddleware from './middlewares/error-handler.js';
const app = express();

//Middlewares
app.use(express.json({ limit: '30mb' }));
app.use(cors());
app.use(xss());
app.use(helmet());

// Route Middlewares
app.use('/posts', postsRouter);
app.use('/auth/user', userRouter);
app.get('/', (req, res) => res.send('<h1>Memories app server</h1>'));
// Route Middlewares
app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  await connect(process.env.MONGO_URI);
  app.listen(port, console.log(`server started on port: ${port}`));
};
start();
