const express= require('express');
require("dotenv/config");
require("./database/db").connect();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app=express();
const PORT=3002;
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});



app.use(express.static(path.resolve("./images")));
app.use("/images", express.static(path.resolve("./images")));
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
const commonRoutes = require("./routes/common");
app.use("/", commonRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`listening  on port ${PORT}`);
})