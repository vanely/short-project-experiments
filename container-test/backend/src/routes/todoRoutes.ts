import { Router } from 'express';
import { todoController } from '../controllers/todoController';

const router = Router();

// GET /api/todos - Get all todos
router.get('/', todoController.getAllTodos);

// GET /api/todos/:id - Get todo by ID
router.get('/:id', todoController.getTodoById);

// POST /api/todos - Create new todo
router.post('/', todoController.createTodo);

// PUT /api/todos/:id - Update todo
router.put('/:id', todoController.updateTodo);

// DELETE /api/todos/:id - Delete todo
router.delete('/:id', todoController.deleteTodo);

export default router; 