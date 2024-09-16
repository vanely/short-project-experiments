import express from 'express';
import { SoloReadingListController } from '../controllers/soloReadingListController';

const router = express.Router();

router.post('/create', SoloReadingListController.createReadingList);
router.post('/add', SoloReadingListController.addReadingList);
router.put('/update', SoloReadingListController.updateReadingList);
router.get('/reading-lists', SoloReadingListController.getReadingLists);

export default router;
