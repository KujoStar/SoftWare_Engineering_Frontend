import { ImageList, Loading } from "@components";
import { useUserImages } from "@utils/hooks";
import { Icon, Pagination, Segment } from "semantic-ui-react";
import styles from "./styles.module.scss";
import { useState } from "react";

interface UserImagesProps {
  username: string;
}

const UserImages = (props: UserImagesProps) => {
  const [page, setPage] = useState(1);

  const images = useUserImages(props.username, page, "time");

  if (typeof images.data === "undefined") {
    if (images.isLoading) {
      return <Loading />;
    }

    if (typeof images.error !== "undefined") {
      return <Segment>寄。</Segment>;
    }

    throw new Error("unreachable");
  }

  const total = Math.ceil(images.data.data.count / images.data.data.perPage);

  return (
    <Segment>
      <ImageList
        images={images.data.data.result}
      />
      <div className={styles.pagination}>
        {total > 1 &&
          <Pagination
            firstItem={null}
            lastItem={null}
            ellipsisItem={{ content: "...", disabled: true, icon: true }}
            prevItem={{ content: <Icon name='angle left' />, icon: true }}
            nextItem={{ content: <Icon name='angle right' />, icon: true }}
            className={styles.fuckyou}
            defaultActivePage={page}
            onPageChange={(e, d) => setPage(d.activePage as number)}
            totalPages={total}
          />
        }
      </div>
    </Segment>
  );
};

export default UserImages;
