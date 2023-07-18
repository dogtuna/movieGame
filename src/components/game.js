import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  Heading,
  useColorMode,
  IconButton,
  extendTheme,
  ThemeProvider,
  CSSReset,
  ColorModeProvider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import "animate.css/animate.min.css";

const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.800" : "white",
        color: props.colorMode === "dark" ? "white" : "gray.800",
      },
    }),
  },
});

function Game() {
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [previousAnswers, setPreviousAnswers] = useState([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allActors, setAllActors] = useState([]);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);

  const ACTORS = [
    "Scarlett Johansson",
    "Robert Downey Jr.",
    "Samuel L. Jackson",
    "Zoe Saldana",
    "Chris Evans",
    "Chris Pratt",
    "Vin Diesel",
    "Chris Hemsworth",
    "Tom Cruise",
    "Chadwick Boseman",
    "Bradley Cooper",
    "Tom Hanks",
    "Johnny Depp",
    "Dwayne Johnson",
    "Tom Holland",
    "Mark Ruffalo",
    "Emma Watson",
    "Don Cheadle",
    "Jeremy Renner",
    "Will Smith",
    "Karen Gillan",
    "Elizabeth Olsen",
    "Daniel Radcliffe",
    "Benedict Cumberbatch",
    "Dave Bautista",
    "Harrison Ford",
    "Josh Brolin",
    "Rupert Grint",
    "Letitia Wright",
    "Steve Carell",
    "Matt Damon",
    "Sebastian Stan",
    "Leonardo DiCaprio",
    "Tom Hiddleston",
    "Brad Pitt",
    "Paul Bettany",
    "Bruce Willis",
    "Eddie Murphy",
    "Liam Neeson",
    "Pom Klementieff",
    "Benedict Wong",
    "Sam Worthington",
    "Ben Stiller",
    "Hugh Jackman",
    "Jack Black",
    "Ian McKellen",
    "Gwyneth Paltrow",
    "Jennifer Lawrence",
    "Nicolas Cage",
    "Mark Wahlberg",
    "Cameron Diaz",
    "Ewan McGregor",
    "Jason Statham",
    "Jim Carrey",
    "Idris Elba",
    "Natalie Portman",
    "Christian Bale",
    "Josh Gad",
    "Julia Roberts",
    "Paul Rudd",
    "Sandra Bullock",
    "Brie Larson",
    "Martin Freeman",
    "Adam Sandler",
    "Keanu Reeves",
    "Ralph Fiennes",
    "Ben Affleck",
    "Ryan Reynolds",
    "Robert De Niro",
    "Michelle Rodriguez",
    "Sylvester Stallone",
    "Adam Driver",
    "Owen Wilson",
    "Daniel Craig",
    "Daisy Ridley",
    "Morgan Freeman",
    "John Boyega",
    "Robin Williams",
    "Orlando Bloom",
    "Melissa McCarthy",
    "Mel Gibson",
    "George Clooney",
    "Kevin Hart",
    "Robert Pattinson",
    "Lupita Nyong'o",
    "Simon Pegg",
    "Arnold Schwarzenegger",
    "Shia LaBeouf",
    "Evangeline Lilly",
    "Meryl Streep",
    "Anthony Mackie",
    "Jude Law",
    "Jon Favreau",
    "Mark Hamill",
    "Denis Leary",
    "Denzel Washington",
    "Anthony Hopkins",
    "Keegan-Michael Key",
    "J.K. Simmons",
    "John Goodman",
    "Channing Tatum",
    "Tim Allen",
    "Russell Crowe",
    "Sam Rockwell",
    "Michael Caine",
    "John Travolta",
    "Joaquin Phoenix",
    "Kristen Stewart",
    "Jason Bateman",
    "Chris Pine",
    "Michael Fassbender",
    "James McAvoy",
    "Emma Stone",
    "Charlize Theron",
    "Vincent D'Onofrio",
    "Michael Keaton",
    "Hugo Weaving",
    "James Franco",
    "Jared Leto",
    "Judi Dench",
    "Zach Galifianakis",
    "Jonah Hill",
    "Seth Rogen",
    "Bill Murray",
    "Will Ferrell",
    "Vince Vaughn",
    "Amy Adams",
  ];
  const [movieData, setMovieData] = useState(null);
  const [actorData, setActorData] = useState(null);
  const [allMovies, setAllMovies] = useState([]);

  useEffect(() => {
    getActorMovies();
    getAllActors();
    getAllMovies();
  }, []);

  const { colorMode, toggleColorMode } = useColorMode();

  const ColorModeSwitch = () => {
    return (
      <IconButton
        icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
        onClick={toggleColorMode}
        alignSelf="flex-end"
      />
    );
  };

  const getAllMovies = async () => {
    try {
      const response = await axios.get(
        "https://moviegame-de7d4fc3ae1e.herokuapp.com/api/movies"
      );
      setAllMovies(response.data);
    } catch (error) {
      console.error("Failed to fetch all movies:", error);
    }
  };

  const getAllActors = async () => {
    try {
      const response = await axios.get(
        "https://moviegame-de7d4fc3ae1e.herokuapp.com/api/actors"
      );
      setAllActors(response.data);
    } catch (error) {
      console.error("Failed to fetch all actors:", error);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setUserInput(value);

    if (value === "") {
      setSuggestions([]);
    } else if (question.includes("movie")) {
      const newSuggestions = allMovies
        .filter((title) => title.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(newSuggestions);
    } else if (question.includes("actor")) {
      const newSuggestions = allActors
        .filter((actor) => actor.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(newSuggestions);
    }
  };

  const getActorMovies = async () => {
    const randomActor = ACTORS[Math.floor(Math.random() * ACTORS.length)];
    setQuestion(`Name a movie that ${randomActor} has been in.`);
    setAnswer(randomActor);
    try {
      const response = await axios.get(`/api/person?name=${randomActor}`);
      const actorId = response.data.id;
      const moviesResponse = await axios.get(`/api/person/${actorId}/movies`);
      setMovieData(moviesResponse.data);
      console.log(moviesResponse.data);
    } catch (error) {
      console.error("Failed to fetch actor data:", error);
    }
  };

  const getMovieCast = async (movieTitle) => {
    try {
      const movieResponse = await axios.get(`/api/movie?title=${movieTitle}`);
      const movieId = movieResponse.data.id;
      const castResponse = await axios.get(`/api/movie/${movieId}/credits`);
      setActorData(castResponse.data);
      console.log(castResponse.data);
    } catch (error) {
      console.error("Failed to fetch movie cast:", error);
    }
  };

  const handleSubmit = async (event) => {
    const previousAnswer = answer;
    event.preventDefault();

    if (question.includes("movie")) {
      const movie = userInput;
      const actor = answer;

      const isCorrect = movieData.cast.some(
        (castMember) => castMember.title && castMember.title === movie
      );

      if (isCorrect) {
        // Store the movie title
        setMovieTitle(movie);
        setScore(score + 1);
        setQuestion(`Name another actor in ${movie}.`);
        setAnswer(movie);
        getMovieCast(movie);
      } else {
        setGameOver(true);
        setIsGameOverModalOpen(true);
      }
    } else if (question.includes("actor")) {
      const actor = userInput;
      const movie = answer;

      try {
        const response = await axios.get(`/api/person?name=${actor}`);
        const actorId = response.data.id;
        const moviesResponse = await axios.get(`/api/person/${actorId}/movies`);

        const isCorrect = moviesResponse.data.cast.some(
          (castMember) => castMember.title && castMember.title === movieTitle
        );

        if (isCorrect) {
          setScore(score + 1);
          setQuestion(`Name a movie that ${actor} has been in.`);
          setAnswer(actor);
          setMovieData(moviesResponse.data); // update movieData
        } else {
          setGameOver(true);
        }
      } catch (error) {
        console.error("Failed to fetch actor data:", error);
      }
    }
    setUserInput("");
  };

  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider options={{ initialColorMode: "light" }}>
        <CSSReset />
        <VStack
          p={4}
          width="100%"
          maxW="100%"
          align="center"
          className="animate__animated animate__fadeIn"
        >
          <ColorModeSwitch />
          <Heading as="h1" size="2xl" mb={6}>
            Film Connections
          </Heading>
          <Text
            style={{
              fontSize: "xl",
              transition: "color 0.5s ease-in-out",
              color: score > 0 ? "green" : "black",
            }}
          >
            Score: {score}
          </Text>
          {!gameOver && (
            <Box
              as="form"
              onSubmit={handleSubmit}
              mt={6}
              width="md"
              className="animate__animated animate__fadeInUp"
            >
              <Text fontSize="xl" mb={4}>
                {question}
              </Text>
              <Input
                mb={4}
                type="text"
                value={userInput}
                onChange={handleInputChange}
              />
              {suggestions.map((suggestion) => (
                <Text
                  key={suggestion}
                  onClick={() => {
                    setUserInput(suggestion);
                    setSuggestions([]); // This will clear the suggestions
                  }}
                  cursor="pointer"
                  color="blue.500"
                  mb={2}
                >
                  {suggestion}
                </Text>
              ))}
              <Button colorScheme="blue" type="submit">
                Submit
              </Button>
            </Box>
          )}
          {gameOver && (
            <Modal
              isOpen={isGameOverModalOpen}
              onClose={() => {
                window.location.reload();
                setGameOver(false);
                setIsGameOverModalOpen(false);
              }}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader fontSize="3xl" fontFamily="Helvetica-Bold">
                  Game Over!
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text fontSize="2xl" mb={4}>
                    Your score was {score}.
                  </Text>
                  <Button
                    colorScheme="blue"
                    onClick={() => window.location.reload()}
                  >
                    Play Again?
                  </Button>
                </ModalBody>
              </ModalContent>
            </Modal>
          )}
        </VStack>
      </ColorModeProvider>
    </ThemeProvider>
  );
}

export default Game;
