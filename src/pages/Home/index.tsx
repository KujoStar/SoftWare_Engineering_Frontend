import { Link } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import { useAppState } from "@state";
import { AppLayout } from "@layouts";

export const Page = () => {
  const { self } = useAppState();

  return (
    <AppLayout>
      <Segment style={{ textAlign: "center" }}>
        <img
          src={self === null ? "/BOOM.png" : "/SECODER.png"}
          style={{ width: "100%" }}
        />
      </Segment>
      {self === null && (
        <Segment
          style={{
            padding: "5rem 0",
            textAlign: "center",
          }}
        >
          <Header>A.R.O.N.A</Header>
          <Button as={Link} to="/login" size="mini">Log-in</Button>
          <span>to explore!</span>
        </Segment>
      )}
    </AppLayout>
  );
};
