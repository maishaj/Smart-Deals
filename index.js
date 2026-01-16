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

    const db=client.db('smart_db');
    const productsCollection=db.collection('products');

    //Read (find All)
    app.get('/products',async (req,res)=>{
       const cursor=productsCollection.find();
       const result=await cursor.toArray();
       res.send(result);
    })

    //Read (load single item by id)
    app.get('/products/:id',async (req,res)=>{
       const id=req.params.id;
       const query={ _id: new ObjectId(id)};
       const result=await productsCollection.findOne(query);
       res.send(result);

    })

    //Insert
    app.post('/products',async (req,res)=>{
       const newProduct=req.body;
       const result=await productsCollection.insertOne(newProduct);
       res.send(result);
    })

    //delete
    app.delete('/products/:id',async (req,res)=>{
       const id=req.params.id;
       const query={ _id: new ObjectId(id)};
       const result=await productsCollection.deleteOne(query);
       res.send(result);
    })

    //patch
     app.patch('/products/:id',async (req,res)=>{
      const id=req.params.id;
      const updatedProduct=req.body;
      const query={ _id: new ObjectId(id)};
      const update={
         $set:{
           name:updatedProduct.name,
           price:updatedProduct.price
         }
      };
      const result=await productsCollection.updateOne(query,update);
      res.send(result);
     })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
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
