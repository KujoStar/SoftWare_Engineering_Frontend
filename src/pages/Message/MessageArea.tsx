import { MessageInfo, Self } from "@data/interface";
import { useMessage, useUser } from "@utils/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Divider, Message, Segment } from "semantic-ui-react";
import MessageList from "./MessageList";
import { isOk, request } from "@utils/network";
import AronaScroll from "./AronaScroll";
import { AronaSender, Loading } from "@components";

interface MessageAreaProps {
  another: string | null;
  self: Self;
  senderPosition: "top" | "bottom";
}

const MessageArea = (props: MessageAreaProps) => {

  const [data, setData] = useState<MessageInfo[]>([]);
  const [page, setPage] = useState(1);
  const [sending, setSending] = useState(false);
  const [errMsg, setErrMsg] = useState<string[]>([]);
  const selfDetailed = useUser(props.self.username);
  const messageList = useMessage(props.another ?? "", page, props.self.jwt);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (typeof messageList.data !== "undefined") {
      const rawData = messageList.data.data.result;
      const loaded = new Set();
      rawData.forEach((value) => loaded.add(value.id));
      const newData = data.filter((value) => !loaded.has(value.id));
      setData([...newData, ...rawData].sort((a, b) => a.time - b.time));
    }
  }, [messageList.data]);

  const total = useMemo(() => {
    if (typeof messageList.data === "undefined") {
      return -1;
    }
    return Math.ceil(messageList.data.data.count / messageList.data.data.perPage);
  }, [messageList.data]);

  const handleSend = useCallback(async () => {

    if (value.length === 0) {
      return;
    }

    if (typeof selfDetailed.data === "undefined") {
      throw Error("unreachable");
    }

    setSending(true);
    interface Resp {
      id: number;
      time: number;
    }

    const resp = await request<Resp>(
      `/api/message/send?username=${props.another}`,
      "POST",
      { content: value },
      props.self.jwt,
    );

    if (!isOk(resp)) {
      setErrMsg([resp.data.msg]);
      setSending(false);
      return;
    }

    const newMessage = {
      id: resp.data.id,
      time: resp.data.time,
      content: value,
      sender: selfDetailed.data.data,
      receiver: {},
    } as MessageInfo;
    setData((data) => [...data, newMessage]);
    setValue("");
    setSending(false);
  }, [value, value.length, selfDetailed.data, props.another, props.self.jwt]);

  const MainDisplay = useMemo(() =>
    <div style={{ height: "90%", marginRight: "-1rem" }}>
      <AronaScroll
        datalength={data.length}
        next={() => setPage((page) => page + 1)}
        hasMore={total === -1 || page < total}
        isLoading={messageList.isLoading}
        endMessage={
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            <b>End of content</b>
          </p>
        }
      >
        {messageList.isLoading && <Loading />}
        <MessageList messages={data} self={props.self} />
      </AronaScroll>
    </div>
  , [total, page, messageList.isLoading, data]);

  if (props.another === null) {
    return (
      <Segment>
        空荡荡
      </Segment>
    );
  }

  if (typeof messageList.error !== "undefined") {
    return (
      <Segment style={{ textAlign: "center" }}>
        <Message negative>{
          messageList.error.msg
        }</Message>
      </Segment>
    );
  }

  const Sender = () =>
    <AronaSender
      value={value}
      setValue={setValue}
      isLoading={sending}
      Send={handleSend}
    />;

  return (
    <div>
      {props.senderPosition === "top" && Sender()}
      <Segment style={{ height: "40rem" }}>
        <div>
          <h2 style={{ textAlign: "center" }}>
            {props.another}
          </h2>
        </div>
        <Divider />
        {MainDisplay}
      </Segment>
      {props.senderPosition === "bottom" && Sender()}
      {errMsg.length > 0 && (
        <Message
          negative
          header="出了点问题…"
          list={errMsg}
        />
      )}
    </div>
  );
};

export default MessageArea;
