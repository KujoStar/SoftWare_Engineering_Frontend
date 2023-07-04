import { useState } from "react";
import { Link, redirect } from "react-router-dom";
import { Button, Container, Header, Modal, Segment } from "semantic-ui-react";
import { Self } from "@data/interface";
import { AppLayout } from "@layouts";
import PreregisterForm from "./PreregisterForm";
import RegisterForm from "./RegisterForm";

export const loader = (self: Self | null) => {
  if (self !== null) {
    return redirect("/");
  }

  return null;
};

export const Page = () => {
  const [salt, setSalt] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <AppLayout>
      <Container style={{
        width: "450px",
        textAlign: "center",
      }}>
        <Header as="h1" style={{ margin: "2rem 0" }}>注个册先。</Header>
        <Segment>
          {salt === "" ? (
            <PreregisterForm setSalt={setSalt} />
          ) : (
            <RegisterForm salt={salt} setModalOpen={setModalOpen} />
          )}
        </Segment>
        <Segment color="yellow">
          <span>已有账号？</span>
          <Link to="/login">登录</Link>
        </Segment>
      </Container>
      <Modal
        size="mini"
        dimmer="blurring"
        open={modalOpen}
        closeOnDimmerClick={false}
        onClose={() => setModalOpen(false)}
      >
        <Modal.Header>注册成功！</Modal.Header>
        <Modal.Content>现在去登录？</Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setModalOpen(false)}>再等等</Button>
          <Button as={Link} to="/login" primary>去登录！</Button>
        </Modal.Actions>
      </Modal>
    </AppLayout>
  );
};
