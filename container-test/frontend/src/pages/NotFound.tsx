import { Box, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={20}>
      <VStack spacing={8}>
        <Heading size="2xl" color="gray.800">
          404
        </Heading>
        <Heading size="lg" color="gray.600">
          Page Not Found
        </Heading>
        <Text color="gray.500" fontSize="lg" maxW="md">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </Text>
        <Button
          colorScheme="brand"
          size="lg"
          onClick={() => navigate('/')}
        >
          🏠 Go Back Home
        </Button>
      </VStack>
    </Box>
  );
};

export default NotFound; 