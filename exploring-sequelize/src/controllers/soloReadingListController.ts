import { Request, Response } from 'express';
import { Transaction } from 'sequelize';
import { User, SoloReadingList } from '../models/index';
import sequelize from '../config/db';
import { SoloReadingListEnum, SoloReadingListInterface, BookInterface, BannerImageInterface, CoverImageInterface } from '../models/types';

class SoloReadingListController {
  /**
   * Create a new reading list
   */
  static async createReadingList(req: Request, res: Response): Promise<void> {
    const t: Transaction = await sequelize.transaction();

    try {
      const {
        ownerId,
        name,
        description,
        banner,
        coverImage,
        active,
        access,
      } = req.body;

      if (!ownerId || !name) {
        res.status(400).json({ error: 'OwnerId and name are required' });
        return;
      }

      const owner = await User.findByPk(ownerId, { transaction: t });
      if (!owner) {
        res.status(404).json({ error: 'Owner not found' });
        return;
      }

      const newList = await SoloReadingList.create(
        {
          ownerId,
          name,
          description,
          banner,
          coverImage,
          active: active !== undefined ? active : true,
          access: access || SoloReadingListEnum.PRIVATE,
          upVotes: 0,
          bookList: [],
        },
        { transaction: t }
      );

      await t.commit();
      res.status(201).json(newList.toSafeObject());
    } catch (error) {
      await t.rollback();
      console.error('Error creating reading list:', error);
      res.status(500).json({ error: 'An error occurred while creating the reading list' });
    }
  }

  /**
   * Add a book to a reading list
   */
  static async addReadingList(req: Request, res: Response): Promise<void> {
    const t: Transaction = await sequelize.transaction();

    try {
      const { readingListId, book } = req.body;

      if (!readingListId || !book) {
        res.status(400).json({ error: 'Reading list ID and book details are required' });
        return;
      }

      const readingList = await SoloReadingList.findByPk(readingListId, { transaction: t });

      if (!readingList) {
        res.status(404).json({ error: 'Reading list not found' });
        return;
      }

      const updatedBookList = [...readingList.bookList, book as BookInterface];
      await readingList.update({ bookList: updatedBookList }, { transaction: t });

      // If it's the first book, set it as the current book
      if (updatedBookList.length === 1) {
        await readingList.update({ currentBook: book }, { transaction: t });
      }

      await t.commit();
      res.status(200).json({ message: 'Book added to reading list successfully' });
    } catch (error) {
      await t.rollback();
      console.error('Error adding book to reading list:', error);
      res.status(500).json({ error: 'An error occurred while adding the book to the reading list' });
    }
  }

  /**
   * Update a reading list
   */
  static async updateReadingList(req: Request, res: Response): Promise<void> {
    const t: Transaction = await sequelize.transaction();

    try {
      const {
        id,
        name,
        description,
        banner,
        coverImage,
        currentBook,
        active,
        access,
      } = req.body;

      if (!id) {
        res.status(400).json({ error: 'Reading list ID is required' });
        return;
      }

      const readingList = await SoloReadingList.findByPk(id, { transaction: t });

      if (!readingList) {
        res.status(404).json({ error: 'Reading list not found' });
        return;
      }

      // just spread here
      const updates: Partial<SoloReadingList> = {};
      if (name) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (banner) updates.banner = banner as BannerImageInterface;
      if (coverImage) updates.coverImage = coverImage as CoverImageInterface;
      if (currentBook) updates.currentBook = currentBook as BookInterface;
      if (active !== undefined) updates.active = active;
      if (access) updates.access = access as SoloReadingListEnum;

      await readingList.update(updates, { transaction: t });

      await t.commit();
      res.status(200).json(readingList.toSafeObject());
    } catch (error) {
      await t.rollback();
      console.error('Error updating reading list:', error);
      res.status(500).json({ error: 'An error occurred while updating the reading list' });
    }
  }

  /**
   * Get all reading lists for a user
   */
  static async getReadingLists(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId } = req.query;

      if (!ownerId) {
        res.status(400).json({ error: 'Owner ID is required' });
        return;
      }

      const readingLists = await SoloReadingList.findAll({
        where: { ownerId: ownerId as string },
      });

      const safeReadingLists = readingLists.map(list => list.toSafeObject());
      res.status(200).json(safeReadingLists);
    } catch (error) {
      console.error('Error fetching reading lists:', error);
      res.status(500).json({ error: 'An error occurred while fetching the reading lists' });
    }
  }
}

export default SoloReadingListController;
