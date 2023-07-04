import { AppLayout } from "@layouts";
import { useAppState } from "@state";
import { Container, Header } from "semantic-ui-react";
import HistoryList from "./HistoryList";
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
      <Header as="h1" style={{ margin: "2rem 0" }}>浏览历史</Header>
      <HistoryList self={self}/>
    </Container>
  </AppLayout>;
};

