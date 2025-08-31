import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="white" borderBottom="1px" borderColor="gray.200" py={6}>
        <Container maxW="container.lg">
          <VStack spacing={2} align="center">
            <Heading size="lg" color="brand.600">
              📝 Todo App
            </Heading>
            <Text color="gray.600" fontSize="sm">
              Manage your tasks with ease
            </Text>
          </VStack>
        </Container>
      </Box>
      
      <Container maxW="container.lg" py={8}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 