const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.otpes5b.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try{
        const booksCategories = client.db('book-depo').collection('booksCategories');

        const bookCollections = client.db('book-depo').collection('bookCollections');

        app.get('/bookcategories', async(req, res) => {
            const query = {};
            const result = await booksCategories.find(query).toArray();
            res.send(result);
        })

        app.get('/bookcategories/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id : ObjectId(id)};
            const result = await booksCategories.findOne(filter);
            res.send(result);
            console.log(result);
        })

        app.get('/bookcollections', async(req, res) => {
            const query = {};
            const result = await bookCollections.find(query).toArray();
            res.send(result);
        })

        app.get('/bookcollections/:name', async(req, res) => {
            const name = req.params.name;
            const filter = {categoryName : name}
            const result = await bookCollections.findOne(filter).toArray();
            res.send(result);
        })
    }
    finally{}
}
run().catch(error => console.log(error));

app.get('/', (req, res) => {
    res.send(`Book Depo Server is RUNNING.`);
})

app.listen(port, () => {
    console.log(`Book Depo Server RUNNING on ${port}`)
})