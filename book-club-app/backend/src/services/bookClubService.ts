// Create a new book club with a book
const newClub = await BookClub.create({
  name: 'Sci-Fi Lovers',
  description: 'We read and discuss science fiction novels',
  createdBy: userId,
});

const newBook = await Book.create({
  title: 'Dune',
  author: 'Frank Herbert',
  // ... other book details
});

await newClub.addBook(newBook, { through: { startDate: new Date() } });

// Get all books for a club
const clubWithBooks = await BookClub.findByPk(clubId, {
  include: [{ model: Book, through: { attributes: ['startDate', 'endDate', 'inProgress', 'completed'] } }]
});

// Update reading progress
await BookClubBook.update(
  { inProgress: true },
  { where: { BookClubId: clubId, BookId: bookId } }
);