import { useCallback, useEffect, useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { Button, Container, Form, Header, Input, Message, Segment } from "semantic-ui-react";
import { InputChange, Self } from "@data/interface";
import { EMAIL_REG } from "@data/constants";
import { useAppState } from "@state";
import { hashPasswd, initWasm } from "@utils/password";
import { isOk, request } from "@utils/network";
import { AppLayout } from "@layouts";

export const loader = (self: Self | null) => {
  if (self !== null) {
    return redirect("/");
  }

  return null;
};

export const Page = () => {
  const navigate = useNavigate();
  const { setSelf } = useAppState();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errMsg, setErrMsg] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  const fieldChange = useCallback((name: string, event: InputChange) => {
    setForm({ ...form, [name]: event.target.value });
    setErrMsg([]);
  }, [form]);

  useEffect(initWasm, []);

  const checkForm = useCallback((username: string, password: string) => {
    const res = [];

    if (username.length < 4 || username.length > 15) {
      if (!EMAIL_REG.test(username)) {
        res.push("用户名长度需要在 4 到 15 之间");
      }
    }

    if (password.length < 6 || password.length > 20) {
      res.push("密码长度需要在 6 到 20 之间");
    }

    return res;
  }, []);

  const onLogin = useCallback(async () => {
    setSending(true);

    const username = form.username.trim();
    const password = form.password.trim();

    const formMsg = checkForm(username, password);

    if (formMsg.length > 0) {
      setErrMsg(formMsg);
      setSending(false);
      return;
    }

    interface PreloginResp {
      salt: string;
    }

    const resp = await request<PreloginResp>("/api/prelogin", "POST", { username });

    if (!isOk(resp)) {
      setErrMsg([resp.data.msg]);
      setSending(false);
      return;
    }

    const salt = resp.data.salt;

    const hashed = hashPasswd(password, salt);

    type LoginResp = Self;

    const loginResp = await request<LoginResp>(
      "/api/login",
      "POST",
      { username, password: hashed },
    );

    if (!isOk(loginResp)) {
      setErrMsg([loginResp.data.msg]);
      setSending(false);
      return;
    }

    setSelf(loginResp.data);
    navigate("/");
  }, [form]);

  return (
    <AppLayout>
      <Container style={{
        width: "450px",
        textAlign: "center",
      }}>
        <Header as="h1" style={{ margin: "2rem 0" }}>登个录先。</Header>
        <Segment>
          <Form style={{ textAlign: "left" }}>
            <Form.Field
              control={Input}
              icon="user"
              iconPosition="left"
              placeholder="用户名"
              onChange={(e: InputChange) => fieldChange("username", e)}
            />
            <Form.Field
              control={Input}
              icon="lock"
              iconPosition="left"
              placeholder="密码"
              type="password"
              onChange={(e: InputChange) => fieldChange("password", e)}
            />
            <Form.Field
              primary
              control={Button}
              style={{ width: "100%" }}
              onClick={onLogin}
              loading={sending}
              disabled={sending}
            >
              登录
            </Form.Field>
            {errMsg.length > 0 && (
              <Message
                negative
                header="出了点问题…"
                list={errMsg}
              />
            )}
          </Form>
        </Segment>
        <Segment color="yellow">
          <span>新用户？</span>
          <Link to="/register">注册</Link>
        </Segment>
      </Container>
    </AppLayout>
  );
};
