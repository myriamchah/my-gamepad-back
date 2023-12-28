require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

const userRoutes = require("./routes/user");
const gameRoutes = require("./routes/game");

app.use(userRoutes);
app.use(gameRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
