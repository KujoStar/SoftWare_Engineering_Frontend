import { useLoaderData } from "react-router-dom";
import { Header, Image, Label, Segment, Confirm, Button } from "semantic-ui-react";
import dayjs from "dayjs";
import { useState } from "react";
import { useMedia } from "use-media";
import { preload } from "swr";

import { fetcher } from "@utils/network";
import { useImage } from "@utils/hooks";
import { IMAGE_CATEGORY } from "@data/constants";

import { AppLayout } from "@layouts";
import { useAppState } from "@state";

import { Loading, UserSidebar } from "@components";
import { NoImage } from "@pages/ErrorPages";
import CommentArea from "./CommentArea";
import { DeleteButton, LikeButton, LinkButton } from "./ImageButton";

import styles from "./styles.module.scss";
import EditForm from "@components/EditImage";
export const loader = ({ params }: { params: { id?: number; } }) => {
  const { id } = params;

  if (typeof id === "undefined") {
    throw new Error("No image id provided");
  }

  preload(`/api/image/${id}`, fetcher);

  return id;
};

export const Page = () => {
  const [preview, setPreview] = useState<boolean>(false);
  const id = useLoaderData() as number;
  const { self } = useAppState();
  const rawImage = useImage(id, self?.jwt);
  const isWideScreen = useMedia({ minWidth: "800px" });
  const isNarrowScreen = !useMedia({ minWidth: "560px" });
  const [downlonding, setDownloading] = useState(false);
  const [edit, setEdit] = useState(false);

  if (typeof rawImage.data === "undefined") {
    if (rawImage.isLoading) {
      return (
        <AppLayout>
          <Loading />
        </AppLayout>
      );
    }

    if (typeof rawImage.error !== "undefined") {
      console.error(rawImage.error);
      return <NoImage />;
    }

    throw new Error("unreachable");
  }

  const image = rawImage.data.data;
  const uploadTime = dayjs.unix(image.uploadTime);
  const category = IMAGE_CATEGORY.concat({ key: "10", text: "未分区", value: "Uncategorized" })
    .filter((entry) => (entry.value === image.category))[0].text;
  const sizeInfo = `${image.width}x${image.height}`;

  const DownLoad = async () => {
    setDownloading(true);
    try {
      const url = `/api/image/raw/${image.hash}`;
      const file = await fetch(url);
      const blob = await file.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `arona-image-${image.id}.${image.contentType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert(`下载失败：${err}`);
    }
    setDownloading(false);
  };

  const Preview = () => (<Confirm open={preview}
    onConfirm={() => { DownLoad(); setPreview(false); }}
    onCancel={() => { setPreview(false); }}
    content={
      <div className={styles.container_image}>
        <Image src={`/api/image/raw/${image.hash}`} loop />
      </div>
    }
    confirmButton="下载原图"
    cancelButton="关闭预览"
    size="large"
  />);

  return (
    <AppLayout>
      <div className={isWideScreen ? styles.container : styles.container_narrow}>
        <div style={{ flex: 1 }}>
          <UserSidebar username={image.uploader} isNarrow={!isWideScreen} />
        </div>
        <div style={{ flex: 3, marginBottom: "2rem" }}>
          <Segment style={{ position: "relative" }}>
            <div className={styles.container_image}>
              <Image
                loop
                style={{ minHeight: "10rem" }}
                src={`/api/image/raw/${image.hash}`}
                onClick={() => { setPreview(true); }}
              />
            </div>
            <div style={{ marginTop: "2rem", padding: "0 2rem" }}>
              <Header as="h1">
                {image.title === "Untitled" ? "无标题" : image.title}
                <Header.Subheader color="grey">
                  {sizeInfo}
                </Header.Subheader>
              </Header>
              <p>{image.description}</p>
              <div style={{ marginBottom: "1rem" }}>
                <Label color="blue">{category}</Label>
                {image.tags.map(
                  (tag) =>
                    <Label
                      key={tag}
                      style={{ marginBottom: "0.2rem", marginRight: "0.1rem" }}
                    >
                      {tag}
                    </Label>)
                }
              </div>
              <div style={{ fontSize: "0.8rem", color: "gray", marginTop: "2rem" }}>
                {uploadTime.format("YYYY-MM-DD HH:mm:ss")}
              </div>
            </div>
            <div style={isNarrowScreen ? { marginTop: "0.5rem", padding: "0 2rem" } : {
              position: "absolute",
              right: "2rem",
              bottom: "1rem",
            }}>
              {
                self !== null && self.username === image.uploader &&
                <Button
                  basic
                  size="small"
                  color="teal"
                  icon="edit outline"
                  loading={edit}
                  disabled={edit}
                  onClick={() => setEdit(true)} />
              }
              {
                self !== null && self.username === image.uploader &&
                <DeleteButton self={self} imageId={id} />
              }
              <LinkButton imageId={id} self={self} />
              <Button basic size="small" color="blue" icon="download"
                content="下载原图"
                loading={downlonding}
                onClick={() => DownLoad()}
              />
              <LikeButton
                self={self}
                imageId={id}
                likeCount={image.likes}
                isLiked={typeof image.isLiked !== "undefined" && image.isLiked}
                mutate={rawImage.mutate}
              />
            </div>
            <Preview />
            {self && self.username === image.uploader &&
              < EditForm img={image} self={self} open={edit} setClose={() => setEdit(false)} />}
          </Segment>
          <Segment>
            <CommentArea self={self} imageId={id} />
          </Segment>
        </div>
      </div >
    </AppLayout >
  );
};
