import { ImageInfo, Self } from "@data/interface";
import { copyText } from "@utils";
import { TFetcher, isOk, request } from "@utils/network";
import dayjs from "dayjs";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "semantic-ui-react";
import { KeyedMutator } from "swr";

interface BasicButtonProps {
  imageId: number;
  self: Self | null;
}

interface LikeButtonProps extends BasicButtonProps {
  likeCount: number;
  isLiked: boolean;
  mutate: KeyedMutator<TFetcher<ImageInfo>>;
}

export const LikeButton = (props: LikeButtonProps) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const onLike = useCallback(async () => {
    setLoading(true);

    if (self === null) {
      navigate("/login");
      return;
    }

    const resp = await request<null>(
      `/api/social/like/image/${props.imageId}`,
      "PUT", null, props.self?.jwt);

    if (!isOk(resp)) {
      alert(`点赞失败：${resp.data.msg}`);
      setLoading(false);
      return;
    }

    props.mutate();
    setLoading(false);
  }, [setLoading, self, navigate, props.mutate, props.isLiked]);

  return (
    <Button
      size="mini"
      color="red"
      content={props.isLiked ? "取消喜欢" : "喜欢"}
      basic={props.isLiked}
      icon="heart"
      loading={loading}
      onClick={onLike}
      label={{
        color: "red",
        content: props.likeCount,
      }}
    />
  );
};

export const DeleteButton = (props: BasicButtonProps) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const onDelete = useCallback(async () => {
    setLoading(true);

    if (self === null) {
      navigate("/login");
      return;
    }

    const resp = await request<null>(
      `/api/image/${props.imageId}`,
      "DELETE", null, props.self?.jwt);

    if (!isOk(resp)) {
      alert(`删除失败：${resp.data.msg}`);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate(-1);
  }, [setLoading, self, navigate, props.imageId]);

  return (
    <>
      <Button
        basic
        size="small"
        color="grey"
        // content={""}
        icon="trash alternate outline"
        loading={loading}
        disabled={loading}
        onClick={() => setModalOpen(true)}
      />
      <Modal
        size="mini"
        dimmer="blurring"
        open={modalOpen}
        closeOnDimmerClick={false}
        onClose={() => setModalOpen(false)}
      >
        <Modal.Header>真的要删除吗？</Modal.Header>
        <Modal.Content>注意：此操作无法撤销</Modal.Content>
        <Modal.Actions>
          {!loading &&
            <Button onClick={() => setModalOpen(false)}>取消</Button>
          }
          <Button
            onClick={onDelete}
            primary
            color="red"
            loading={loading}
            disabled={loading}
          >
            确认删除
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export const LinkButton = (props: BasicButtonProps) => {
  const [downloading, setDownloading] = useState<boolean>(false);

  interface DownloadResp {
    url: string;
    msg: string;
  }

  const onDownload = async () => {
    setDownloading(true);
    const resp = await request<DownloadResp>(`/api/image/${props.imageId}/download`, "GET", null, props.self?.jwt);
    if (isOk(resp)) {
      const url = resp.data.url;
      try {
        // await window.navigator.clipboard.writeText(url);
        copyText(url);
        alert(`已复制下载链接到剪贴板，有效期至 ${dayjs().add(7, "day").format("YY-MM-DD HH:mm:ss")}`);
      } catch (err) {
        alert(`复制下载链接失败 ${err}`);
      }
    } else {
      alert(`获取下载链接失败：${resp.data.msg}`);
    }
    setDownloading(false);
  };
  return (<Button
    basic
    size="small"
    color="pink"
    content={"获取外链"}
    icon="linkify"
    style={{ marginBottom: "0.3rem" }}
    loading={downloading}
    onClick={onDownload}
  />);
};
