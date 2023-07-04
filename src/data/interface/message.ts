import { User } from "./user";

export interface MessageInfo {
  id: number;
  sender: User;
  receiver: User;
  content: string;
  time: number;
  is_read: boolean;
}
