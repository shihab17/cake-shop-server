const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
    console.log('Welcome to Cake-shop Server')
    res.send('Welcome to Cake-shop Server')
})
console.log(process.env.DB_USER)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8zovd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err)
    const serviceCollection = client.db("cakeShop").collection("services");
    const adminCollection = client.db("cakeShop").collection("admin");
    const reviewCollection = client.db("cakeShop").collection("review");
    const checkoutCollection = client.db("cakeShop").collection("checkout");
    const ordersCollection = client.db("cakeShop").collection("orders");
    const bookingsCollection = client.db("cakeShop").collection("bookings");
    // perform actions on the collection object
    app.post('/makeAdmin', (req, res) => {
        console.log(req.body)
        adminCollection.insertOne(req.body)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })
    app.post('/addReview', (req, res) => {
        console.log(req.body)
        reviewCollection.insertOne(req.body)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })
    app.post('/addService', (req, res) => {
        const serviceData = req.body;
        console.log(serviceData)
        serviceCollection.insertOne(serviceData)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })
    app.post('/addCheckout', (req, res) => {
        const checkoutData = req.body;
        console.log(checkoutData)
        checkoutCollection.insertOne(checkoutData)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })
    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        console.log(newOrder)
        ordersCollection.insertOne(newOrder)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })
    app.post('/addBooking', (req, res) => {
        const newBookings = req.body;
        console.log(newBookings)
        bookingsCollection.insertOne(newBookings)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })
    app.get('/services', (req, res) => {
        serviceCollection.find()
            .toArray((err, services) => {
                res.send(services)
            })
    })
    app.get('/testimonials', (req, res) => {
        serviceCollection.find()
            .toArray((err, testimonial) => {
                res.send(testimonial)
            })
    })
    app.get('/checkout', (req, res) => {
        checkoutCollection.find()
            .toArray((err, checkout) => {
                res.send(checkout)
            })
    })
    app.get('/checkout/:email', (req, res) => {
        const email = req.params.email;
        console.log(email)
        checkoutCollection.find({ "email": email })
            .toArray((err, checkout) => {
                res.send(checkout)
            })
    })
    app.get('/order/:email', (req, res) => {
        const email = req.params.email;
        ordersCollection.find({ "email": email })
            .toArray((err, order) => {
                res.send(order)
            })
    })
    app.delete('/deleteCheckout/:email', (req, res) => {
        const email = req.params.email;
        console.log(email)
        checkoutCollection.deleteMany({ "email": email })
            .then(documents => res.send(!!documents.value))
    })
    app.delete('/deleteOrder/:email', (req, res) => {
        const email = req.params.email;
        console.log(email)
        ordersCollection.deleteMany({ "email": email })
            .then(documents => res.send(!!documents.value))
    })
    app.get('/checkout/:id', (req, res) => {
        checkoutCollection.find({ _id: ObjectID(req.params.id) })
            .toArray((err, doc) => {
                res.send(doc);
                console.log(err);
            })
    })

    app.get('/booking', (req, res) => {
        bookingsCollection.find()
            .toArray((err, booking) => {
                res.send(booking)
            })
    })

    app.delete('/deleteCheckout/:checkoutId', (req, res) => {
        const checkoutId = ObjectID(req.params.checkoutId)
        checkoutCollection.findOneAndDelete({ _id: checkoutId })
            .then(documents => res.send(!!documents.value))
    })
    app.patch('/updateCheckout/:checkoutId', (req, res) => {
        const checkoutId = ObjectID(req.params.checkoutId)
        console.log(req.body)
        checkoutCollection.updateOne({ _id: checkoutId }, {
            $set: { quantity: req.body.quantity }
        })
            .then(result => {
                res.send(result);
                console.log(result.modifiedCount)
            })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        console.log('isAdmin', email)
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            })
    })
    // client.close();
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})