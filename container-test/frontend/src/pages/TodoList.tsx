import { useState } from 'react';
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
  CardHeader,
  CardFooter,
  Checkbox,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo, useToggleTodo } from '../hooks/useTodos';
import { CreateTodoRequest, UpdateTodoRequest } from '../api/todos';

const TodoList = () => {
  const [newTodo, setNewTodo] = useState<CreateTodoRequest>({ title: '', description: '' });
  const [editingTodo, setEditingTodo] = useState<{ id: string; data: UpdateTodoRequest } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  
  const navigate = useNavigate();
  const toast = useToast();
  
  const { data: todos, isLoading, error } = useTodos();
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();
  const toggleTodoMutation = useToggleTodo();

  const handleCreateTodo = async () => {
    if (!newTodo.title.trim()) {
      toast({
        title: 'Title is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await createTodoMutation.mutateAsync(newTodo);
      setNewTodo({ title: '', description: '' });
      onClose();
      toast({
        title: 'Todo created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to create todo',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateTodo = async () => {
    if (!editingTodo) return;

    try {
      await updateTodoMutation.mutateAsync({
        id: editingTodo.id,
        updates: editingTodo.data,
      });
      setEditingTodo(null);
      onEditClose();
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

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodoMutation.mutateAsync(id);
      toast({
        title: 'Todo deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
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

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      await toggleTodoMutation.mutateAsync({ id, completed });
    } catch (error) {
      toast({
        title: 'Failed to toggle todo',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const openEditModal = (todo: any) => {
    setEditingTodo({
      id: todo.id,
      data: { title: todo.title, description: todo.description, completed: todo.completed }
    });
    onEditOpen();
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" color="brand.500" />
        <Text mt={4} color="gray.600">Loading todos...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <AlertTitle>Error loading todos!</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to load todos'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Box>
            <Heading size="lg" color="gray.800">
              My Todos
            </Heading>
            <Text color="gray.600" mt={1}>
              {todos?.length || 0} {todos?.length === 1 ? 'todo' : 'todos'}
            </Text>
          </Box>
          <Button
            colorScheme="brand"
            onClick={onOpen}
            size="lg"
          >
            + Add Todo
          </Button>
        </HStack>

        {/* Todo List */}
        {todos && todos.length > 0 ? (
          <VStack spacing={4} align="stretch">
            {todos.map((todo) => (
              <Card key={todo.id} variant="outline">
                <CardHeader pb={2}>
                  <HStack justify="space-between" align="flex-start">
                    <VStack align="flex-start" spacing={1} flex={1}>
                      <HStack spacing={3} align="center">
                        <Checkbox
                          isChecked={todo.completed}
                          onChange={(e) => handleToggleTodo(todo.id, e.target.checked)}
                          colorScheme="brand"
                          size="lg"
                        />
                        <Text
                          fontSize="lg"
                          fontWeight="semibold"
                          textDecoration={todo.completed ? 'line-through' : 'none'}
                          color={todo.completed ? 'gray.500' : 'gray.800'}
                        >
                          {todo.title}
                        </Text>
                      </HStack>
                      {todo.description && (
                        <Text color="gray.600" fontSize="sm" ml={8}>
                          {todo.description}
                        </Text>
                      )}
                    </VStack>
                    <HStack spacing={2}>
                      <Badge
                        colorScheme={todo.completed ? 'green' : 'yellow'}
                        variant="subtle"
                        fontSize="xs"
                      >
                        {todo.completed ? 'Completed' : 'Pending'}
                      </Badge>
                    </HStack>
                  </HStack>
                </CardHeader>
                
                <CardFooter pt={0}>
                  <HStack spacing={2} ml="auto">
                    <IconButton
                      aria-label="View todo"
                      icon={<Text>👁️</Text>}
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/todo/${todo.id}`)}
                    />
                    <IconButton
                      aria-label="Edit todo"
                      icon={<Text>✏️</Text>}
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(todo)}
                    />
                    <IconButton
                      aria-label="Delete todo"
                      icon={<Text>🗑️</Text>}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDeleteTodo(todo.id)}
                    />
                  </HStack>
                </CardFooter>
              </Card>
            ))}
          </VStack>
        ) : (
          <Box textAlign="center" py={20}>
            <Text fontSize="xl" color="gray.500" mb={4}>
              No todos yet
            </Text>
            <Text color="gray.400" mb={6}>
              Create your first todo to get started!
            </Text>
            <Button
              colorScheme="brand"
              onClick={onOpen}
              size="lg"
            >
              + Create Your First Todo
            </Button>
          </Box>
        )}
      </VStack>

      {/* Create Todo Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Todo title"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                rows={3}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                onClick={handleCreateTodo}
                isLoading={createTodoMutation.isPending}
              >
                Create Todo
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Todo Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Todo title"
                value={editingTodo?.data.title || ''}
                onChange={(e) => setEditingTodo(prev => prev ? {
                  ...prev,
                  data: { ...prev.data, title: e.target.value }
                } : null)}
              />
              <Textarea
                placeholder="Description (optional)"
                value={editingTodo?.data.description || ''}
                onChange={(e) => setEditingTodo(prev => prev ? {
                  ...prev,
                  data: { ...prev.data, description: e.target.value }
                } : null)}
                rows={3}
              />
              <Checkbox
                isChecked={editingTodo?.data.completed || false}
                onChange={(e) => setEditingTodo(prev => prev ? {
                  ...prev,
                  data: { ...prev.data, completed: e.target.checked }
                } : null)}
                colorScheme="brand"
              >
                Mark as completed
              </Checkbox>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onEditClose}>
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                onClick={handleUpdateTodo}
                isLoading={updateTodoMutation.isPending}
              >
                Update Todo
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TodoList; 