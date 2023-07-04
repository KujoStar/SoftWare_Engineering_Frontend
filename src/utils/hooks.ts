import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  User,
  UserDetail,
  ImageInfo,
  List,
  FollowerList,
  FollowingList,
  PrimaryComment,
  SearchHistory,
  MessageInfo,
  Unread,
} from "@data/interface";
import { TFetcher, fetcher } from "@utils/network";
import { ResultInfo } from "@data/interface/utilities";

export const useMediaQuery = (query: string): boolean => {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  const handleChange = () => {
    setMatches(getMatches(query));
  };

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
  }, [query]);

  return matches;
};

export const useUser = (username: string) => useSWR<TFetcher<User>>({ url: `/api/user/${username}` }, fetcher);
export const useUserDetail = (username: string, jwt?: string) =>
  useSWR<TFetcher<UserDetail>>({ url: `/api/user/${username}/detail`, jwt: jwt }, fetcher);

export const useUserImages = (username: string, page: number, sortBy = "time") =>
  useSWR<TFetcher<List<ImageInfo>>>({ url: `/api/user/${username}/images?page=${page}&sortedBy=${sortBy}` }, fetcher);

export const useImage = (id: number, jwt?: string) =>
  useSWR<TFetcher<ImageInfo>>({ url: `/api/image/${id}`, jwt: jwt }, fetcher);

export const useComments = (id: number, page: number, sortBy: "time" | "likes", jwt?: string) =>
  useSWR<TFetcher<List<PrimaryComment>>>({ url: `/api/image/${id}/comments?page=${page}&sortedBy=${sortBy}`, jwt: jwt }, fetcher);

export const useFollowerList = (username: string) =>
  useSWR<TFetcher<FollowerList>>({ url: `/api/user/${username}/follower` }, fetcher);
export const useFollowingList = (username: string) =>
  useSWR<TFetcher<FollowingList>>({ url: `/api/user/${username}/following` }, fetcher);

export const useSearchList = (params: string, jwt?: string) =>
  useSWR<TFetcher<List<ImageInfo>>>({ url: `/api/search/images?${params}`, jwt: jwt }, fetcher);

export const useSearchHistory = (searchFor: string, jwt: string) =>
  useSWR<TFetcher<List<SearchHistory>>>({ url: `/api/search/history?search_for=${searchFor}`, jwt: jwt }, fetcher);

export const useMessage = (username: string, page: number, jwt: string) =>
  useSWR<TFetcher<List<MessageInfo>>>({ url: `/api/message/record?username=${username}&pageId=${page}`, jwt: jwt }, fetcher);
export const useRecentMessage = (username: string, page: number, jwt: string) =>
  useSWR<TFetcher<List<MessageInfo>>>({ url: `/api/message/recent?username=${username}&pageId=${page}`, jwt: jwt }, fetcher);
export const useUnreadMessageCount = (jwt: string) =>
  useSWR<TFetcher<Unread>>({ url: "/api/message/unread", jwt: jwt }, fetcher);

export const useSearchUser = (searchFor: string, jwt: string) =>
  useSWR<TFetcher<List<User>>>({ url: `/api/search/user?content=${searchFor}`, jwt: jwt }, fetcher);

export const useUtilResults = (page: number, jwt: string, type?: "convert" | "resolution" | "watermark") =>
  useSWR<TFetcher<List<ResultInfo>>>({ url: `/api/image/utilities?page=${page}${type === undefined ? "" : `&type=${type}`}`, jwt: jwt }, fetcher);

export const useHistory = (page: number, jwt: string) =>
  useSWR<TFetcher<List<ImageInfo>>>({ url: `/api/records?page=${page}`, jwt: jwt }, fetcher);

export const useDynamic = (page: number, jwt: string) => 
  useSWR<TFetcher<List<ImageInfo>>>({ url: `/api/social/dynamic/list?pageId=${page}`, jwt: jwt }, fetcher);
  // useUnreadDynamicCount
export const useUnreadDynamicCount = (jwt: string) =>
  useSWR<TFetcher<Unread>>({ url: "/api/social/dynamic/unread", jwt: jwt }, fetcher);
