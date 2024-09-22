import express from 'express';
import connectDB from './db';
import configs from './configs';
import cors from 'cors';
import ErrorHandler from './utils/Error';
import { errorMiddleware } from './middleware/ErrorHandler';
import authRouter from './routers/auth.router';
import taskRouter from './routers/task.router';
import { apiRateLimit } from './middleware/rateLimiter';

const app = express();
connectDB().then(() => {
    if (process.env.NODE_ENV !== 'production') {
        app.listen(configs.PORT, () => {

            console.log(`Server running on PORT: ${configs.PORT}`);
            console.log('Running in development mode');
        });
    }
}).catch((err:any)=>console.log(err));

//app use cors
app.use(cors({
    origin: configs.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
console.log(configs.CORS_ORIGIN);


//app use config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.use(apiRateLimit);
app.use(errorMiddleware);

export default app;