const express = require("express");
const router = express.Router();
const axios = require("axios");
const isAuthenticated = require("../middlewares/isAuthenticated");

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

router.post("/my-collection", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    user.games.push(req.body.game);
    await user.save();

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/my-collection", isAuthenticated, async (req, res) => {
  try {
    const responses = await Promise.all(
      req.user.games.map((game) =>
        axios.get(
          `https://api.rawg.io/api/games/${game}?key=${process.env.RAWG_KEY}`
        )
      )
    );

    const games = responses.map((response) => response.data);

    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/my-collection/:gameSlug", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const i = user.games.indexOf(req.params.gameSlug);
    user.games.splice(i, 1);

    await user.save();
    res.status(200).json({
      user: user,
      message: "Game successfully removed from collection",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
