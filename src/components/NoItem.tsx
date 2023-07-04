import { Header, Icon, Segment } from "semantic-ui-react";

const NoItem = () => (
  <Segment style={{ textAlign: "center" }}><div style={{ margin: "2rem 0 2rem 0" }}>
    <Header icon>
      <Icon name="help circle" />
      <p style={{ margin: "5% 0 0 0" }}>这里似乎还没有内容，先去别处转转？</p>
    </Header></div>
  </Segment>
);

export default NoItem;
