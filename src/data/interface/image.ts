import { User } from "./user";

export interface ImageInfo {
  id: number;
  url: string;
  uploader: string; // username
  uploadTime: number;
  likes: number;
  isLiked?: boolean;
  comments: number;
  title: string;
  tags: string[];
  description: string;
  category: string;
  hash?: string;
  width: number;
  height: number;
  contentType: string;
}
export interface Comment {
  id: number;
  content: string;
  poster: User;
  postTime: number;
  likes: number;
  isLiked: boolean;
}

export interface SecondaryComment extends Comment {
  replyToUser: string;
}

export interface PrimaryComment extends Comment {
  comments: number;
  replies: SecondaryComment[];
}
