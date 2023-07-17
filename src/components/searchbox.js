import { useState, useEffect } from "react";
import { Box, Input, VStack, Text, Button } from "@chakra-ui/react";
import axios from "axios";

const SearchBox = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);

    // Send a request to your server
    axios
      .get(`http://localhost:5001/search?q=${query}`)
      .then((response) => {
        setResults(response.data.Search || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [query]);

  const handleSelectMovie = (title) => {
    console.log("Selected Movie:", title);
    onSelect(title);
    onClose();
  };

  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="md">
      <Input
        placeholder="Search movie titles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <VStack spacing={2} mt={2}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          results.map((movie, i) => (
            <Button key={i} onClick={() => handleSelectMovie(movie.Title)}>
              {movie.Title}
            </Button>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default SearchBox;
