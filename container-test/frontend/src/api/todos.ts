import apiClient from '../lib/api';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Get all todos
export const getTodos = async (): Promise<Todo[]> => {
  const response = await apiClient.get<ApiResponse<Todo[]>>('/api/todos');
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Failed to fetch todos');
};

// Get todo by ID
export const getTodoById = async (id: string): Promise<Todo> => {
  const response = await apiClient.get<ApiResponse<Todo>>(`/api/todos/${id}`);
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Failed to fetch todo');
};

// Create new todo
export const createTodo = async (todo: CreateTodoRequest): Promise<Todo> => {
  const response = await apiClient.post<ApiResponse<Todo>>('/api/todos', todo);
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Failed to create todo');
};

// Update todo
export const updateTodo = async (id: string, updates: UpdateTodoRequest): Promise<Todo> => {
  const response = await apiClient.put<ApiResponse<Todo>>(`/api/todos/${id}`, updates);
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Failed to update todo');
};

// Delete todo
export const deleteTodo = async (id: string): Promise<void> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/api/todos/${id}`);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete todo');
  }
};

// Toggle todo completion
export const toggleTodo = async (id: string, completed: boolean): Promise<Todo> => {
  return updateTodo(id, { completed });
}; 