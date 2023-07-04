import { useNavigate } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import { AppLayout } from "@layouts";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <Segment color="red">
        <Header>404 Not Found</Header>
        <div>Seems like there is nothing in here. :(</div>
        <Button
          inverted
          color="red"
          size="mini"
          onClick={() => navigate(-1)}
          style={{ marginTop: "1rem" }}
        >
          Go back
        </Button>
      </Segment>
    </AppLayout>
  );
};

export default NotFound;
