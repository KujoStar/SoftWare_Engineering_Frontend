import { Loading } from "@components";
import { AppLayout } from "@layouts";
import { useAppState } from "@state";
import { useUtilResults } from "@utils/hooks";
import { useState } from "react";
import { Icon, Pagination, Segment, Confirm, Image, Menu, Header, Container, Button } from "semantic-ui-react";

import styles from "./styles.module.scss";
import ResultList from "@components/ResultList";
import { useMedia } from "use-media";
import { LoginPlz } from "@pages/ErrorPages";
import { copyText } from "@utils";

interface TypeSelectProps {
  type: "all" | "convert" | "resolution" | "watermark";
  setPreview: (url: string, fileType: "gif" | "jpeg" | "png") => void;
  onDownload: (url: string, fileType: "gif" | "jpeg" | "png") => void;
}

const TypeSelect = (props: TypeSelectProps) => {
  const [page, setPage] = useState(1);
  const { self } = useAppState();
  const results = useUtilResults(page, self ? self.jwt : "", props.type === "all" ? undefined : props.type);

  if (typeof results.data === "undefined") {
    if (results.isLoading) {
      return <Loading />;
    }

    if (typeof results.error !== "undefined") {
      return <Segment>寄。</Segment>;
    }

    throw new Error("unreachable");
  }

  if (self === null) {
    return <LoginPlz />;
  }
  const total = Math.ceil(results.data.data.count / results.data.data.perPage);

  return (
    <>
      <ResultList
        results={results.data.data.result}
        setPreview={props.setPreview}
        onDownload={props.onDownload}
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
    </>);
};

export const Page = () => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"all" | "convert" | "resolution" | "watermark">("all");
  const [onType, setOnType] = useState<"gif" | "jpeg" | "png">("gif");
  const isWideScreen = useMedia({ minWidth: "500px" });

  const onDownload = async (url: string, fileType: string) => {
    if (url.length === 0) {
      console.error("url is empty");
      return;
    }
    console.log("download", url, fileType);
    // TODO: download depend on link type
    // try {
    //   const file = await fetch(url, { mode: "no-cors" });
    //   console.log(file);
    //   const blob = await file.blob();
    //   const blobUrl = URL.createObjectURL(blob);
    //   const link = document.createElement("a");
    //   link.href = blobUrl;
    //   link.download = `arona-${type}.${fileType}`;
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    //   URL.revokeObjectURL(blobUrl);
    // } catch (err) {
    //   alert(`下载失败：${err}`);
    //   console.error(err);
    // }
    try {
      // await window.navigator.clipboard.writeText(url);
      copyText(url);
      alert(`已复制下载链接到剪贴板：${url}`);
    } catch (err) {
      alert(`复制下载链接失败 ${err}`);
    }
  };
  const setPreview = (url: string, fileType: "gif" | "jpeg" | "png") => {
    setPreviewUrl(url);
    setOnType(fileType);
    setIsOpen(true);
  };
  const Preview = () => (
    <>
      <Confirm
        open={isOpen}
        onConfirm={() => onDownload(previewUrl, onType)}
        onCancel={() => { setIsOpen(false); setPreviewUrl(""); setOnType("gif"); }}
        confirmButton="复制下载链接"
        cancelButton="关闭预览"
        content={<Image src={previewUrl} fluid />}
        size="large"
      />
    </>
  );
  interface MenuOpt {
    key: "all" | "convert" | "resolution" | "watermark";
    text: string;
    icon: string;
  }
  const select: MenuOpt[] = [
    { key: "all", text: "全部", icon: "time" },
    { key: "convert", text: "视频转GIF", icon: "video" },
    { key: "resolution", text: "超分辨率", icon: "zoom" },
    { key: "watermark", text: "图片加水印", icon: "paw" },
  ];
  return (
    <AppLayout>
      <Container style={{
        width: "100%",
        textAlign: "center",
      }}>
        <Preview />
        <Header as="h1" style={{ margin: "2rem 0 2rem 0" }}>历史转换结果</Header>
        <Menu attached="top" tabular color="blue">
          {select.map((item) => (
            <Menu.Item
              key={item.key}
              name={isWideScreen ? item.text : ""}
              icon={isWideScreen ? false : item.icon}
              active={type === item.key}
              onClick={() => setType(item.key)}
            />
          ))}
          <Menu.Item button position="right">
            <Button onClick={() => { window.location.reload(); }} icon>
              <Icon className="refresh" />
            </Button>
          </Menu.Item>
        </Menu>
        <TypeSelect type={type} setPreview={setPreview} onDownload={onDownload} />
      </Container>
    </AppLayout>
  );
};


