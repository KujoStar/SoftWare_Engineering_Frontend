import { Link } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import { AppLayout } from "@layouts";

const NoUser = () => (
  <AppLayout>
    <Segment style={{ textAlign: "center" }}>
      <Header as="h1">用户不存在 TAT</Header>
      <Button as={Link} to="/" style={{ width: "50%" }} primary>回到主页</Button>
    </Segment>
  </AppLayout>
);

export default NoUser;
