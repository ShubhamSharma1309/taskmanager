import express from 'express';
const app = express();

console.log('hello bro');

app.listen('3000',()=>{
    console.log('It is running on http://localhost:3000');
})