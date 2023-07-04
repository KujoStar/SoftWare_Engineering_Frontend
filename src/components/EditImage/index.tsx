import { useCallback, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Form, Button, Label, DropdownProps, Message, Dropdown, Icon, Modal, Header } from "semantic-ui-react";
import { ImageInfo, Self } from "@data/interface";
import { IMAGE_CATEGORY, TAG_BANNED_CHAR } from "@data/constants";
import { isOk, request } from "@utils/network";
import { AronaInput } from "@components/Form";
import { LoginPlz } from "@pages/ErrorPages";

interface EditFormProps {
  self: Self;
  img: ImageInfo;
  open: boolean;
  setClose: () => void;
}

const EditForm = ({ self, img, open, setClose }: EditFormProps) => {

  interface IForm {
    title: string;
    description: string;
    category: string;
    tags: string[];
    nsfw: boolean;
  }

  const [form, setForm] = useState<IForm>({
    title: img.title,
    description: img.description,
    category: img.category,
    tags: img.tags,
    nsfw: false,
  });

  const [errMsg, setErrMsg] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  const fieldChange = useCallback((name: string, v: string) => {
    setForm((form) => ({ ...form, [name]: v }));
    setErrMsg([]);
  }, [setForm, setErrMsg]);

  const addTag = useCallback((rawTag: string) => {
    if (form.tags.length >= 10) {
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
    const title = form.title.trim();
    if (title.length === 0) {
      res.push("图片标题不能为空");
    }
    return res;
  }, [form]);

  const EditImage = useCallback(async () => {
    setSending(true);

    const msg = checkForm();

    if (msg.length > 0) {
      setErrMsg(msg);
      setSending(false);
      return;
    }
    if (self === null) {
      throw new Error("unreachable");
    }

    const resp = await request<null>(`/api/image/${img.id}`, "PATCH", form, self.jwt);

    if (!isOk(resp)) {
      setErrMsg([resp.data.msg]);
      setSending(false);
      return;
    }
    setClose();
    alert("修改图片信息成功");
    window.location.reload();
    // navigate(`/image/${img.id}`);
  }, [form, checkForm, setSending, setErrMsg, self]);

  if (self === null) {
    return <LoginPlz />;
  }

  return (
    <>
      <Modal open={open}>
        <Header as="h1" style={{ textAlign: "center", marginTop: "1rem" }}>编辑图片信息</Header>
        <div style={{ margin: "2rem 2rem 2rem 2rem" }}>
          {/* {img.hash && (
            <Image
              src={`/api/image/rough/${img.hash}`}
              alt="preview"
              loop
              style={{
                margin: "1rem 0",
              }}
              fluid
            />
          )} */}
          <Form style={{ textAlign: "left", overflow: "hidden" }} onSubmit={() => false}>

            <Header as="h3">修改标题</Header>
            <AronaInput
              type="input"
              placeholder="标题"
              value={form.title}
              onChange={(v) => fieldChange("title", v)}
              maxLength={32}
            />
            <Header as="h3">修改正文</Header>
            <AronaInput
              type="textarea"
              placeholder="正文"
              value={form.description}
              onChange={(v) => fieldChange("description", v)}
              maxLength={3000}
            />

            <Header as="h3">修改标签</Header>
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
            <Header as="h3">修改分区</Header>
            <Form.Field
              selection
              control={Dropdown}
              options={IMAGE_CATEGORY}
              placeholder="请选择分区"
              onChange={onSelectChange}
              value={form.category}
            />
            {/* <Button primary></Button> */}
            {errMsg.length > 0 && (
              <Message
                negative
                header="出了点问题…"
                list={errMsg}
              />
            )}
          </Form>
          <div style={{ justifyContent: "space-evenly", display: "flex", margin: "2rem" }}>
            <Button secondary onClick={setClose} disabled={sending} loading={sending} size="large">取消</Button>
            <Button primary onClick={EditImage} disabled={sending} loading={sending} size="large">更改</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditForm;
