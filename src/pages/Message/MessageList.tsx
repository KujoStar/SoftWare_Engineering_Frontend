import { MessageInfo, Self } from "@data/interface";
import { Image, Segment } from "semantic-ui-react";
import dayjs from "dayjs";
import { md5 } from "@utils/mika_kawaii/mika_kawaii";
import { Link } from "react-router-dom";
import { DEFAULT_AVATAR_LINK } from "@data/constants";
import { AronaMarkdown } from "@components";

interface SingleProps {
  message: MessageInfo;
  position: "left" | "right";
}

const SingleMessage = (props: SingleProps) => {
  const message = props.message;
  const sender = message.sender;
  const hash = md5(sender.email.trim().toLowerCase());
  const url = `https://gravatar.shinku.life/avatar/${hash}?d=${DEFAULT_AVATAR_LINK}`;
  const Avatar =
    <div>
      <Image
        as={Link} to={`/user/${sender.username}`} src={url}
        style={{ width: "40px", height: "40px", objectFit: "contain" }}
      />
    </div>;

  return (
    <div style={{ marginBottom: "1rem", marginRight: "0.3rem", display: "flex" }}>
      {props.position === "left" && Avatar}
      <div style={{ marginLeft: "0.7rem", marginRight: "0.7rem", width: "93%", textAlign: props.position }}>
        <div style={{ wordWrap: "break-word", overflowWrap: "break-word", maxWidth: "80%", textAlign: "left", float: props.position }} >
          <Segment>
            <AronaMarkdown content={message.content} />
          </Segment>
          <div style={{display:"flex" }}>

          </div>
          <div style={{ textAlign: props.position, marginTop: "-0.8rem", color: "grey" }}>
            <span style={{ marginRight:"0.5rem" }}>
              {props.position === "right" ?message.is_read ? "已读" : "未读" : ""}
            </span>
            {dayjs.unix(message.time).format("HH:mm:ss")}
          </div>
        </div>
      </div>
      {props.position === "right" && Avatar}
    </div>
  );
};

interface MessageListProps {
  messages: MessageInfo[];
  self: Self;
}

const MessageList = (props: MessageListProps) => {

  const current = dayjs();

  const showTime = (time: dayjs.Dayjs) => {
    const diffInDays = current.startOf("day").diff(time.startOf("day"), "day");
    const timeText =
      diffInDays === 0 ? "今天" :
        diffInDays === 1 ? "昨天" :
          diffInDays < 7 ? `${diffInDays} 天前` :
            time.format("YY-MM-DD");
    return (
      <div style={{ textAlign: "center", margin: "0.5rem 0 0.5rem 0" }}>
        <h5>{timeText}</h5>
      </div>
    );
  };

  return (
    <div style={{ marginTop: "1rem", width: "100%" }}>
      {props.messages.map((message, index, array) => {
        const head = () => {
          const time = dayjs.unix(message.time);
          if (index === 0 || dayjs.unix(array[index - 1].time).day() !== time.day()) {
            return showTime(time);
          }
        };
        return (
          <div key={message.id}>
            {head()}
            <SingleMessage
              message={message}
              position={message.sender.username === props.self.username ? "right" : "left"}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
