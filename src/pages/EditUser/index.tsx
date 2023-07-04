import { useCallback, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { preload } from "swr";
import { Button, Header, Segment, Container, Form, Input, Dimmer, Loader, TextArea, Message } from "semantic-ui-react";
import { InputChange } from "@data/interface";
import { useAppState } from "@state";
import { fetcher, isOk, request } from "@utils/network";
import { useUser } from "@utils/hooks";
import { AppLayout } from "@layouts";
import { LoginPlz, NoUser } from "@pages/ErrorPages";

export const loader = ({ params }: { params: { username?: string; } }) => {
  const { username } = params;

  if (typeof username === "undefined") {
    throw new Error("No username provided");
  }

  preload(`/api/user/${username}`, fetcher);

  return username;
};

export const Page = () => {
  const navigate = useNavigate();

  const { self } = useAppState();

  const username = useLoaderData() as string;
  const { data, error, isLoading, mutate } = useUser(username);

  const [form, setForm] = useState({
    nickname: "",
    slogan: "",
  });

  const [errMsg, setErrMsg] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (typeof data === "undefined") {
      return;
    }

    setForm({
      nickname: data.data.nickname,
      slogan: data.data.slogan,
    });
  }, [data]);

  const fieldChange = useCallback((name: string, event: InputChange) => {
    setForm({ ...form, [name]: event.target.value });
    setErrMsg([]);
  }, [form]);

  const checkForm = useCallback((newNickname: string, newSlogan: string) => {
    const res = [];

    if (newNickname.length > 15) {
      res.push("昵称的长度不能超过 15");
    }

    if (newSlogan.length > 30) {
      res.push("个性签名的长度不能超过 30");
    }

    return res;
  }, []);

  const editProfile = useCallback(async () => {
    setSending(true);

    const newNickname = form.nickname.trim();
    const newSlogan = form.slogan.trim();

    const formMsg = checkForm(newNickname, newSlogan);

    if (formMsg.length > 0) {
      setErrMsg(formMsg);
      setSending(false);
      return;
    }

    if (self === null) {
      throw new Error("unreachable");
    }

    const resp = await request<null>(
      `/api/user/${username}`,
      "PUT",
      { nickname: newNickname, slogan: newSlogan },
      self.jwt,
    );

    if (!isOk(resp)) {
      setErrMsg([resp.data.msg]);
      setSending(false);
      return;
    }

    mutate();
    navigate(`/user/${username}`);
  }, [form]);

  if (typeof data === "undefined") {
    if (isLoading) {
      return (
        <AppLayout>
          <Segment style={{ height: "10rem" }}>
            <Dimmer active>
              <Loader content="加载中，请稍后…" />
            </Dimmer>
          </Segment>
        </AppLayout>
      );
    }

    if (typeof error !== "undefined") {
      console.error(error);
      return <NoUser />;
    }

    throw new Error("unreachable");
  }

  if (self === null) {
    return <LoginPlz />;
  }

  const user = data.data;

  return (
    <AppLayout>
      <Container style={{
        width: "600px",
        textAlign: "center",
      }}>
        <Header as="h1" style={{ margin: "2rem 0" }}>修改用户信息</Header>
        <Segment>
          <Form style={{ textAlign: "left" }}>
            <Form.Field
              label="用户名"
              control={Input}
              placeholder="用户名" // this will never be displayed :)
              value={user.username}
            />
            <Form.Field
              label="昵称"
              control={Input}
              placeholder="昵称"
              onChange={(e: InputChange) => fieldChange("nickname", e)}
              value={form.nickname}
            />
            <Form.Field
              label="个性签名"
              control={TextArea}
              placeholder="你所热爱的，便是你的生活"
              onChange={(e: InputChange) => fieldChange("slogan", e)}
              value={form.slogan}
            />
            <Form.Group widths="equal">
              <Form.Field
                primary
                fluid
                control={Button}
                onClick={editProfile}
                loading={sending}
                disabled={sending}
              >
                保存
              </Form.Field>
              <Form.Field
                fluid
                control={Button}
                onClick={() => navigate(-1)}
              >
                取消
              </Form.Field>
            </Form.Group>
            {errMsg.length > 0 && (
              <Message
                negative
                header="出了点问题…"
                list={errMsg}
              />
            )}
          </Form>
        </Segment>
      </Container>
    </AppLayout >
  );
};
