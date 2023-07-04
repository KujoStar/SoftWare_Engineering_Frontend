import { useLoaderData } from "react-router-dom";
import { preload } from "swr";
import { fetcher } from "@utils/network";
import { useUserDetail } from "@utils/hooks";
import { AppLayout } from "@layouts";
import { Loading, UserSidebar } from "@components";
import { NoUser } from "@pages/ErrorPages";
import UserImages from "./UserImages";
import styles from "./styles.module.scss";
import { useMedia } from "use-media";

export const loader = ({ params }: { params: { username?: string; } }) => {
  const { username } = params;

  if (typeof username === "undefined") {
    throw new Error("No username provided");
  }

  preload(`/api/user/${username}/detail`, fetcher);
  preload(`/api/user/${username}/images`, fetcher);

  return username;
};

export const Page = () => {
  const isWideScreen = useMedia({ minWidth: "600px" });
  const username = useLoaderData() as string;

  const user = useUserDetail(username);

  if (typeof user.data === "undefined") {
    if (user.isLoading) {
      return (
        <AppLayout>
          <Loading />
        </AppLayout>
      );
    }

    if (typeof user.error !== "undefined") {
      return <NoUser />;
    }

    throw new Error("unreachable");
  }

  return (
    <AppLayout>
      < div className={isWideScreen ? styles.container : styles.container_narrow}>
        <div style={{ flex: 1 }}>
          <UserSidebar
            username={username}
          />
        </div>
        <div style={{ flex: 4 }}>
          <UserImages username={username} />
        </div>
      </div>
    </AppLayout >
  );
};
