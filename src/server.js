import express from "express";
import {db, DBconnection} from './db.js'

const  app = express();
app.use(express.json());
var port = 8000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5174');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization')
    next();
});

app.get('/api/articles/:name', async (req,res)=>{
    const {name} = req.params;


    const article = await db.collection("articles").findOne({ name });

    if(article){
        res.json(article)
    }else{
        res.sendStatus(404)
    }
})


app.put('/api/articles/:name/upvote', async (req, res)=>{
     const { name } = req.params;


    await db.collection('articles').updateOne({ name }, {
        $inc: {upvotes: 1},
    })

    const article = await db.collection('articles').findOne({name})

     if (article){
        res.send(article)
     }else{
        res.send(`This article doesn't exist!`)
     }
})


app.post('/api/articles/:name/comments', async (req,res)=>{
    const { name } = req.params
    const { postedBy, text } = req.body;

        await db.collection('articles').updateOne({ name }, {
            $push: {comments : {postedBy, text} },
        })

    const article = await db.collection('articles').findOne({ name })

    if(article){
        res.json(article)
    }else{
        res.send(`This Article doesnt exist`)
    }
})

DBconnection( () => {
    console.log('Succesfully connected to database!')
    app.listen(port, ()=>{
        console.log(`server is listening to http://localhost:${port}`)
     });
})
