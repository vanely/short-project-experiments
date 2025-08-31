import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

export const todoController = {
  // Get all todos
  async getAllTodos(req: Request, res: Response) {
    try {
      const todos = await prisma.todo.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      res.json({
        success: true,
        data: todos
      });
    } catch (error) {
      console.error('Error fetching todos:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch todos',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Get todo by ID
  async getTodoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const todo = await prisma.todo.findUnique({
        where: { id }
      });

      if (!todo) {
        return res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
      }

      res.json({
        success: true,
        data: todo
      });
    } catch (error) {
      console.error('Error fetching todo:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch todo',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Create new todo
  async createTodo(req: Request, res: Response) {
    try {
      const { title, description }: CreateTodoRequest = req.body;

      if (!title || title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Title is required'
        });
      }

      const todo = await prisma.todo.create({
        data: {
          title: title.trim(),
          description: description?.trim()
        }
      });

      res.status(201).json({
        success: true,
        data: todo
      });
    } catch (error) {
      console.error('Error creating todo:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create todo',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Update todo
  async updateTodo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: UpdateTodoRequest = req.body;

      // Check if todo exists
      const existingTodo = await prisma.todo.findUnique({
        where: { id }
      });

      if (!existingTodo) {
        return res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
      }

      // Validate title if provided
      if (updateData.title !== undefined && updateData.title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Title cannot be empty'
        });
      }

      const updatedTodo = await prisma.todo.update({
        where: { id },
        data: {
          ...updateData,
          title: updateData.title?.trim(),
          description: updateData.description?.trim()
        }
      });

      res.json({
        success: true,
        data: updatedTodo
      });
    } catch (error) {
      console.error('Error updating todo:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update todo',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Delete todo
  async deleteTodo(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if todo exists
      const existingTodo = await prisma.todo.findUnique({
        where: { id }
      });

      if (!existingTodo) {
        return res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
      }

      await prisma.todo.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Todo deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete todo',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}; 