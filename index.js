const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//Middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://smartDBUser:DJgkGgWOG5ngbsjs@cluster0.fjenzci.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Smart server is running!");
});

async function run() {
  try {
    await client.connect();

    const db = client.db("smart_db");
    const productsCollection = db.collection("products");
    const bidsCollection = db.collection("bids");
    const usersCollection = db.collection("users");

    //USERS API
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const email = req.body.email;
      const query = { email: email };
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        res.send({message:"User already exists"});
      } else {
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
      }
    });


    //PRODUCTS API
    //Read (find All)
    app.get("/products", async (req, res) => {
      //  const email=req.query.email;
      //  const query={};
      //  if(email){
      //    query.email=email;
      //  }
      //const cursor=productsCollection.find(query);

      const cursor = productsCollection.find().sort({ price_min: 1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    //latest products
    app.get('/latest-products', async (req,res)=>{
       const cursor=productsCollection.find().sort({created_at:-1}).limit(6);
       const result=await cursor.toArray();
       res.send(result);
    })


    //Read (load single item by id)
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });


    //Insert
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    //delete
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    //patch
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updatedProduct.name,
          price: updatedProduct.price,
        },
      };
      const result = await productsCollection.updateOne(query, update);
      res.send(result);
    });

    //bids realted APIs

    //Read by email
    app.get("/bids", async (req, res) => {
      const email = req.query.email;
      const query = {};
      console.log("Query: ", req.query);
      if (email) {
        query.buyer_email = email;
      }
      const cursor = bidsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //Bids by product
    app.get('/products/bids/:productId',async (req,res)=>{
        const productId=req.params.productId;
        const query={product:productId}; //product came from db and productId from path

    })

    //insert
    app.post("/bids", async (req, res) => {
      const newBid = req.body;
      const result = await bidsCollection.insertOne(newBid);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (error) {
    console.error("MongoDB connection error", error);
  } finally {
    //await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Smart server is running on port: ${port}`);
});
