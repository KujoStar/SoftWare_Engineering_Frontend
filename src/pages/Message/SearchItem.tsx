import { MessageInfo, Self } from "@data/interface";
import { Divider, Image } from "semantic-ui-react";
import { getAnother, getAvatar } from "./utils";
import styles from "./styles.module.scss";
import dayjs from "dayjs";

interface SearchItemProps {
  message: MessageInfo;
  self: Self;
  another: string;
  setAnother: React.Dispatch<React.SetStateAction<string | null>>;
}

const SearchItem = (props: SearchItemProps) => {
  const message = props.message;
  const content = message.content;
  const another = getAnother(message, props.self);

  const handleClick = () => {
    if (props.another !== another.username) {
      props.setAnother(another.username);
    }
  };

  return (
    <>
      <div
        className={styles.searchItem}
        onClick={handleClick}
      >
        <Image
          src={getAvatar(another.email)} circular
          style={{ width: "40px", height: "40px", objectFit: "contain" }}
        />
        <div style={{ marginLeft: "0.8rem", width: "80%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width:"100%" }}>
            <h3 style={{ marginBottom: "0" }}>
              {another.nickname.length === 0 ? another.username : another.nickname}
            </h3>
            <div>
              {dayjs.unix(message.time).format("MM-DD")}
            </div>
          </div>
          <div style={{
            whiteSpace: "nowrap",
            maxWidth: "12rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {content}
          </div>
        </div>
      </div>
      <Divider style={{ marginTop:"0.4rem", marginBottom:"0.4rem" }}/>
    </>
  );
};

export default SearchItem;
