import { Comment, Divider, Header, Icon, Message, Pagination } from "semantic-ui-react";
import { Self } from "@data/interface";
import PostBox from "./PostBox";
import { useComments } from "@utils/hooks";
import { Loading } from "@components";
import AronaComment from "./Comment";
import { useState } from "react";
import styles from "./styles.module.scss";

interface CommentAreaProps {
  self: Self | null;
  imageId: number;
}

const CommentArea = (props: CommentAreaProps) => {

  const [page, setPage] = useState(1);
  const [showId, setShowId] = useState(-1);
  const comments = useComments(props.imageId, page, "time", props.self?.jwt);

  if (typeof comments.data === "undefined") {
    if (comments.isLoading) {
      return <Loading />;
    }
    return <Message content="寄" />;
  }

  const total = Math.ceil(comments.data.data.count / comments.data.data.perPage);

  return (
    <Comment.Group style={{ maxWidth: "100%" }} threaded>
      <PostBox
        self={props.self}
        imageId={props.imageId}
        mutate={comments.mutate}
      />
      <Divider />
      <div style={{ margin: "2rem 1rem 3rem 1rem" }}>
        <Header as='h1'>评论区</Header>
        {comments.data.data.result.map((comment) => (
          <AronaComment
            showId={showId}
            setShowId={setShowId}
            type="primary"
            key={comment.id}
            self={props.self}
            imageId={props.imageId}
            comment={comment}
            mutate={comments.mutate}
          />
        ))}
      </div>
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
    </Comment.Group>

  );
};

export default CommentArea;
