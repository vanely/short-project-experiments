import express from 'express';
import { BookClubController } from '../controllers/bookClubController';

const router = express.Router();

router.post('/create', BookClubController.createBookClub);
// TODO: will need a bookclub request model for this
router.post('/request-join', BookClubController.requestJoinBookClub);
router.put('/accept-member', BookClubController.acceptBookClubMember);
router.put('/update-books', BookClubController.updateBooks);
router.put('/update-roles', BookClubController.updateBookClubRoles);
router.put('/remove-member', BookClubController.removeBookClubMember);
router.get('/clubs', BookClubController.getBookClubs);

export default router;
