import { useState, useCallback, useRef, useEffect } from "react";
import { Button, Segment, Header, Message, Icon, Divider, Grid, Input, Container } from "semantic-ui-react";
import { AronaInput } from "@components/Form";
import { FileInputChange } from "@data/interface";
import { AppLayout } from "@layouts";
import { useAppState } from "@state";
import { useNavigate } from "react-router-dom";
import { useMedia } from "use-media";
import { LoginPlz } from "@pages/ErrorPages";

export const Page = () => {
  const isWideScreen = useMedia({ minWidth: "650px" });
  const [videoUrl, setVideoUrl] = useState<string>();
  const [video, setVideo] = useState<File>();
  const [converting, setConverting] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  const [resize, setResize] = useState(1.00);
  const [start, setStart] = useState(0.00);
  const [end, setEnd] = useState(0.00);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [fullLength, setFullLength] = useState(0.00);
  const { self } = useAppState();
  const [succeed, setSucceed] = useState(false);
  if (self === null) {
    return <LoginPlz />;
  }

  useEffect(() => {
    if (playing) {
      return;
    }
    if (videoRef.current) {
      videoRef.current.currentTime = start;
    }
  }, [start, fullLength]);
  useEffect(() => {
    if (playing) {
      return;
    }
    if (videoRef.current) {
      videoRef.current.currentTime = end;
    }
  }, [end]);
  const getFullLength = () => {
    if (videoRef.current) {
      const dur = 1.0 * Math.floor(videoRef.current.duration * 100.0) / 100.0;
      setFullLength(dur);
      setEnd(dur);
      console.log("length: ", dur);
    }
  };
  const onPlay = () => {
    if (start > end) {
      alert("截取片段的开头时间点必须早于结尾时间点！");
      return;
    }
    if (videoRef.current) {
      if (playing) {
        setPlaying(false);
        videoRef.current.pause();
      }
      setPlaying(true);
      videoRef.current.currentTime = start;
      console.log("play:", videoRef.current.currentTime);
      videoRef.current.play();

      videoRef.current.addEventListener("timeupdate", () => {
        if (videoRef.current && videoRef.current.currentTime >= end) {
          console.log("pause:", videoRef.current.currentTime);
          videoRef.current.pause();
          setPlaying(false);
        }
        // }
      });
    }
  };
  const onPause = () => {
    if (videoRef.current) {
      if (!playing) {
        console.error("pause nonplaying video");
        return;
      }
      videoRef.current.pause();
      setPlaying(false);
      console.log("pause:", videoRef.current.currentTime);
    }
  };
  const onSetCurrent = (forStart: boolean) => {
    if (videoRef.current) {
      if (playing) {
        console.error("set moving timestamp");
        return;
      }
      const timeStamp = Math.floor(videoRef.current.currentTime * 100) / 100;
      if (forStart) {
        setStart(timeStamp);
        if (end < start) {
          setEnd(timeStamp);
        }
      }
      else {
        setEnd(timeStamp);
      }
    }
  };

  const onSelectMP4 = useCallback((e: FileInputChange) => {
    const file = e.target.files?.[0];
    if (typeof file !== "undefined") {
      if (file.type !== "video/mp4" && file.type !== "video/x-matroska") {
        setErrMsg("只支持MP4/MKV格式到GIF的转换");
        return;
      }
      if (file.size > 1e7) {
        setErrMsg("上传视频大小应小于10MB");
        return;
      }
      setErrMsg("");
      setVideo(file);
      setVideoUrl(URL.createObjectURL(file));
    }
  }, [setVideo]);

  const convert = async () => {
    if (video === undefined) {
      return;
    }
    if (start > end) {
      alert("起始时间不能晚于结束时间");
      return;
    }
    setConverting(true);
    let reqUrl = "/api/image/convert";
    if (start !== 0.00 || end !== fullLength || resize !== 1.00) {
      reqUrl += `?start=${start}&end=${end}&resize=${resize}`;
    }
    try {
      const form = new FormData();
      form.append("video", video);
      const res = await fetch(reqUrl, { body: form, method: "POST", headers: { "Authorization": `Bearer ${self?.jwt}` } });
      if (res.status === 200) {
        alert("上传成功");
        setErrMsg("");
        setSucceed(true);
      }
      else {
        setErrMsg(`上传失败：${res.statusText}`);
        alert(`上传失败：${res.statusText}`);
      }
    } catch (err) {
      setErrMsg(`上传失败：${err}`);
      alert(`上传失败：${err}`);
    }
    setConverting(false);
  };
  const navigate = useNavigate();
  if (succeed) {
    navigate("/utilities");
  }
  const Video = (
    <>
      <Grid.Column>
        <Grid.Row style={{ marginBottom: "2rem" }} centered>
          <video ref={videoRef} autoPlay={false} onLoadedMetadata={getFullLength} width={"100%"}>
            <source src={videoUrl} />
          </video>
        </Grid.Row>
      </Grid.Column>
      <Grid.Column rows={4}>
        <Grid.Row centered>
          <Header as="h3">设置转换参数</Header>
        </Grid.Row>
        <Grid.Row centered>
          <div style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "3rem",
          }
          }>
            <Button size="small">{`开始于 ${start} s`}</Button>
            <Button size="mini" disabled={playing} secondary onClick={() => { onSetCurrent(true); }}>当前</Button>
            <Button size="mini" basic onClick={() => { setStart(0); }}>重置</Button>
          </div>
          <Input
            min={0.00}
            max={fullLength}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setStart(val);
              if (val > end) {
                setEnd(val);
              }
            }}
            step={0.01}
            type="range"
            value={start}
            fluid
          />
        </Grid.Row>
        <Grid.Row centered>
          <div style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "1rem",
          }
          }>
            <Button size="small">{`结束于 ${end} s`}</Button>
            <Button size="mini" disabled={playing} secondary onClick={() => { onSetCurrent(false); }}>当前</Button>
            <Button size="mini" basic onClick={() => { setEnd(fullLength); }}>重置</Button>
          </div>
          <Input
            min={0.00}
            max={fullLength}
            onChange={(e) => {
              const val = Math.max(start, parseFloat(e.target.value));
              setEnd(val);
            }}
            step={0.01}
            type="range"
            value={end}
            fluid
          />
        </Grid.Row>
        <Grid.Row centered>
          <div style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "1rem",
          }
          }>
            <Button size="small">{`图片质量: ${resize}`}</Button>
            <Button size="mini" secondary onClick={() => { setResize(0.01); }}>最低</Button>
            <Button size="mini" basic onClick={() => { setResize(1.00); }}>重置</Button>
          </div>
          <Input
            min={0.00}
            max={1.00}
            onChange={(e) => { setResize(parseFloat(e.target.value)); }}
            step={0.01}
            type="range"
            value={resize}
            fluid
          />
        </Grid.Row>
        <Grid.Row centered>
          <div style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "1rem",
          }
          }>
            {<Button onClick={onPlay} primary><Icon name="play" />预览</Button>}
            {<Button secondary disabled={!playing} onClick={onPause}><Icon name="pause" />停止</Button>}
          </div>
        </Grid.Row>
      </Grid.Column>
    </>);
  return (
    <AppLayout> {
      <Container style={{
        width: "1000px",
        textAlign: "center",
      }}>
        {errMsg.length !== 0 && <Message negative>{errMsg}</Message>}
        <Header as="h1" style={{ margin: "2rem 0" }}>视频转GIF</Header>
        <Segment textAlign="center">
          {videoUrl &&
            <div style={{ flex: 3, alignSelf: "center", margin: "1rem 2rem 2rem 2rem" }}>
              <Grid>
                {isWideScreen ?
                  <Grid.Row columns={2}>
                    {Video}
                  </Grid.Row>
                  : <Grid.Column>{Video}</Grid.Column>
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
              name="video"
              onChange={onSelectMP4}
            />
            {
              videoUrl &&
              <Button
                loading={converting}
                disabled={converting || videoUrl === undefined}
                onClick={() => convert()}
                primary
              >
                转为GIF
              </Button>
            }
          </div>
        </Segment >
      </Container >
    } </AppLayout>
  );
};
