import { Segment } from "semantic-ui-react";
import { useUserDetail } from "@utils/hooks";
import { Loading } from "@components";
import UserSidebarImpl from "./Impl";
import { useAppState } from "@state";

interface UserSidebarProps {
  username: string;
  isNarrow?: boolean;
}

const UserSidebar = (props: UserSidebarProps) => {
  const { self } = useAppState();
  const user = useUserDetail(props.username, self?.jwt);

  if (typeof user.data === "undefined") {
    if (user.isLoading) {
      return <Loading />;
    }

    if (typeof user.error !== "undefined") {
      console.error(user.error);
      return <Segment>寄！</Segment>;
    }

    throw new Error("unreachable");
  }

  return (
    <UserSidebarImpl
      user={user.data.data}
      mutate={user.mutate}
      isNarrow={props.isNarrow}
    />
  );
};

export default UserSidebar;
