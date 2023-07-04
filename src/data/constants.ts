import { RawSearchForm } from "./interface";

export const MENU_ITEMS = [
  {
    show: 0,
    id: "home",
    name: "首页",
    to: "/",
    icon: "home",
  },
  {
    show: 0,
    id: "upload",
    name: "上传",
    to: "/upload",
    icon: "upload",
  },
  {
    show: 1,
    id: "convert",
    name: "转GIF",
    to: "/convert",
    icon: "video",
  },
  {
    show: 1,
    id: "resolution",
    name: "超分辨率",
    to: "/resolution",
    icon: "zoom",
  },
  {
    show: 1,
    id: "watermark",
    name: "图片水印",
    to: "/watermark",
    icon: "paw",
  },
  {
    show: 1,
    id: "utilities",
    name: "转换结果",
    to: "/utilities",
    icon: "file",
  },
  {
    show: 2,
    id: "dynamic",
    name: "用户动态",
    to: "/dynamic",
    icon: "bolt",
  },
  {
    show: 2,
    id: "history",
    name: "浏览历史",
    to: "/history",
    icon: "history",
  },
  {
    show: 2,
    id: "message",
    name: "私信",
    to: "/message",
    icon: "envelope",
  },
];

export const EMAIL_REG = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const IMAGE_CATEGORY = [
  { key: "-1", text: "请选择分区", value: "wait" },
  { key: "0", text: "体育", value: "sport" },
  { key: "1", text: "二次元", value: "acgn" },
  { key: "2", text: "动物", value: "animal" },
  { key: "3", text: "舞蹈", value: "dance" },
  { key: "4", text: "人物", value: "character" },
  { key: "5", text: "风景", value: "landscape" },
  { key: "6", text: "食物", value: "food" },
  { key: "7", text: "影视", value: "video" },
  { key: "8", text: "游戏", value: "game" },
  { key: "9", text: "梗图", value: "meme" },
];

export const LOAD_RETRY_TIME = 500;
export const LOAD_RETRY_PROP = 1.2;

export const MAX_IMAGE_SIZE = 104857600;

export const TAG_BANNED_CHAR = "\"'";

export const SEARCH_PARAMETERS: Array<keyof RawSearchForm> = ["searchFor", "category", "uploader", "sortBy"];

export const DEFAULT_AVATAR_LINK = "https://s1.ax1x.com/2023/05/17/p9R43z4.jpg";
// https://our-frontend-repo-nobugnopain.app.secoder.net/default_avatar.jpg
