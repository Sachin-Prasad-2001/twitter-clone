const express = require('express');
const cors = require('cors');
const monk = require('monk');
const rateLimit = require('express-rate-limit');

const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/meower');
const mews = db.get('mews');

app.use(cors());
app.use(express.json());


app.get('/',(req,res)=>{
    res.json({
        message:'Twitter'
    });
});

app.get('/mews',(req,res)=>{
    mews
     .find()
     .then(mews=>{
         res.json(mews);
     });

});

function isValidMew(mew){
    return mew.name&&mew.content;
}

app.use(rateLimit({
    windowMs: 30*1000,
    max:1
}));

app.post('/mews',(req,res)=>{
    if(isValidMew(req.body)){
        //insert into db
        const mew={
            name:req.body.name.toString(),
            content:req.body.content.toString(),
            created:Date()
        };

        mews
          .insert(mew)
          .then(createdMew=>{
              res.json(createdMew);
          });
    }
    else{
        res.status(422);
        res.json({
            message:'Name and content are required!!!!!!!'
        });
    }
});

app.listen(5000,()=>{
    console.log('listening on 5000');
});