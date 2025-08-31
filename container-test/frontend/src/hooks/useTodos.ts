import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  type Todo,
  type UpdateTodoRequest,
} from '../api/todos';

// Query keys
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
};

// Get all todos
export const useTodos = () => {
  return useQuery({
    queryKey: todoKeys.lists(),
    queryFn: getTodos,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Get todo by ID
export const useTodo = (id: string) => {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => getTodoById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Create todo mutation
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: (newTodo) => {
      // Invalidate and refetch todos list
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      
      // Optimistically add to cache
      queryClient.setQueryData(todoKeys.lists(), (old: Todo[] | undefined) => {
        if (!old) return [newTodo];
        return [newTodo, ...old];
      });
    },
    onError: (error) => {
      console.error('Failed to create todo:', error);
    },
  });
};

// Update todo mutation
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTodoRequest }) =>
      updateTodo(id, updates),
    onSuccess: (updatedTodo) => {
      // Invalidate and refetch todos list
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      
      // Update individual todo in cache
      queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo);
      
      // Update in todos list cache
      queryClient.setQueryData(todoKeys.lists(), (old: Todo[] | undefined) => {
        if (!old) return [updatedTodo];
        return old.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo);
      });
    },
    onError: (error) => {
      console.error('Failed to update todo:', error);
    },
  });
};

// Delete todo mutation
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch todos list
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      
      // Remove from individual todo cache
      queryClient.removeQueries({ queryKey: todoKeys.detail(deletedId) });
      
      // Optimistically remove from todos list cache
      queryClient.setQueryData(todoKeys.lists(), (old: Todo[] | undefined) => {
        if (!old) return [];
        return old.filter(todo => todo.id !== deletedId);
      });
    },
    onError: (error) => {
      console.error('Failed to delete todo:', error);
    },
  });
};

// Toggle todo completion mutation
export const useToggleTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      toggleTodo(id, completed),
    onMutate: async ({ id, completed }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(todoKeys.lists());

      // Optimistically update to the new value
      queryClient.setQueryData(todoKeys.lists(), (old: Todo[] | undefined) => {
        if (!old) return [];
        return old.map(todo =>
          todo.id === id ? { ...todo, completed } : todo
        );
      });

      // Return a context object with the snapshotted value
      return { previousTodos };
    },
    onError: (err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTodos) {
        queryClient.setQueryData(todoKeys.lists(), context.previousTodos);
      }
      console.error('Failed to toggle todo:', err);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}; 