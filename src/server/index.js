const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path"); 

const app = express();
const PORT = process.env.PORT || 5001; // Use the port from the environment variables if available

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
require("dotenv").config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

app.use(cors());

// Simple logger
function log(message) {
  const time = new Date();
  console.log(`[${time.toLocaleString()}]: ${message}`);
}

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, '../build')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

app.get("/api/actors", async (req, res) => {
  let allActors = [];
  for (let i = 1; i <= 50; i++) {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/person/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${i}`
      );
      allActors.push(...response.data.results);
    } catch (error) {
      log("Error getting popular actors: " + error.message);
      res.status(500).json({ message: "Error getting popular actors" });
      return; // to break the loop in case of an error
    }
  }
  res.json(allActors);
});

app.get("/api/person", async (req, res) => {
  const personName = req.query.name;

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${personName}`
    );

    if (!response.data.results[0])
      res.status(404).json({ message: "Person not found" });
    else res.json(response.data.results[0]); // send back the first result
  } catch (error) {
    log("Error searching for person: " + error.message);
    res.status(500).json({ message: "Error searching for person" });
  }
});

app.get("/api/person/:id/movies", async (req, res) => {
  const personId = req.params.id;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    log("Error getting person's movies: " + error.message);
    res.status(500).json({ message: "Error getting person's movies" });
  }
});

app.get("/api/movie", async (req, res) => {
  const movieTitle = req.query.title;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${movieTitle}`
    );
    if (!response.data.results[0])
      res.status(404).json({ message: "Movie not found" });
    else res.json(response.data.results[0]); // send back the first result
  } catch (error) {
    log("Error searching for movie: " + error.message);
    res.status(500).json({ message: "Error searching for movie" });
  }
});

//get movie's cast
app.get("/api/movie/:id/credits", async (req, res) => {
  const movieId = req.params.id;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`
    );
    res.json(response.data.cast);
  } catch (error) {
    log("Error getting movie's cast: " + error.message);
    res.status(500).json({ message: "Error getting movie's cast" });
  }
});

app.get("/api/movies", async (req, res) => {
  let allMovies = [];
  for (let i = 1; i <= 50; i++) {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&page=${i}`
      );
      allMovies.push(...response.data.results.map((movie) => movie.title));
    } catch (error) {
      log("Error getting movies: " + error.message);
      res.status(500).json({ message: "Error getting movies" });
      return; // to break the loop in case of an error
    }
  }
  res.json(allMovies);
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });