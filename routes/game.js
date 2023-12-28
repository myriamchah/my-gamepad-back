const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/games?key=${process.env.RAWG_KEY}&${req._parsedUrl.query}`
    );

    res.json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/games/:gameSlug", async (req, res) => {
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

    const trailers = await axios.get(
      `https://api.rawg.io/api/games/${req.params.gameSlug}/movies?key=${process.env.RAWG_KEY}`
    );

    const trailer = trailers.data.results[0];

    res.json({
      game: response.data,
      screenshots: screenshots.data.results,
      others: others.data.results,
      trailer: trailer,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
