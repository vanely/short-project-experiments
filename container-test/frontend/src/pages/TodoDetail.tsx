import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useTodo, useUpdateTodo, useDeleteTodo } from '../hooks/useTodos';
import { UpdateTodoRequest } from '../api/todos';

const TodoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [editingData, setEditingData] = useState<UpdateTodoRequest>({});
  
  const { data: todo, isLoading, error } = useTodo(id!);
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const handleUpdateTodo = async () => {
    if (!todo) return;

    try {
      await updateTodoMutation.mutateAsync({
        id: todo.id,
        updates: editingData,
      });
      onClose();
      toast({
        title: 'Todo updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to update todo',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteTodo = async () => {
    if (!todo) return;

    try {
      await deleteTodoMutation.mutateAsync(todo.id);
      toast({
        title: 'Todo deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Failed to delete todo',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const openEditModal = () => {
    if (todo) {
      setEditingData({
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
      });
      onOpen();
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" color="brand.500" />
        <Text mt={4} color="gray.600">Loading todo...</Text>
      </Box>
    );
  }

  if (error || !todo) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <AlertTitle>Error loading todo!</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'Todo not found'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            size="lg"
          >
            ← Back to Todos
          </Button>
          <HStack spacing={3}>
            <Button
              colorScheme="brand"
              onClick={openEditModal}
              size="lg"
            >
              ✏️ Edit Todo
            </Button>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={handleDeleteTodo}
              size="lg"
              isLoading={deleteTodoMutation.isPending}
            >
              🗑️ Delete Todo
            </Button>
          </HStack>
        </HStack>

        {/* Todo Details */}
        <Card>
          <CardHeader>
            <VStack align="flex-start" spacing={3}>
              <HStack spacing={4} align="center" w="full">
                <Checkbox
                  isChecked={todo.completed}
                  isReadOnly
                  colorScheme="brand"
                  size="lg"
                />
                <Heading size="lg" color="gray.800" flex={1}>
                  {todo.title}
                </Heading>
                <Badge
                  colorScheme={todo.completed ? 'green' : 'yellow'}
                  variant="subtle"
                  fontSize="md"
                  px={3}
                  py={1}
                >
                  {todo.completed ? 'Completed' : 'Pending'}
                </Badge>
              </HStack>
              {todo.description && (
                <Text color="gray.600" fontSize="lg">
                  {todo.description}
                </Text>
              )}
            </VStack>
          </CardHeader>
          
          <Divider />
          
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="semibold" color="gray.700">
                  Created:
                </Text>
                <Text color="gray.600">
                  {new Date(todo.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </HStack>
              
              <HStack justify="space-between">
                <Text fontWeight="semibold" color="gray.700">
                  Last Updated:
                </Text>
                <Text color="gray.600">
                  {new Date(todo.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </HStack>
              
              <HStack justify="space-between">
                <Text fontWeight="semibold" color="gray.700">
                  Status:
                </Text>
                <Badge
                  colorScheme={todo.completed ? 'green' : 'yellow'}
                  variant="subtle"
                  fontSize="sm"
                >
                  {todo.completed ? 'Completed' : 'In Progress'}
                </Badge>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>

      {/* Edit Todo Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Todo title"
                value={editingData.title || ''}
                onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={editingData.description || ''}
                onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                rows={3}
              />
              <Checkbox
                isChecked={editingData.completed || false}
                onChange={(e) => setEditingData({ ...editingData, completed: e.target.checked })}
                colorScheme="brand"
              >
                Mark as completed
              </Checkbox>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                onClick={handleUpdateTodo}
                isLoading={updateTodoMutation.isPending}
              >
                ✓ Update Todo
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TodoDetail; 