import { AppLayout } from "@layouts";
import { useAppState } from "@state";
import { Container, Header } from "semantic-ui-react";
import DynamicList from "./DynamicList";
import { LoginPlz } from "@pages/ErrorPages";

export const Page = () => {

  const { self } = useAppState();
  
  if (self === null) {
    return <LoginPlz/>;
  }

  return <AppLayout>
    <Container style={{
      width: "100%",
      textAlign: "center",
    }}>
      <Header as="h1" style={{ margin: "2rem 0" }}>用户动态</Header>
      <DynamicList self={self}/>
    </Container>
  </AppLayout>;
};

