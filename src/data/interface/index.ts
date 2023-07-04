export * from "./user";
export * from "./image";
export * from "./search";
export * from "./message";

export interface FormErr {
  content: string;
  pointing: "below" | "above" | "left" | "right";
}

export interface OkResp<T> {
  status: 200 | 201 | 202 | 203 | 204;
  data: T;
}

export interface ErrResp {
  status: Exclude<number, 200>;
  data: {
    msg: string;
  };
}

export type Resp<T> = ErrResp | OkResp<T>;

export type InputChange = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
export type FileInputChange = React.ChangeEvent<HTMLInputElement>;

export interface List<T> {
  count: number;
  perPage: number;
  result: T[];
}

export interface Unread{
  count: number
}
