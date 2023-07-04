import { preload } from "swr";
import { fetcher } from "@utils/network";
import { useLoaderData } from "react-router-dom";
import { useFollowingList } from "@utils/hooks";
import { AppLayout } from "@layouts";
import { Loading } from "@components";
import { NoUser } from "@pages/ErrorPages";
import { Header, Segment } from "semantic-ui-react";
import UserList from "@components/UserList";

export const loader = ({ params }: { params: { username?: string; } }) => {
  const { username } = params;

  if (typeof username === "undefined") {
    throw new Error("No username provided");
  }

  preload(`/api/user/${username}/follower`, fetcher);

  return username;
};

export const Page = () => {
  const username = useLoaderData() as string;
  const rawList = useFollowingList(username);

  if (typeof rawList.data === "undefined") {
    if (rawList.isLoading) {
      return (
        <AppLayout>
          <Loading />
        </AppLayout>
      );
    }

    if (typeof rawList.error !== "undefined") {
      console.error(rawList.error);
      return <NoUser />;
    }

    throw new Error("unreachable");
  }
  return <AppLayout>
    <Segment>
      <Header>{`${username}的关注`}</Header>
      <UserList usernames={rawList.data.data.followings} />
    </Segment>
  </AppLayout>;
};
