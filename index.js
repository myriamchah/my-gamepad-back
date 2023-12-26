require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/games?key=${process.env.RAWG_KEY}&${req._parsedUrl.query}`
    );

    res.json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/games/:gameSlug", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/games/${req.params.gameSlug}?key=${process.env.RAWG_KEY}`
    );

    const screenshots = await axios.get(
      `https://api.rawg.io/api/games/${req.params.gameSlug}/screenshots?key=${process.env.RAWG_KEY}`
    );

    const others = await axios.get(
      `https://api.rawg.io/api/games/${req.params.gameSlug}/game-series?key=${process.env.RAWG_KEY}`
    );

    res.json({
      game: response.data,
      screenshots: screenshots.data.results,
      others: others.data.results,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
