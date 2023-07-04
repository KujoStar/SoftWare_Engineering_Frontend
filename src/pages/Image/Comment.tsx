import { Comment } from "semantic-ui-react";
import { List, PrimaryComment, SecondaryComment, Self } from "@data/interface";
import dayjs from "dayjs";
import { md5 } from "@utils/mika_kawaii/mika_kawaii";
import { Link } from "react-router-dom";
import { KeyedMutator } from "swr";
import { TFetcher } from "@utils/network";
import PostBox from "./PostBox";
import { CommentLikeButton, CommentDeleteButton } from "./CommentButton";
import { useMemo } from "react";
import { DEFAULT_AVATAR_LINK } from "@data/constants";

interface Basic {
  head?: JSX.Element;
  showId: number;
  setShowId: React.Dispatch<React.SetStateAction<number>>;
  self: Self | null;
  imageId: number;
  mutate: KeyedMutator<TFetcher<List<PrimaryComment>>>;
}
interface PrimaryCommentProps extends Basic {
  type: "primary";
  comment: PrimaryComment;
}

interface SecondaryCommentProps extends Basic {
  type: "secondary";
  comment: SecondaryComment;
}

interface CommentListProps extends Basic {
  comments: SecondaryComment[];
}

const CommentList = (props: CommentListProps) => {
  const empty = typeof props.head === "undefined" && props.comments.length === 0;

  if (empty) {
    return <></>;
  }

  return (
    <Comment.Group>
      {typeof props.head !== "undefined" &&
        <Comment>
          {props.head}
        </Comment>
      }
      {props.comments.map((comment) =>
        <AronaComment
          showId={props.showId}
          setShowId={props.setShowId}
          self={props.self}
          imageId={props.imageId}
          mutate={props.mutate}
          type="secondary"
          key={comment.id}
          comment={comment}
        />)
      }
    </Comment.Group>);
};

type AronaCommentProps = PrimaryCommentProps | SecondaryCommentProps;

const AronaComment = (props: AronaCommentProps) => {

  const comment = props.comment;
  const poster = comment.poster;

  const hash = md5(poster.email.trim().toLowerCase());
  const url = `https://gravatar.shinku.life/avatar/${hash}?d=${DEFAULT_AVATAR_LINK}`;

  const time = useMemo(() => {
    if (typeof comment.postTime === "undefined") {
      return "undefined";
    }
    return dayjs.unix(comment.postTime).format("YYYY-MM-DD HH:mm:ss");
  }, [comment.postTime]);

  const sender = () =>
    <PostBox
      self={props.self}
      commentId={comment.id}
      imageId={props.imageId}
      mutate={props.mutate}
      sideEffect={() => props.setShowId(-1)}
    />;

  return (
    <Comment>
      <Comment.Avatar
        as={Link}
        to={`/user/${poster.username}`}
        src={url}
      />
      <Comment.Content>
        <Comment.Author
          as={Link}
          to={`/user/${poster.username}`}
        >
          {poster.nickname}
        </Comment.Author>
        <Comment.Metadata>
          <div>
            {time}
          </div>
        </Comment.Metadata>
        <Comment.Text>
          {
            props.type === "secondary" && props.comment.replyToUser !== null && (
              <Link
                to={`/user/${props.comment.replyToUser}`}
                style={{ color: "#00A1D6", marginRight: "0.5rem" }}
              >
                {`@${props.comment.replyToUser}`}
              </Link>
            )
          }
          <span style={{ whiteSpace: "pre-wrap" }}>
            {comment.content}
          </span>
        </Comment.Text>
        <Comment.Actions>
          <Comment.Action>
            <CommentLikeButton
              self={props.self}
              id={comment.id}
              imageId={props.imageId}
              isLiked={comment.isLiked}
              mutate={props.mutate}
            />
            {comment.likes}
          </Comment.Action>
          <Comment.Action>
            <div
              onClick={() => {
                if (props.showId !== comment.id) {
                  props.setShowId(comment.id);
                }
                else {
                  props.setShowId(-1);
                }
              }}
            >
              回复
            </div>
          </Comment.Action>
          {
            props.self !== null &&
            poster.username === props.self.username &&
            <Comment.Action>
              <CommentDeleteButton
                self={props.self}
                id={comment.id}
                mutate={props.mutate}
              />
            </Comment.Action>
          }
        </Comment.Actions>
        { props.type === "secondary" && props.showId === comment.id && sender() }
      </Comment.Content>
      {props.type === "primary" && (
        <CommentList
          head={ props.showId === comment.id ? sender() : undefined }
          showId={props.showId}
          setShowId={props.setShowId}
          self={props.self}
          mutate={props.mutate}
          imageId={props.imageId}
          comments={props.comment.replies}
        />
      )}
    </Comment>
  );
};

export default AronaComment;
