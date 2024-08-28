import SoloReadingList from "../models/SoloReadingList"
import { BookInterface, SoloReadingListInterface } from "../models/types"

// create a new solo reading list for a user(get reference from session)
// wrap in a try catch, do better error handling for these, just placeholders for now
export const createNewReadingList = async (readdingList: SoloReadingListInterface) => {
  const {
    createdBy,
    name,
    description,
    banner,
    coverImage,
    currentBookId,
    active,
  } = readdingList;
  
  try {
    const newReadingList: SoloReadingList = await SoloReadingList.create({
      createdBy,
      name,
      description,
      banner,
      coverImage,
      currentBookId,
      active,
    });
    // console.log(`New Reading List:\n${newReadingList}`);
    // return newReadingList;
  } catch (error) {
    console.error(`Unable to create SoloReadingList:\n${error}`);
  }
}

// add books to reading list
// these will either come from a catalog reference, or we could search for them in our db using our custom model.
export const addBooksToReadingList = async (books: BookInterface[]) => {
  
}
