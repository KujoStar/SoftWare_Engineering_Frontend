export interface User {
  username: string;
  nickname: string;
  email: string;
  registerTime: number;
  userType: string;
  slogan: string;
}

export interface UserDetail extends User {
  followingCount: number;
  followerCount: number;
  uploadCount: number;
  followState: number;
}

export interface FollowerList {
  perPage: number;
  count: number;
  followers: string[];
}
export interface FollowingList {
  perPage: number;
  count: number;
  followings: string[];
}

export interface Self {
  username: string;
  jwt: string;
}
