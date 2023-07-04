import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Label, DropdownProps, Message, Dropdown, Icon, Image, Segment, Progress } from "semantic-ui-react";
import { Self } from "@data/interface";
import { IMAGE_CATEGORY, MAX_IMAGE_SIZE, TAG_BANNED_CHAR } from "@data/constants";
import { isOk, request, upload } from "@utils/network";
import { blake3 } from "@utils/mika_kawaii/mika_kawaii";
import { AronaInput } from "@components/Form";
import { LoginPlz } from "@pages/ErrorPages";

interface InfoFormProps {
  self: Self;
  file: File | null;
  imageUrl: string | null;
  prevPage: () => void;
}

const InfoForm = ({ self, file, imageUrl, prevPage }: InfoFormProps) => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<number>(-1);
  const [percent, setPercent] = useState<number>(0);
  const [watermarked, setWatermarked] = useState<number>(0);
  useEffect(() => {
    const tik = setInterval(() => {
      const del = Math.random() / 5;
      if (stage === -1) {
        setPercent(0);
      }
      else if (stage === 0) {// 0 - 20
        setPercent(x => Math.min(x + (del * (20 - x)), 20));
      }
      else if (stage === 1) {// 20 - 50
        setPercent(x => Math.max(20, x));
        setPercent(x => Math.min(x + (del * (50 - x)), 50));
      }
      else if (stage === 2) {// 50 - 90
        setPercent(x => Math.max(50, x));
        setPercent(x => Math.min(x + (del * (90 - x)), 90));
      }
      else {// 90 - 100
        setPercent(x => Math.max(90, x));
        setPercent(x => Math.min(x + (del * (100 - x)), 100));
      }
    }, 300);
    return () => clearInterval(tik);
  }, [stage, setPercent]);

  interface IForm {
    title: string;
    description: string;
    category: string;
    tags: string[];
    nsfw: boolean;
  }

  const [form, setForm] = useState<IForm>({
    title: "",
    description: "",
    category: "wait",
    tags: [],
    nsfw: false,
  });

  const [errMsg, setErrMsg] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  const fieldChange = useCallback((name: string, v: string) => {
    setForm((form) => ({ ...form, [name]: v }));
    setErrMsg([]);
  }, [setForm, setErrMsg]);

  const addTag = useCallback((rawTag: string) => {
    if (form.tags.length >= 20) {
      setErrMsg(["标签数量过多"]);
      return;
    }

    const tag = rawTag.trim();

    if (form.tags.includes(tag)) {
      setErrMsg(["标签已存在"]);
      return;
    }

    setForm((form) => ({ ...form, tags: [...form.tags, tag] }));
    setErrMsg([]);
  }, [form.tags, setForm, setErrMsg]);

  const removeTag = useCallback((rawTag: string) => {
    const tag = rawTag.trim();
    setForm((form) => ({ ...form, tags: form.tags.filter((t) => t !== tag) }));
    setErrMsg([]);
  }, [setForm, setErrMsg]);

  const onCurrentTagChange = useCallback((value: string) => {
    // TODO: guess possible tag by current input
    console.log(value);
  }, []);

  const onCurrentTagConfirm = useCallback((value: string) => {
    const tag = value.trim();
    if (tag.length === 0) {
      return;
    }
    addTag(tag);
  }, [addTag]);

  const onSelectChange = useCallback((_: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    if (typeof data.value !== "string") {
      throw new Error("???");
    }

    fieldChange("category", data.value);
  }, [fieldChange]);

  const checkForm = useCallback(() => {
    const res = [];

    if (file === null) {
      res.push("无法打开上传文件，请检查其是否为图片");
    } else if (file.size > MAX_IMAGE_SIZE) {
      res.push("图片大小不得超过 100MiB");
    }

    if (form.category === "wait") {
      res.push("请选择图片分区");
    }

    const title = form.title.trim();
    if (title.length === 0) {
      res.push("图片标题不能为空");
    }

    return res;
  }, [form, file]);

  const uploadImage = useCallback(async () => {
    setSending(true);

    const msg = checkForm();

    if (msg.length > 0) {
      setStage(-1);
      setErrMsg(msg);
      setSending(false);
      return;
    }

    if (file === null) {
      throw new Error("unreachable");
    }
    if (self === null) {
      throw new Error("unreachable");
    }

    interface SemiUploadResp {
      id?: number;
      msg?: string;
    }
    setStage(0);
    const fileContent = new Uint8Array(await file.arrayBuffer());
    setStage(1);

    const hash = blake3(fileContent);
    console.log("File hash", hash);

    const resp0 = await request<SemiUploadResp>("/api/image/semiupload", "POST", { hash: hash }, self.jwt);
    setStage(2);
    if (!isOk(resp0)) {
      setStage(-1);
      setErrMsg([resp0.data.msg]);
      setSending(false);
      return;
    }
    let id = -1;

    if (resp0.status === 204) {
      interface UploadResp {
        id: number;
      }
      const resp = await upload<UploadResp>("/api/image/upload", { image: file, watermarked: watermarked }, self.jwt);
      if (!isOk(resp)) {
        setStage(-1);
        setErrMsg([resp.data.msg]);
        setSending(false);
        return;
      }
      id = resp.data.id;
    }
    else if (isOk(resp0)) {
      if (typeof resp0.data.id !== "number") {
        console.error("unreachable");
        throw new Error("unreachable");
      }
      id = resp0.data.id;
    }
    else {
      console.error("unreachable");
      throw new Error("unreachable");
    }

    setStage(3);

    interface PostResp {
      msg: string;
    }

    const resp2 = await request<PostResp>(`/api/image/${id}`, "PATCH", form, self.jwt);

    if (!isOk(resp2)) {
      setStage(-1);
      setErrMsg([resp2.data.msg]);
      setSending(false);
      return;
    }
    setPercent(100);
    navigate(`/image/${id}`);
  }, [form, file, checkForm, setSending, setErrMsg, self]);

  if (self === null) {
    return <LoginPlz />;
  }

  return (
    <>
      <Segment styles={{ minWidth: "300px" }}>
        <Form style={{ textAlign: "left", overflow: "hidden" }} onSubmit={() => false}>
          <AronaInput
            type="input"
            placeholder="标题"
            onChange={(v) => fieldChange("title", v)}
            maxLength={32}
          />
          <AronaInput
            type="textarea"
            placeholder="正文"
            onChange={(v) => fieldChange("description", v)}
            maxLength={3000}
          />
          <AronaInput
            type="input"
            placeholder="请添加相关标签，用回车分隔"
            onChange={(v) => onCurrentTagChange(v)}
            onConfirm={onCurrentTagConfirm}
            maxLength={20}
            banList={TAG_BANNED_CHAR}
          />
          {form.tags.length !== 0 && (
            <div style={{ marginBottom: "1rem" }}>
              {form.tags.map((v: string, i: number) => (
                <Label key={i}>
                  <span>{v}</span>
                  <Icon
                    name="delete"
                    onClick={() => removeTag(v)}
                  />
                </Label>
              ))}
            </div>
          )}
          <Form.Field
            selection
            control={Dropdown}
            options={IMAGE_CATEGORY}
            placeholder="请选择分区"
            onChange={onSelectChange}
          />
          {imageUrl !== null && (
            <Image
              src={imageUrl}
              alt="preview"
              loop
              style={{
                margin: "1rem 0",
                maxHeight: "20rem",
              }}
            />
          )}
          <div style={{ marginBottom: "1rem" }}>
            <Button
              className={watermarked ? "basic black" : "secondary"}
              onClick={() => setWatermarked((x) => (1 - x))}
              style={{ marginRight: "1rem" }}
            >
              {watermarked ? "去除水印" : "添加水印"}
            </Button>
            <Button type="button" onClick={prevPage} style={{ marginRight: "1rem" }}>
              返回
            </Button>
            <Button
              primary
              type="button"
              onClick={uploadImage}
              loading={sending}
              disabled={sending}
            >
              上传
            </Button>
          </div>
          <Progress color={stage !== -1 ? "blue" : undefined} active percent={Math.round(percent)} progress="percent" />
          {errMsg.length > 0 && (
            <Message
              negative
              header="出了点问题…"
              list={errMsg}
            />
          )}
        </Form>
      </Segment >
    </>
  );
};

export default InfoForm;
