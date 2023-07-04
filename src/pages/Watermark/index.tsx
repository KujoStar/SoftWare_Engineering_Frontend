import { useState, useCallback } from "react";
import { Button, Segment, Header, Message, Container, Grid, Divider, Input, Label } from "semantic-ui-react";
import { AronaInput } from "@components/Form";
import { FileInputChange, InputChange } from "@data/interface";
import { AppLayout } from "@layouts";
import { useAppState } from "@state";
import { useNavigate } from "react-router-dom";
import { ImagePreview } from "@components/ImagePreview";
import { useMedia } from "use-media";
import { LoginPlz } from "@pages/ErrorPages";

export const Page = () => {
  const isWideScreen = useMedia({ minWidth: "650px" });
  const [url, setUrl] = useState<string>();
  const [img, setImg] = useState<File>();
  const [converting, setConverting] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [succeed, setSucceed] = useState(false);

  const { self } = useAppState();
  const username = self ? self.username : "guest";

  const [top, setTop] = useState(93);
  const [left, setLeft] = useState(5);
  const [fontSize, setFontSize] = useState(3);
  const [text, setText] = useState(`A.R.O.N.A@${username}`);
  if (self === null) {
    return <LoginPlz />;
  }
  const onSelectFile = useCallback((e: FileInputChange) => {
    const file = e.target.files?.[0];
    if (typeof file !== "undefined") {
      if (file.type !== "image/png" && file.type !== "image/jpeg" && file.type !== "image/gif") {
        setErrMsg("只支持PNG, JPEG和GIF文件加水印");
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

  const watermark = async () => {
    if (img === undefined) {
      return;
    }
    console.log(img);
    setConverting(true);
    const reqUrl = `/api/image/watermark?text=${text}&fontSize=${fontSize}&widthPos=${left}&heightPos=${top}`;
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
  const handleTextChange = (e: InputChange) => {
    setText(e.target.value);
  };
  const Edit = () => (<>
    <Grid.Row centered>
      <div style={{
        display: "flex",
        justifyContent: "space-evenly",
        marginTop: "2rem",
      }
      }>
        <Button size="small">{`横向位置 ${left} %`}</Button>
        <Button size="mini" secondary onClick={() => { setLeft(5); }}>重置</Button>
      </div>
      <Input
        onChange={(e) => setLeft(parseInt(e.target.value))}
        step={1}
        type="range"
        value={left}
        fluid
      />
    </Grid.Row>
    <Grid.Row centered>
      <div style={{
        display: "flex",
        justifyContent: "space-evenly",
        marginTop: "2rem",
      }
      }>
        <Button size="small">{`纵向位置 ${top} %`}</Button>
        <Button size="mini" secondary onClick={() => { setTop(93); }}>重置</Button>
      </div>
      <Input
        min={0}
        max={100}
        onChange={(e) => setTop(parseInt(e.target.value))}
        step={1}
        type="range"
        value={top}
        fluid
      />
    </Grid.Row>
    <Grid.Row centered>
      <div style={{
        display: "flex",
        justifyContent: "space-evenly",
        marginTop: "2rem",
      }
      }>
        <Button size="small">{`文字大小 ${fontSize} %`}</Button>
        <Button size="mini" secondary onClick={() => { setFontSize(3); }}>重置</Button>
      </div>
      <Input
        min={1}
        max={20}
        onChange={(e) => setFontSize(parseInt(e.target.value))}
        step={1}
        type="range"
        value={fontSize}
        fluid
      />
    </Grid.Row>
  </>);

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
        <Header as="h1" style={{ margin: "2rem 0" }}>图片加水印</Header>
        <Segment textAlign="center">
          {url &&
            <div style={{ flex: 3, alignSelf: "left", margin: "1rem 2rem 2rem 2rem" }}>
              <Grid>
                {isWideScreen ?
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <ImagePreview url={url} text={text} left={left} top={top} fontSize={fontSize} />
                      <Label style={{ marginTop: "0.5rem" }}>预览水印效果</Label>
                    </Grid.Column>
                    <Grid.Column>
                      <Grid.Row centered>
                        <Header as="h3">设置水印参数</Header>
                      </Grid.Row>
                      <Grid.Row centered>
                        <div style={{
                          width: "100%",
                          marginTop: "2rem",
                        }
                        }>
                          <Input
                            maxLength={32}
                            onChange={handleTextChange}
                            type="input"
                            value={text}
                            label="水印文字"
                            placeholder={`A.R.O.N.A@${username}`}
                            fluid
                          />
                        </div>
                      </Grid.Row>
                      <Edit />
                    </Grid.Column>
                  </Grid.Row>
                  : <Grid.Column>
                    <ImagePreview url={url} text={text} left={left} top={top} fontSize={fontSize} />
                    <Label style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>预览水印效果</Label>
                    <Grid.Row centered>
                      <Header as="h3">设置水印参数</Header>
                    </Grid.Row>
                    <Grid.Row centered>
                      <div style={{
                        width: "100%",
                        marginTop: "2rem",
                      }
                      }>
                        <Input
                          maxLength={32}
                          onChange={handleTextChange}
                          type="input"
                          value={text}
                          label="水印文字"
                          placeholder={`A.R.O.N.A@${username}`}
                          fluid
                        />
                      </div>
                    </Grid.Row>
                    <Edit />
                  </Grid.Column>
                }
              </Grid>
              <Divider />
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
                onClick={watermark}
                primary
              >
                加水印
              </Button>
            }
          </div>
        </Segment >
      </Container >
    } </AppLayout>
  );
};
