export interface BookInterface {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publishedDate?: Date;
  description: string;
  coverImage: string; // may need to create a union type that represents possible image formats?
  pageCount: number;
  inProgress: boolean;
  completed: boolean;
  startDate: Date; // set when switched to inProgress
  endDate: Date; // set when switched to completed
  bookApiReference: string;
}
