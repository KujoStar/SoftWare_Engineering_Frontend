import { Button, Tab } from "semantic-ui-react";
import { useCallback } from "react";
import { AronaMarkdown } from "@components";
import styles from "./styles.module.scss";

interface AronaSenderProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>
  isLoading: boolean;
  Send?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  Hint?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  secondary?: boolean;
}

const AronaSender = (props: AronaSenderProps) => {
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (typeof props.Send === "undefined") {
      return;
    }
    if (e.shiftKey && e.key === "Enter") {
      props.Send();
    }
  }, [props.Send]);

  const panes = [
    {
      key: "1",
      menuItem: "编辑",
      render: () =>
        <Tab.Pane>
          <textarea
            className={styles.AronaSenderTextArea}
            placeholder={props.placeholder ?? "支持输入 Markdown 哦"}
            value={props.value}
            onKeyDown={props.onKeyDown ?? onKeyDown}
            onChange={(e) => props.setValue(e.target.value)}
          />
        </Tab.Pane>,
    },
    {
      key: "2",
      menuItem: "预览",
      render: () =>
        <Tab.Pane>
          <div style={{ overflow: "auto", height: "8.9rem" }} >
            <AronaMarkdown content={props.value} />
          </div>
        </Tab.Pane>,
    },
  ];
  return <div style={props.style}>
    <Tab
      menu={props.secondary ? { vertical: true, tabular: true } : undefined}
      className={props.secondary ? styles.sencondary : undefined}
      grid={props.secondary ? { paneWidth: 14, tabWidth: 2 } : undefined}
      panes={panes}
    />
    <div style={{
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "1rem",
      alignItems: "center",
    }}>
      <div style={{ color: "grey", marginRight: "1rem" }}>
        {props.Hint ?? "Shift+Enter 快捷发送"}
      </div>
      <Button
        primary
        loading={props.isLoading}
        onClick={props.Send}
        style={{ marginBottom: "1rem" }}
      >
        发送
      </Button>
    </div>
  </div>;
};

export default AronaSender;
