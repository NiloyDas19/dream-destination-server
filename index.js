const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(cors());
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
    await client.connect();
    const touristsPlaceCollection = client.db("dreamDestinationDB").collection('touristsPlace');

    app.get('/addTouristsSpot', async(req, res) => {
        const cursor = touristsPlaceCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // app.get('/myList/:email', async(req, res) => {
    //     const email = req.params.email;
    //     const query = {user_email: new ObjectId(email)};
    //     const result = await touristsPlaceCollection.find(query);
    //     res.send(result);
    // })

    app.post('/addTouristsSpot', async(req, res)=>{
      const newTouristsSpot = req.body;
      console.log(newTouristsSpot);
      const result = await touristsPlaceCollection.insertOne(newTouristsSpot);
      res.send(result);
    })

    // app.put('/coffee/:id', async(req, res) => {
    //   const id = req.params.id;
    //   const filter = {_id: new ObjectId(id)};
    //   const options = { upsert: true };
    //   const updatedCoffee = req.body;

    //   const updateCoffee = {
    //     $set: {
    //       name: updatedCoffee.name,
    //       chef: updatedCoffee.chef,
    //       supplier: updatedCoffee.supplier,
    //       taste: updatedCoffee.taste,
    //       category: updatedCoffee.category,
    //       details: updatedCoffee.details,
    //       photoUrl: updatedCoffee.photoUrl,
    //     }
    //   }

    //   const result = await coffeeCollection.updateOne(filter, updateCoffee, options);

    //   res.send(result);
    // })


    // app.delete('/coffee/:id', async(req, res) => {
    //     const id = req.params.id;
    //     const query = {_id: new ObjectId(id)};
    //     const result = await coffeeCollection.deleteOne(query);
    //     res.send(result);
    // })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req, res) => {
    res.send('dream destination server is running...');
})


app.listen(port, () => {
    console.log(`dream destination server is running in the ${port} port`);
})

