import express from 'express';
import connectDB from './db';

const app = express();

connectDB();

app.listen('3000', () => {
    console.log('server running on http://localhost:3000');
})
