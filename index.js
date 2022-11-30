const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt =  require('jsonwebtoken'); 
require('dotenv').config();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.otpes5b.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try{
        const booksCategories = client.db('book-depo').collection('booksCategories');

        const bookCollections = client.db('book-depo').collection('bookCollections');

        const bookingCollection = client.db('book-depo').collection('bookings');

        const usersCollection = client.db('book-depo').collection('users');

        app.get('/bookcategories', async(req, res) => {
            const query = {};
            const result = await booksCategories.find(query).toArray();
            res.send(result);
        });

        app.get('/bookcategories/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id : ObjectId(id)};
            const result = await booksCategories.findOne(filter);
            res.send(result);
            console.log(result);
        });

        app.get('/bookcollections', async(req, res) => {
            const query = {};
            const result = await bookCollections.find(query).toArray();
            res.send(result);
            console.log(result);
        });

        app.get('/bookcollections/:name', async(req, res) => {
            const name = req.params.name;
            const filter = {categoryName : name}
            const result = await bookCollections.find(filter).toArray();
            res.send(result);
            console.log(result);
        });

        //new API for modal booking data;
        
        //Creating or POST Method of CRUD
        app.post('/bookings', async(req, res) => {
            const booking = req.body;
            console.log(booking);

            const query = {
                name: booking.name,
                email: booking.email,
                productName: booking.productName,
                location: booking.location,
                phoneNumber: booking.phoneNumber,
                price: booking.price
            }

            const alreadyBooked = await bookingCollection.find(query).toArray();

            if(alreadyBooked.length){
                const message = `You have already booked ${booking.productName}`;
                return res.send({acknowledge: false, message})
            }

            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        });

        app.get('/bookings', async(req, res) => {
            const email = req.query.email;

            console.log(email);

            const query = {email:email};

            const bookings = await bookingCollection.find(query).toArray();
            
            res.send(bookings);
        });
        
        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const booking = await bookingCollection.findOne(query);
            res.send(booking);
        });

        app.get('/jwt', async(req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const user = await usersCollection.findOne(query);
            if(user){
                const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '1h'})
                return res.send({accessToken: token});
            }
            res.status(403).send({accessToken: ''});
        })

        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        app.put('/users/admin/:id', verifyJWT, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

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