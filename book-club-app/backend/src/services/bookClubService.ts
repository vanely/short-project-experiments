import BookClub from '../models/BookClub';
import { BookClubInterface, BookInterface } from '../models/types';

const creatBookClub = async (bookClub: BookClubInterface) => {
  const newClub = await BookClub.create({
    name: 'Sci-Fi Lovers',
    description: 'We read and discuss science fiction novels',
    createdBy: userId,
  });
  
  // const newBook = await Book.create({
  //   title: 'Dune',
  //   author: 'Frank Herbert',
  //   // ... other book details
  // });
}

const addBookToBooksClub = async (bookClubId: number, books: BookInterface[]) => {
  // Create a new book club with a book
  await newClub.addBook(newBook, { through: { startDate: new Date() } });
  
  // Get all books for a club
  const clubWithBooks = await BookClub.findByPk(clubId, {
    include: [{ model: Book, through: { attributes: ['startDate', 'endDate', 'inProgress', 'completed'] } }]
  });
}

// only one book can be set in progress at a time
const updateBookClubReadingProgress = async (bookClubId: number, book: BookInterface) => {
  // Update reading progress
  await BookClubBook.update(
    { inProgress: true },
    { where: { BookClubId: clubId, BookId: bookId } }
  );
}
