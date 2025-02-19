const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT || 5000
const app = express()


// middleware

app.use(cors({
  origin: ['https://dream-destination-9ba69.firebaseapp.com', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x3wylq5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const touristsPlaceCollection = client.db("dreamDestinationDB").collection('touristsPlace');
    const countriesCollection = client.db("dreamDestinationDB").collection('countries');

    app.get('/addTouristsSpot', async (req, res) => {
      const cursor = touristsPlaceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/countries', async (req, res) => {
      const cursor = countriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/viewDetails/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristsPlaceCollection.findOne(query);
      res.send(result);
    })

    app.get('/viewDetailsForSpecificCountry/:country_Name', async (req, res) => {
      const country_name = req.params.country_Name;
      const cursor = touristsPlaceCollection.find({ country_Name: country_name });
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/myList/:email', async (req, res) => {
      const email = req.params.email;
      const cursor = touristsPlaceCollection.find({ user_email: email });
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/addTouristsSpot', async (req, res) => {
      const newTouristsSpot = req.body;
      console.log(newTouristsSpot);
      const result = await touristsPlaceCollection.insertOne(newTouristsSpot);
      res.send(result);
    })

    app.put('/touristsSpot/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedTouristsSpot = req.body;

      const updateTouristsSpot = {
        $set: {
          tourists_spot_name: updatedTouristsSpot.tourists_spot_name,
          country_Name: updatedTouristsSpot.country_Name,
          total_visitors_per_year: updatedTouristsSpot.total_visitors_per_year,
          location: updatedTouristsSpot.location,
          short_description: updatedTouristsSpot.short_description,
          average_cost: updatedTouristsSpot.average_cost,
          seasonality: updatedTouristsSpot.seasonality,
          travel_time: updatedTouristsSpot.travel_time,
          image: updatedTouristsSpot.image,
        }
      }

      const result = await touristsPlaceCollection.updateOne(filter, updateTouristsSpot, options);

      res.send(result);
    })


    app.delete('/touristsSpot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristsPlaceCollection.deleteOne(query);
      res.send(result);
    })




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('dream destination server is running...');
})


app.listen(port, () => {
  console.log(`dream destination server is running in the ${port} port`);
})

