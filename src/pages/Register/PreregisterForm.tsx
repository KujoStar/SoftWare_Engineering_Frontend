import { useCallback, useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { InputChange } from "@data/interface";
import { EMAIL_REG } from "@data/constants";
import { isOk, request } from "@utils/network";

interface PreregisterFormProps {
  setSalt: (salt: string) => void;
}

const PreregisterForm = (props: PreregisterFormProps) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
  });

  const [errMsg, setErrMsg] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  const fieldChange = useCallback((name: string, event: InputChange) => {
    setForm((form) => ({ ...form, [name]: event.target.value }));
    setErrMsg([]);
  }, [setForm, setErrMsg]);

  const checkForm = useCallback(() => {
    const res = [];

    const username = form.username.trim();
    if (username.length < 4 || username.length > 15) {
      res.push("用户名长度需要在 4 到 15 之间");
    }

    const email = form.email.trim();
    if (!EMAIL_REG.test(email)) {
      res.push("邮箱格式不正确");
    }

    return res;
  }, [form]);

  const onPreregister = useCallback(async () => {
    setSending(true);
    const formMsg = checkForm();

    if (formMsg.length > 0) {
      setErrMsg(formMsg);
      setSending(false);
      return;
    }

    interface PreregisterResp {
      salt: string;
    }

    const resp = await request<PreregisterResp>(
      "/api/preregister",
      "POST",
      { username: form.username.trim(), email: form.email.trim() },
    );

    if (!isOk(resp)) {
      setErrMsg([resp.data.msg]);
      setSending(false);
      return;
    }

    const salt = resp.data.salt;

    setSending(false);
    props.setSalt(salt);
  }, [checkForm, form, setSending, setErrMsg, props]);

  return (
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
        icon="mail"
        iconPosition="left"
        placeholder="邮箱"
        onChange={(e: InputChange) => fieldChange("email", e)}
      />
      <Form.Field
        primary
        control={Button}
        style={{ width: "100%" }}
        onClick={onPreregister}
        loading={sending}
        disabled={sending}
      >
        下一步
      </Form.Field>
      {errMsg.length > 0 && (
        <Message
          negative
          header="出了点问题…"
          list={errMsg}
        />
      )}
    </Form>
  );
};

export default PreregisterForm;
