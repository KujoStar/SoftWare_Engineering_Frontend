import { Dimmer, Loader, Segment } from "semantic-ui-react";
import styles from "./styles.module.scss";

interface LoadingProps {
  height?: string;
}

const Loading = (props: LoadingProps) => (
  <Segment style={{ height: `${props.height ? props.height : "10rem"}` }} className={styles.loading} >
    <Dimmer active>
      <Loader content="加载中，请稍后…" />
    </Dimmer>
  </Segment >
);

export default Loading;
