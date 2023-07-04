import { Button, Card, Icon, Label } from "semantic-ui-react";
import dayjs from "dayjs";
import { ImageInfo } from "@data/interface";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import { IMAGE_CATEGORY, LOAD_RETRY_PROP, LOAD_RETRY_TIME } from "@data/constants";
import { useState } from "react";
import Loading from "@components/Loading";
interface ImageCardProps {
  image: ImageInfo;
  showUploader?: boolean;
}

const ImageCard = (props: ImageCardProps) => {
  const uploadTime = dayjs.unix(props.image.uploadTime);
  const category = IMAGE_CATEGORY.concat({ key: "10", text: "未分区", value: "Uncategorized" })
    .filter((entry) => (entry.value === props.image.category))[0].text;

  const raw = `/api/image/raw/${props.image.hash}`;
  const rough = `/api/image/rough/${props.image.hash}`;
  const [rawUrl, setRawUrl] = useState(raw);
  const [roughUrl, setRoughUrl] = useState(rough);

  let retryTime = LOAD_RETRY_TIME;
  const [loadRough, setLoadRough] = useState(true);
  const [loadRaw, setLoadRaw] = useState(true);
  const [errRaw, setErrRaw] = useState(false);

  const handleRoughError = () => {
    setLoadRough(true);
    setRoughUrl("/default_image.png");
    retryTime *= LOAD_RETRY_PROP;
    setTimeout(() => { setLoadRough(true); setRoughUrl(rough); }, retryTime);
  };
  const handleRawError = () => {
    setLoadRaw(true);
    setErrRaw(true);
    setRawUrl("");
    retryTime *= LOAD_RETRY_PROP;
    setTimeout(() => { setLoadRaw(true); setRawUrl(raw); console.log("reload raw"); }, retryTime);
  };
  const handleLoadRough = () => {
    console.log("load rough: ", roughUrl);
    setLoadRough(false);
  };
  const handleLoadRaw = () => {
    console.log("load raw: ", rawUrl);
    setLoadRaw(false);
    setErrRaw(false);
  };

  return (
    <Card style={{ marginLeft: "auto", marginRight: "auto", width: "18rem" }}>
      <div style={{ maxHeight: "20rem", overflow: "hidden", width: "100%" }}>
        {loadRough && (loadRaw || errRaw) && <Loading height="20rem" />}
        {(loadRaw || errRaw) && <img
          src={roughUrl}
          onError={handleRoughError}
          onLoad={handleLoadRough}
          style={{ objectFit: "cover", width: "100%", height: "100%", objectPosition: "top" }}
        />}
        {<img
          hidden={errRaw}
          src={rawUrl}
          onError={handleRawError}
          onLoad={handleLoadRaw}
          style={{ objectFit: "cover", width: "100%", height: "100%", objectPosition: "top" }}
        />}

      </div>
      <Card.Content>
        <Card.Header>{props.image.title === "Untitled" ? "无标题" : props.image.title}</Card.Header>
        <Card.Meta>
          <span>{props.showUploader && <Link to={`/user/${props.image.uploader}`}>{props.image.uploader} </Link>}
            上传于 {uploadTime.format("YYYY-MM-DD HH:mm:ss")}</span>
        </Card.Meta>
        <Card.Description>
          <div className={styles.ellipsis}>
            {props.image.description}
          </div>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div style={{ marginBottom: "0.5rem" }}>
          <Label
            color="blue"
            style={{ marginBottom: "0.2rem", marginRight: "0.1rem" }}
          >
            {category}
          </Label>
          {props.image.tags.slice(0, 10).map(
            (tag) =>
              <Label
                key={tag}
                style={{ marginBottom: "0.2rem", marginRight: "0.1rem" }}
              >
                {tag}
              </Label>,
          )}
        </div>
        <div className={styles.cardextra}>
          <span>
            <span>
              <Icon
                name="heart"
                color={typeof props.image.isLiked !== "undefined" && props.image.isLiked ? "red" : "grey"}
              />
              <span>{props.image.likes}</span>
            </span>
            <span>
              <Icon name="comments" />
              <span>{props.image.comments}</span>
            </span>
          </span>
          <Button
            primary
            as={Link}
            to={`/image/${props.image.id}`}
            size="mini"
            floated="right"
          >
            查看
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default ImageCard;
