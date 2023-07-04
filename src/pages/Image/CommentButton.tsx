import { List, PrimaryComment, Self } from "@data/interface";
import { TFetcher, isOk, request } from "@utils/network";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import { KeyedMutator } from "swr";

interface CommentLikeButtonProps {
  self: Self | null;
  id: number;
  imageId: number;
  isLiked: boolean;
  mutate: KeyedMutator<TFetcher<List<PrimaryComment>>>;
}

export const CommentLikeButton = (props: CommentLikeButtonProps) => {

  const navigate = useNavigate();
  const [likeLoading, setLikeLoading] = useState(false);
  const likeComment = useCallback(async () => {
    setLikeLoading(true);

    if (props.self === null) {
      navigate("/login");
      return;
    }
  
    const resp = await request<null>(
      `/api/social/like/comment/${props.id}`,
      "PUT",
      null,
      props.self.jwt,
    );

    if (!isOk(resp)) {
      alert(`点赞失败: ${resp.data.msg}`);
      setLikeLoading(false);
    }
    
    props.mutate();
    setLikeLoading(false);
  }, [setLikeLoading, navigate, props.self, props.mutate]);
  return (<Icon
    name="like"
    loading={likeLoading}
    onClick={() => likeComment()}
    color={props.isLiked? "red" : "grey"}
  />);
};

interface CommentDeleteButtonProps {
  self: Self | null;
  id: number;
  mutate: KeyedMutator<TFetcher<List<PrimaryComment>>>;
}

export const CommentDeleteButton = (props: CommentDeleteButtonProps) => {
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteComment = useCallback(async () => {
    setDeleteLoading(true);

    if (props.self === null) {
      navigate("/login");
      return;
    }

    const resp = await request<null>(
      `/api/social/comment/${props.id}`,
      "DELETE",
      null,
      props.self.jwt,
    );

    if (!isOk(resp)) {
      alert(`删除评论失败: ${resp.data.msg}`);
      setDeleteLoading(false);
    }

    props.mutate();
    setDeleteLoading(false);
  }, [setDeleteLoading, navigate, props.self, props.mutate]);
  return (<Icon
    name="delete"
    loading={deleteLoading}
    onClick={() => deleteComment()}
  />);
};
