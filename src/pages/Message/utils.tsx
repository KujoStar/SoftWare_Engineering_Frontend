import { DEFAULT_AVATAR_LINK } from "@data/constants";
import { MessageInfo, Self } from "@data/interface";
import { md5 } from "@utils/mika_kawaii/mika_kawaii";

export const getAnother = (message: MessageInfo, self: Self) => 
  message.sender.username !== self.username ?
    message.sender : message.receiver;

export const getAvatar = (email: string) => {
  const hash = md5(email.trim().toLowerCase());
  const url = `https://gravatar.shinku.life/avatar/${hash}?d=${DEFAULT_AVATAR_LINK}`;
  return url;
};
