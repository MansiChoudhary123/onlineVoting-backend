if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const routes = require("./routes");

const jwt = require("jsonwebtoken");
const cors = require("cors");

server.use(
  cors({
    origin: "*",
  })
);

// Middlewares
const auth = (req, res, next) => {
  try {
    const token = req.get("Authorization").split("Bearer ")[1];
    console.log(token);
    var decoded = jwt.verify(token, process.env.secretKey);
    if (decoded.email) {
      next();
    } else {
      return res.sendStatus(401);
    }
    console.log(decoded);
  } catch (err) {
    return res.sendStatus(401);
  }
};

server.use(express.json());

// Use the auth middleware for the /ballot route
server.use("/ballot", routes.router);

// db connection
const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to database");
  } catch (err) {
    console.error(err);
  }
};

main()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log("Server started");
    });
  })
  .catch((err) => console.error(err));
