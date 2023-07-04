import { useState, useCallback } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import { KeyedMutator } from "swr";
import { AronaInput } from "@components/Form";
import { List, PrimaryComment, Self } from "@data/interface";
import { TFetcher, isOk, request } from "@utils/network";

interface PostBoxProp {
  self: Self | null;
  imageId: number;
  commentId?: number;
  sideEffect?: () => void;
  mutate: KeyedMutator<TFetcher<List<PrimaryComment>>>;
}

const PostBox = (props: PostBoxProp) => {

  const [errMsg, setErrMsg] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [content, setContent] = useState("");

  const postComment = useCallback(async () => {
    setLoading(true);

    if (props.self === null) {
      setLoading(false);
      return;
    }

    if (content.length === 0) {
      setLoading(false);
      return;
    }

    interface PostResp {
      id: number;
      msg: string;
    }

    const resp = await request<PostResp>(
      "/api/social/comment",
      "POST",
      {
        content: content,
        belongToImageId: props.imageId,
        replyToCommentId: props.commentId,
      },
      props.self.jwt,
    );

    if (!isOk(resp)) {
      setErrMsg([resp.data.msg]);
      setLoading(false);
      return;
    }

    setContent("");
    props.mutate();
    if (typeof props.sideEffect !== "undefined") {
      props.sideEffect();
    }
    setLoading(false);
  }, [setLoading, content, props.self, props.imageId,
    props.commentId, setErrMsg, props.mutate]);

  return (
    <Form reply>
      <AronaInput
        type="controlled"
        value={content}
        setValue={setContent}
        maxLength={200}
        placeholder="留下一个友善的评论 :)"
        onConfirm={postComment}
      />
      <Button
        primary
        icon="edit"
        content="发布评论"
        labelPosition="left"
        onClick={postComment}
        loading={loading}
        style={{ maxWidth: "100%" }}
      />
      {errMsg.length > 0 && (
        <Message
          negative
          header="出了点问题…"
          list={errMsg}
        />
      )}
    </Form>
  );
};

export default PostBox;
