require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectMongoDB } = require("./db");
const urlRoute = require("./routes/urlRoutes");
const URL = require('./models/url');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

connectMongoDB(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

app.use(express.json());
app.use("/url", urlRoute);

app.get('/:shortId',async(req,res)=>{
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate({
     shortId,
  }
,{
  $push:{
    visitHistory:{
      timestamp:Date.now(),
    },
  },
});
  res.redirect(entry. requiredURL);
}
);

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});