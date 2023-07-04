import { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { FormErr, InputChange } from "@data/interface";
import { hashPasswd, initWasm } from "@utils/password";
import { isOk, request } from "@utils/network";

interface RegisterFormProps {
  salt: string;
  setModalOpen: (modalOpen: boolean) => void;
}

const RegisterForm = (props: RegisterFormProps) => {
  const [form, setForm] = useState({
    password: "",
    password2: "",
    code: "",
  });

  const [errMsg, setErrMsg] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [passwd2Err, setPasswd2Err] = useState<FormErr>();

  const fieldChange = useCallback((name: string, event: InputChange) => {
    setForm((form) => ({ ...form, [name]: event.target.value }));
    setErrMsg([]);
  }, [setForm, setErrMsg]);

  useEffect(initWasm, []);

  useEffect(() => {
    if (form.password !== form.password2) {
      setPasswd2Err({
        content: "两次密码不一致！",
        pointing: "below",
      });
    } else {
      setPasswd2Err(undefined);
    }
  }, [form, setPasswd2Err]);

  const checkForm = useCallback(() => {
    const res = [];

    const password = form.password.trim();
    if (password.length < 6 || password.length > 20) {
      res.push("密码长度需要在 6 到 20 之间");
    }

    const passwdRegs = [
      {
        name: "数字",
        reg: /\d/,
      },
      {
        name: "小写英文字母",
        reg: /[a-z]/,
      },
      {
        name: "大写英文字母",
        reg: /[A-Z]/,
      },
    ];

    passwdRegs.forEach((item) => {
      if (!item.reg.test(password)) {
        res.push(`密码需要包含${item.name}`);
      }
    });

    if (form.password2.trim() !== password) {
      res.push("两次密码不一致");
    }

    return res;
  }, [form]);

  const onRegister = useCallback(async () => {
    setSending(true);
    const formMsg = checkForm();

    if (formMsg.length > 0) {
      setErrMsg(formMsg);
      setSending(false);
      return;
    }

    const hashed = hashPasswd(form.password.trim(), props.salt);

    const registerResp = await request<null>(
      "/api/register",
      "POST",
      { password: hashed, salt: props.salt, code: form.code.trim() },
    );

    if (!isOk(registerResp)) {
      setErrMsg([registerResp.data.msg]);
      setSending(false);
      return;
    }

    setSending(false);
    props.setModalOpen(true);
  }, [checkForm, form, setSending, setErrMsg, props]);

  return (
    <Form style={{ textAlign: "left" }}>
      <Form.Field
        control={Input}
        icon="code"
        iconPosition="left"
        placeholder="验证码"
        onChange={(e: InputChange) => fieldChange("code", e)}
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
        control={Input}
        icon="lock"
        iconPosition="left"
        placeholder="重复密码"
        type="password"
        onChange={(e: InputChange) => fieldChange("password2", e)}
        error={passwd2Err}
      />
      <Form.Field
        primary
        control={Button}
        style={{ width: "100%" }}
        onClick={onRegister}
        loading={sending}
        disabled={sending}
      >
        注册
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

export default RegisterForm;
