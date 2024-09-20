import express from 'express';
import connectDB from './db';
import configs from './configs';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ErrorHandler from './utils/Error';
import { errorMiddleware } from './middleware/ErrorHandler';
import authRouter from './routers/auth.router';
import taskRouter from './routers/task.router';

const app = express();
connectDB();

//app use cors
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

//app use config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tasks', taskRouter);
app.get('/', (req, res) => {
    res.json({
        message: "hello"
    });
});

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
    next(new ErrorHandler(404, 'Not found'));
});
app.use(errorMiddleware);

app.listen(configs.PORT, () => {
    console.log(`server running on PORT : ${configs.PORT}`);
});

export default app;