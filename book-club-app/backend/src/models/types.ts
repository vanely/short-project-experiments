export type BookClubRole = 'admin' | 'participant'
export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp' | 'svg' | undefined;

export enum FriendRequestEnum {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export enum BookClubAccessEnum {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum SoloReadingListEnum {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export interface CoverImageInterface {
  url: string;
  format: ImageFormat;
}

export interface BannerImageInterface extends CoverImageInterface{}

export interface BookInterface {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publishedDate?: Date;
  description: string;
  coverImage: CoverImageInterface;
  pageCount: number;
  inProgress: boolean;
  completed: boolean;
  startDate: Date; // set when switched to inProgress
  endDate: Date; // set when switched to completed
  bookApiReference: string;
}

export interface BookClubInterface {
  id: number;
  name: string;
  description: string;
  banner: BannerImageInterface;
  posts: BookClubPostInterface[];
  coverImage: CoverImageInterface;
  createdBy: number;
  currentBookId: number | null;
  active: boolean;
  access: BookClubAccessEnum;
  books: BookInterface[];
}

export interface SoloReadingListInterface {
  id: number;
  createdBy: number;
  name: string;
  description: string;
  banner: BannerImageInterface;
  coverImage: CoverImageInterface;
  currentBookId: number | null;
  active: boolean;
  access: SoloReadingListEnum;
  bookList: BookInterface[];
}

export interface UserInterface {
  id: number;
  email: string;
  password: string;
  passwordSalt: string;
  name: string;
  googleId: string | null;
  bookClubs: BookClubInterface[];
  validatePassword(password: string): Promise<boolean> 
}

// NOTE: use this or something similar in frontend for emojies https://github.com/missive/emoji-mart?tab=readme-ov-file
export interface ReactionInterface {
  userId: number;
  emoji: string;
}

export interface CommentInterface {
  userId: number;
  comment: string;
  reactions: ReactionInterface[];
}

export interface BookClubPostInterface {
  reactions: ReactionInterface[];
  comments: CommentInterface[];
}
