import { Request, Response } from 'express';
import { Transaction, Op } from 'sequelize';
import { BookClub, User, Book } from '../models'; // Assuming you have these models
import sequelize from '../config/db';
import { BookClubAccessEnum, BannerImageInterface, CoverImageInterface, BookInterface, BookClubPostInterface } from '../models/types';

class BookClubController {
  /**
   * Create a new book club
   */
  static async createBookClub(req: Request, res: Response): Promise<void> {
    const t: Transaction = await sequelize.transaction();

    try {
      const { name, description, ownerId, banner, coverImage, access } = req.body;

      if (!name || !description || !ownerId) {
        res.status(400).json({ error: 'Name, description, and ownerId are required' });
        return;
      }

      const newClub = await BookClub.create(
        {
          name,
          description,
          ownerId,
          banner,
          coverImage,
          access: access || BookClubAccessEnum.PRIVATE,
          active: true,
          posts: [],
          bookList: [],
        },
        { transaction: t }
      );

      await t.commit();
      res.status(201).json(newClub);
    } catch (error) {
      await t.rollback();
      console.error('Error creating book club:', error);
      res.status(500).json({ error: 'An error occurred while creating the book club' });
    }
  }

  /**
   * Request to join a book club
   */
  static async requestJoinBookClub(req: Request, res: Response): Promise<void> {
    const t: Transaction = await sequelize.transaction();

    try {
      const { bookClubId, userId } = req.body;

      if (!bookClubId || !userId) {
        res.status(400).json({ error: 'Book club ID and user ID are required' });
        return;
      }

      const bookClub = await BookClub.findByPk(bookClubId, { transaction: t });

      if (!bookClub) {
        res.status(404).json({ error: 'Book club not found' });
        return;
      }

      if (bookClub.access === BookClubAccessEnum.PRIVATE) {
        // Implement request logic for private clubs
        // This could involve creating a separate BookClubRequest model
        res.status(200).json({ message: 'Join request sent for private book club' });
      } else {
        // For public clubs, directly add the user
        await bookClub.addMember(userId, { transaction: t });
        res.status(200).json({ message: 'Successfully joined the book club' });
      }

      await t.commit();
    } catch (error) {
      await t.rollback();
      console.error('Error requesting to join book club:', error);
      res.status(500).json({ error: 'An error occurred while requesting to join the book club' });
    }
  }

  /**
   * Accept a book club member (for private clubs)
   */
  static async acceptBookClubMember(req: Request, res: Response): Promise<void> {
    const t: Transaction = await sequelize.transaction();

    try {
      const { bookClubId, userId, acceptedBy } = req.body;

      if (!bookClubId || !userId || !acceptedBy) {
        res.status(400).json({ error: 'Book club ID, user ID, and acceptedBy ID are required' });
        return;
      }

      const bookClub = await BookClub.findByPk(bookClubId, { transaction: t });

      if (!bookClub || bookClub.ownerId !== acceptedBy) {
        res.status(403).json({ error: 'Not authorized to accept members' });
        return;
      }

      await bookClub.addMember(userId, { transaction: t });

      await t.commit();
      res.status(200).json({ message: 'Member accepted successfully' });
    } catch (error) {
      await t.rollback();
      console.error('Error accepting book club member:', error);
      res.status(500).json({ error: 'An error occurred while accepting the book club member' });
    }
  }

  /**
   * Update books in a book club
   */
  static async updateBooks(req: Request, res: Response): Promise<void> {
    const t: Transaction = await sequelize.transaction();

    try {
      const { bookClubId, books, userId } = req.body;

      if (!bookClubId || !books || !userId) {
        res.status(400).json({ error: 'Book club ID, books, and user ID are required' });
        return;
      }

      const bookClub = await BookClub.findByPk(bookClubId, { transaction: t });

      if (!bookClub || bookClub.ownerId !== userId) {
        res.status(403).json({ error: 'Not authorized to update books' });
        return;
      }

      await bookClub.update({ bookList: books }, { transaction: t });

      await t.commit();
      res.status(200).json({ message: 'Books updated successfully' });
    } catch (error) {
      await t.rollback();
      console.error('Error updating book club books:', error);
      res.status(500).json({ error: 'An error occurred while updating the book club books' });
    }
  }

  /**
   * Update book club roles (Not directly supported in the current model, consider adding a separate table for roles)
   */
  static async updateBookClubRoles(req: Request, res: Response): Promise<void> {
    res.status(501).json({ error: 'This functionality is not implemented in the current model' });
  }

  /**
   * Remove a member from a book club
   */
  static async removeBookClubMember(req: Request, res: Response): Promise<void> {
    const t: Transaction = await sequelize.transaction();

    try {
      const { bookClubId, memberId, removedBy } = req.body;

      if (!bookClubId || !memberId || !removedBy) {
        res.status(400).json({ error: 'Book club ID, member ID, and remover ID are required' });
        return;
      }

      const bookClub = await BookClub.findByPk(bookClubId, { transaction: t });

      if (!bookClub || bookClub.ownerId !== removedBy) {
        res.status(403).json({ error: 'Not authorized to remove members' });
        return;
      }

      await bookClub.removeMember(memberId, { transaction: t });

      await t.commit();
      res.status(200).json({ message: 'Member removed successfully' });
    } catch (error) {
      await t.rollback();
      console.error('Error removing book club member:', error);
      res.status(500).json({ error: 'An error occurred while removing the book club member' });
    }
  }

  /**
   * Get book clubs (with optional filtering)
   */
  static async getBookClubs(req: Request, res: Response): Promise<void> {
    try {
      const { userId, search, access } = req.query;

      let whereClause: any = {};
      if (search) {
        whereClause.name = { [Op.iLike]: `%${search}%` };
      }
      if (access) {
        whereClause.access = access;
      }
      if (userId) {
        whereClause.ownerId = userId;
      }

      const bookClubs = await BookClub.findAll({
        where: whereClause,
        include: [
          { model: User, as: 'members', attributes: ['id', 'name'] },
          { model: Book, as: 'currentBook', attributes: ['id', 'title', 'author'] },
        ],
      });

      res.status(200).json(bookClubs);
    } catch (error) {
      console.error('Error fetching book clubs:', error);
      res.status(500).json({ error: 'An error occurred while fetching book clubs' });
    }
  }

  /**
   * Add a post to a book club
   * NOTE: will need to create this model
   */
  static async addPost(req: Request, res: Response): Promise<void> {
    const t: Transaction = await sequelize.transaction();

    try {
      const { bookClubId, userId, content, emoji } = req.body;

      if (!bookClubId || !userId || !content) {
        res.status(400).json({ error: 'Book club ID, user ID, and content are required' });
        return;
      }

      const bookClub = await BookClub.findByPk(bookClubId, { transaction: t });

      if (!bookClub) {
        res.status(404).json({ error: 'Book club not found' });
        return;
      }

      const newPost: BookClubPostInterface = {
        id: Date.now().toString(), // Simple ID generation
        userId,
        content,
        emoji,
        createdAt: new Date(),
        comments: [],
      };

      await bookClub.update(
        { posts: [...bookClub.posts, newPost] },
        { transaction: t }
      );

      await t.commit();
      res.status(201).json(newPost);
    } catch (error) {
      await t.rollback();
      console.error('Error adding post to book club:', error);
      res.status(500).json({ error: 'An error occurred while adding the post to the book club' });
    }
  }

  /**
   * Update book club details
   */
  static async updateBookClub(req: Request, res: Response): Promise<void> {
    const t: Transaction = await sequelize.transaction();

    try {
      const { bookClubId, name, description, banner, coverImage, access, active } = req.body;

      if (!bookClubId) {
        res.status(400).json({ error: 'Book club ID is required' });
        return;
      }

      const bookClub = await BookClub.findByPk(bookClubId, { transaction: t });

      if (!bookClub) {
        res.status(404).json({ error: 'Book club not found' });
        return;
      }

      await bookClub.update(
        {
          name: name || bookClub.name,
          description: description || bookClub.description,
          banner: banner || bookClub.banner,
          coverImage: coverImage || bookClub.coverImage,
          access: access || bookClub.access,
          active: active !== undefined ? active : bookClub.active,
        },
        { transaction: t }
      );

      await t.commit();
      res.status(200).json(bookClub);
    } catch (error) {
      await t.rollback();
      console.error('Error updating book club:', error);
      res.status(500).json({ error: 'An error occurred while updating the book club' });
    }
  }
}

export default BookClubController;