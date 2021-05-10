const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Chill Out Restaurant Server Is Here :)');
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d0ugz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const foodsCollection = client.db(process.env.DB_NAME).collection("foods");
  if (err) {
    console.log('Database not connected');
    console.log(err);
  }
  else {

    app.post('/addFood', (req, res) => {
      const newFood = req.body;
      foodsCollection.insertOne(newFood)
        .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount > 0);
        })
    })

    app.get('/foods/:category', (req, res) => {
      const category = req.params.category;
      foodsCollection.find({ food_category: category })
        .toArray((err, documents) => {
          res.send(documents)
        })
    })

    app.get('/food/:foodId', (req, res) => {
      const foodId = req.params.foodId;
      foodsCollection.find({ _id: ObjectId(foodId) })
        .toArray((err, documents) => {
          res.send(documents[0])
        })
    })

  }
});

app.listen(port)