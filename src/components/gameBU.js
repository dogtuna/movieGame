import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Input, Text, VStack, Heading } from "@chakra-ui/react";

function Game() {
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [previousAnswers, setPreviousAnswers] = useState([]);
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

  useEffect(() => {
    const randomActor = ACTORS[Math.floor(Math.random() * ACTORS.length)];
    setQuestion(`Name a movie that ${randomActor} has been in.`);
    setAnswer(randomActor);

    // Fetch movie data for the initial actor
    axios
      .get(`http://localhost:5001/api/person?name=${randomActor}`)
      .then((response) => {
        const actorId = response.data.id;
        axios
          .get(`http://localhost:5001/api/person/${actorId}/movies`)
          .then((response) => {
            setMovieData(response.data);
          })
          .catch((error) => {
            console.error("Failed to fetch actor's movies:", error);
          });
      })
      .catch((error) => {
        console.error("Failed to fetch actor data:", error);
      });
  }, []);

  const handleSubmit = async (event) => {
    const previousAnswer = answer;
    console.log(
      `Question: ${question}, Answer: ${answer}, User Input: ${userInput}`
    );
    const input = userInput;
    event.preventDefault();

    // Check if the answer has been given before
    if (previousAnswers.includes(input)) {
      setGameOver(true);
      return;
    } else {
      setPreviousAnswers([...previousAnswers, input]);
    }

    try {
      if (question.includes("movie")) {
        const movie = userInput;
        const actor = answer;

        const isCorrect = movieData.cast.some(
          (castMember) => castMember.title && castMember.title === input
        );

        if (isCorrect) {
          setScore(score + 1);
          setQuestion(`Name another actor in ${movie}.`);
          setAnswer(movie);
        } else {
          setGameOver(true);
        }
      } else if (question.includes("actor")) {
        const actor = userInput;
        const movie = answer;

        const isCorrect = actorData.cast.some(
          (castMember) =>
            castMember.name && castMember.name.toLowerCase() === input
        );

        if (isCorrect) {
          setScore(score + 1);
          setQuestion(`Name a movie that ${actor} has been in.`);
          setAnswer(actor);
        } else {
          setGameOver(true);
        }
      }
    } catch (error) {
      console.error(error);
      setGameOver(true);
    }

    setUserInput("");
  };

  return (
    <VStack p={4} width="100%" align="center">
      <Heading as="h1" size="2xl" mb={6}>
        Film Connections
      </Heading>
      <Text fontSize="xl">Score: {score}</Text>
      {!gameOver && (
        <Box as="form" onSubmit={handleSubmit} mt={6} width="md">
          <Text fontSize="xl" mb={4}>
            {question}
          </Text>
          <Input
            mb={4}
            type="text"
            value={userInput}
            onChange={(event) => setUserInput(event.target.value)}
          />
          <Button colorScheme="blue" type="submit">
            Submit
          </Button>
        </Box>
      )}
      {gameOver && (
        <Text fontSize="xl" color="red.500" mt={6}>
          Game over! Your score was {score}.
        </Text>
      )}
    </VStack>
  );
}

export default Game;
