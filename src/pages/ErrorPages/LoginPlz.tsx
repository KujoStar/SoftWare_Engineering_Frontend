import { Link } from "react-router-dom";
import { Segment, Header, Button } from "semantic-ui-react";
import { AppLayout } from "@layouts";

const LoginPlz = () => (
  <AppLayout>
    <Segment color="red">
      <Header>Error occurred!</Header>
      <div>Seems you should login before doing this :(</div>
      <Button
        inverted
        as={Link}
        to="/login"
        color="red"
        size="mini"
        style={{ marginTop: "1rem" }}
      >
        Go to Log-in
      </Button>
    </Segment>
  </AppLayout>
);

export default LoginPlz;
