const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.otpes5b.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try{

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