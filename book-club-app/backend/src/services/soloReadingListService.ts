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
  
  // make sure to check for duplicate names, 
  // if the reading list is private look only in users lists.
  // if the reading list is public check against all public lists.
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
// may be optimal to add
export const addBooksToReadingList = async (books: BookInterface[]) => {
  // if we're getting them from the db the function param will be an aray of ids[]
  // if we're getting them from an api catalog
}

export const updateBookStatusInReadingList = async (book: BookInterface) => {

}

export const updateReadingListStatus = async (readingList: SoloReadingListInterface) => {

}

export const getReadingLists = async () => {

}
