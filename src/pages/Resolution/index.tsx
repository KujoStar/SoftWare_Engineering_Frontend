import { useState, useCallback } from "react";
import { Button, Segment, Image, Header, Message, Container } from "semantic-ui-react";
import { AronaInput } from "@components/Form";
import { FileInputChange } from "@data/interface";
import { AppLayout } from "@layouts";
import { useAppState } from "@state";
import { useNavigate } from "react-router-dom";
import { LoginPlz } from "@pages/ErrorPages";

export const Page = () => {
  const [url, setUrl] = useState<string>();
  const [img, setImg] = useState<File>();
  const [converting, setConverting] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [succeed, setSucceed] = useState(false);

  const { self } = useAppState();
  if (self === null) {
    return <LoginPlz />;
  }
  const onSelectFile = useCallback((e: FileInputChange) => {
    const file = e.target.files?.[0];
    if (typeof file !== "undefined") {
      if (file.type !== "image/png" && file.type !== "image/jpeg" && file.type !== "image/gif") {
        setErrMsg("只支持PNG, JPEG和GIF文件转换");
        return;
      }
      if (file.size > 1e7) {
        setErrMsg("上传图片大小应小于10MB");
        return;
      }
      setErrMsg("");
      setImg(file);
      setUrl(URL.createObjectURL(file));
    }
  }, [setImg]);

  const resolution = async () => {
    if (img === undefined) {
      return;
    }
    console.log(img);
    setConverting(true);
    const reqUrl = "/api/image/resolution";
    try {
      const form = new FormData();
      form.append("image", img);
      const res = await fetch(reqUrl, { body: form, method: "POST", headers: { "Authorization": `Bearer ${self?.jwt}` } });
      if (res.status === 200) {
        alert("上传成功");
        setErrMsg("");
        setSucceed(true);
      }
      else {
        setErrMsg(`上传失败：[${res.status}] ${res.statusText}`);
        alert(`上传失败：[${res.status}] ${res.statusText}`);
      }
    } catch (err) {
      setErrMsg(`上传失败：${err}`);
      alert(`上传失败：${err}`);
    }
    setConverting(false);
  };
  const navigate = useNavigate();
  if (succeed) {
    if (url) {
      URL.revokeObjectURL(url);
    }
    navigate("/utilities");
  }
  return (
    <AppLayout> {
      <Container style={{
        width: "1000px",
        textAlign: "center",
      }}>
        {errMsg.length !== 0 &&
          <Message negative>{errMsg}</Message>
        }
        <Header as="h1" style={{ margin: "2rem 0" }}>图片超分辨率</Header>
        <Segment textAlign="center">
          {url &&
            <div style={{ flex: 3, alignSelf: "center", margin: "2rem 2rem 2rem 2rem" }}>
              <Image src={url} fluid />
            </div>
          }
          <div style={{
            display: "flex",
            justifyContent: "space-evenly",
          }
          }>
            <AronaInput
              type="file"
              name="image"
              onChange={onSelectFile}
            />
            {
              url &&
              <Button
                loading={converting}
                disabled={converting || url === undefined}
                onClick={resolution}
                primary
              >
                提升分辨率
              </Button>
            }
          </div>
        </Segment >
      </Container >
    } </AppLayout>
  );
};
