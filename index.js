const mongoose=require('mongoose');
const dotenv=require('dotenv').config();
const colors =require('colors');
const port=process.env.PORT || 4999;

const app=require('./app');

mongoose.connect(process.env.DB_LOCAL).then(()=>{
    console.log(`DB connection established`.red.bold);
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
