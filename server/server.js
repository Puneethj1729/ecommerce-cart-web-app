const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const morgan=require('morgan');
const cors=require('cors');
const fs=require('fs');
require('dotenv').config();

const app= express();

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useFindAndModify:false,
    useCreateIndex:true,
    useUnifiedTopology: true

}).then(()=>{
    console.log('Database Connected Successfully');
})
.catch((err)=>{
    console.log("Database Connection Failed!");
});

app.use(morgan('dev'));
app.use(bodyParser.json({limit:"2mb"}));
app.use(cors());

//Routes Middleware
fs.readdirSync("./routes").map((r)=>{
    app.use('/api',require("./routes/"+r));
});
const port=process.env.PORT || 8000;
app.listen(port,()=>{
    console.log(`Server is Running on ${port} successfully`);
});