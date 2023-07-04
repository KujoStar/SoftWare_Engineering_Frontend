import { Button, Card, Label } from "semantic-ui-react";
import dayjs from "dayjs";
import styles from "./styles.module.scss";
import { LOAD_RETRY_PROP, LOAD_RETRY_TIME } from "@data/constants";
import { useState } from "react";
import Loading from "@components/Loading";
import { ResultInfo } from "@data/interface/utilities";
interface ResultCardProps {
  result: ResultInfo;
  setPreview: (url: string, fileType: "gif" | "jpeg" | "png") => void;
  onDownload: (url: string, fileType: "gif" | "jpeg" | "png") => void;
}

const ResultCard = (props: ResultCardProps) => {
  const finishTime = dayjs.unix(props.result.finishTime);
  const expiredTime = dayjs.unix(props.result.expiredTime);
  const [url, setUrl] = useState(props.result.url);

  let retryTime = LOAD_RETRY_TIME;
  const [load, setLoad] = useState(true);

  const handleError = () => {
    setLoad(true);
    setUrl("/default_image.png");
    retryTime *= LOAD_RETRY_PROP;
    setTimeout(() => { setLoad(true); setUrl(props.result.url); }, retryTime);
  };
  const handleLoad = () => {
    console.log("load: ", url);
    setLoad(false);
  };

  return (
    <>
      <Card style={{ marginLeft: "auto", marginRight: "auto", width: "18rem" }}>
        <div style={{ maxHeight: "20rem", overflow: "hidden", width: "100%" }}>
          {load && <Loading height="20rem" />}
          {<img
            src={url}
            onError={handleError}
            onLoad={handleLoad}
            style={{ objectFit: "cover", width: "100%", height: "100%", objectPosition: "top" }}
          />}
        </div>
        <Card.Content>
          <Card.Meta>
            <span>转换完成于 {finishTime.format("YYYY-MM-DD HH:mm:ss")}</span>
          </Card.Meta>
          <Card.Meta>
            <span>文件失效于 {expiredTime.format("YYYY-MM-DD HH:mm:ss")}</span>
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          {/* <div style={{ marginBottom: "0.5rem" }}> */}

          {/* </div> */}
          <div className={styles.cardextra}>
            <Label
              style={{ marginBottom: "0.2rem", marginRight: "0.1rem", outerHeight: "1rem" }}
              floated="left"
            >
              {props.result.type === "convert" ? "视频转GIF" : (props.result.type === "resolution" ? "超分辨率" : "图片加水印")}
            </Label>
            <Button
              secondary
              onClick={() => props.onDownload(props.result.url, props.result.fileType)}
              size="mini"
              floated="right"
            >
              下载
            </Button>
            <Button
              primary
              onClick={() => props.setPreview(props.result.url, props.result.fileType)}
              size="mini"
              floated="right"
            >
              查看
            </Button>
          </div>
        </Card.Content>
      </Card>
    </>
  );
};

export default ResultCard;
