import { Link, NavLink } from "react-router-dom";
import { Button, Icon, Label, Menu } from "semantic-ui-react";
import { Self } from "@data/interface";
import { useUnreadDynamicCount, useUnreadMessageCount, useUser } from "@utils/hooks";
import { Avatar } from "@components";

interface LoggedInProps {
  me: Self;
  setOpen: (open: boolean) => void;
}

const LoggedIn = (props: LoggedInProps) => {
  const { data, error, isLoading } = useUser(props.me.username);
  const unreadMessageCount = useUnreadMessageCount(props.me.jwt);
  const unreadDynamicCount = useUnreadDynamicCount(props.me.jwt);

  if (typeof data === "undefined") {
    if (isLoading) {
      return (
        <Menu.Item position="right">
          <span>用户信息加载中</span>
        </Menu.Item>
      );
    }

    if (typeof error !== "undefined") {
      console.error(error);
      return (
        <Menu.Item position="right">
          <span>用户信息加载失败</span>
        </Menu.Item>
      );
    }

    throw new Error("unreachable");
  }

  const self = data.data;

  return (
    <>
      <Menu.Item
        position="right"
        className="compact"
        as={NavLink}
        to={"/dynamic/"}
      >
        <div style={{ position: "relative", margin: "0 0.5rem 0 0" }}>
          <Icon className={"bolt"}>
            {typeof unreadDynamicCount.data !== "undefined" && unreadDynamicCount.data.data.count !== 0
              && <Label color="blue" floating position="top right" style={{ fontSize: "0.6rem" }} content={
                unreadDynamicCount.data.data.count > 99 ? "99+" : unreadDynamicCount.data.data.count} circular />
            }
          </Icon>
        </div>
        <span style={{ fontSize: "1.1rem" }}>动态</span>
      </Menu.Item >
      <Menu.Item
        className="compact"
        as={NavLink}
        to={"/history/"}
      >
        <Icon className={"history"} />
        <span style={{ fontSize: "1.1rem" }}>历史</span>
      </Menu.Item>
      <Menu.Item
        className="compact"
        as={NavLink}
        to={"/message/"}
      >
        <div style={{ position: "relative", margin: "0 0.5rem 0 0" }}>
          <Icon className={"envelope"}>
            {typeof unreadMessageCount.data !== "undefined" && unreadMessageCount.data.data.count !== 0
              && <Label color="blue" floating position="top right" style={{ fontSize: "0.6rem" }} content={
                unreadMessageCount.data.data.count > 99 ? "99+" : unreadMessageCount.data.data.count} circular />
            }
          </Icon>
        </div>
        <span style={{ fontSize: "1.1rem" }}>私信</span>
      </Menu.Item>

      <Menu.Item>
        <Avatar
          username={self.username}
          email={self.email}
          width={32}
        />
        <Button
          onClick={() => props.setOpen(true)}
          style={{
            marginLeft: "1rem",
            padding: "0.6rem",
          }}
        >
          登出
        </Button>
      </Menu.Item>
    </>
  );
};

interface RightPartProps {
  me: Self | null;
  setOpen: (open: boolean) => void;
}

const RightPart = (props: RightPartProps) => props.me === null ? (
  <>
    <Menu.Item position="right">
      <Button as={Link} to="/login">登录</Button>
    </Menu.Item>
    <Menu.Item>
      <Button as={Link} to="/register" primary>注册</Button>
    </Menu.Item>
  </>
) : (
  <LoggedIn me={props.me} setOpen={props.setOpen} />
);

export default RightPart;
