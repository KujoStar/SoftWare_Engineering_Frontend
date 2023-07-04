import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Divider, Button, Icon, Segment, Statistic, Grid } from "semantic-ui-react";
import { KeyedMutator } from "swr";
import dayjs from "dayjs";
import { UserDetail } from "@data/interface";
import { useAppState } from "@state";
import { request, isOk, TFetcher } from "@utils/network";
import { useMediaQuery } from "@utils/hooks";
import { Avatar } from "@components";
import styles from "./styles.module.scss";

interface UserSidebarImplProps {
  user: UserDetail;
  mutate: KeyedMutator<TFetcher<UserDetail>>,
  isNarrow?: boolean;
}

const UserSidebarImpl = (props: UserSidebarImplProps) => {
  const smallScreen = useMediaQuery("(min-width: 600px)");

  const navigate = useNavigate();

  const { self } = useAppState();

  const [loading, setLoading] = useState(false);

  const user = props.user;

  const userType = useMemo(() => {
    switch (user.userType) {
    case "user": {
      return "普通用户";
    }
    case "admin": {
      return "管理员";
    }
    case "root": {
      return "超级管理员";
    }
    case "blocked": {
      return "封禁用户";
    }
    }
  }, [user]);

  const registerTime = dayjs.unix(user.registerTime);

  const isSelf = self !== null && self.username === user.username;
  const isFollowed = user.followState % 2 === 1;

  const follow = useCallback(async () => {
    setLoading(true);

    if (self === null) {
      navigate("/login");
      return;
    }

    if (!isFollowed) {
      const resp = await request<null>(`/api/user/${user.username}/follow`, "POST", null, self.jwt);

      if (isOk(resp)) {
        props.mutate();
      } else {
        alert(`关注失败：${resp.data.msg}`);
      }
    } else {
      const resp = await request<null>(`/api/user/${user.username}/unfollow`, "POST", null, self.jwt);

      if (isOk(resp)) {
        props.mutate();
      } else {
        alert(`取消关注失败：${resp.data.msg}`);
      }
    }

    setLoading(false);
  }, [setLoading, self, navigate, isFollowed, user.username, props.mutate]);

  if (!smallScreen || props.isNarrow === true) {
    return (
      <Segment>
        <div style={{ margin: "1rem 0.5rem 2rem 0.5rem" }}>
          <Grid centered>
            <Avatar
              username={user.username}
              email={user.email}
              width={256}
            />
            <div style={{ margin: "0.3rem" }}>
              <div className={styles.labels}>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {user.nickname}
                </div>
                <div style={{ fontSize: "0.9rem", color: "grey" }}>
                  @{user.username}
                </div>
              </div>
              <Divider />
              <div className={styles.tips}>
                <div className={styles.tip}>
                  <Icon name="user" />{userType}
                </div>
                <div className={styles.tip}>
                  <Icon name="mail" />{user.email}
                </div>
                <div className={styles.tip}>
                  <Icon name="time" />{registerTime.format("YYYY-MM-DD HH:mm:ss")}
                </div>
              </div>
              <Divider />
              <div style={{
                display: "flex",
                justifyContent: "space-around",
              }}>
                <Statistic as={Link} to={`/user/${user.username}/following`} size="mini">
                  <Statistic.Value>{user.followingCount}</Statistic.Value>
                  <Statistic.Label>关注</Statistic.Label>
                </Statistic>
                <Statistic as={Link} to={`/user/${user.username}/follower`} size="mini" style={{ marginLeft: 0 }}>
                  <Statistic.Value>{user.followerCount}</Statistic.Value>
                  <Statistic.Label>粉丝</Statistic.Label>
                </Statistic>
              </div>
            </div>
          </Grid>
        </div>
        <div style={{ display: "flex" }}>
          <Button
            primary
            fluid
            loading={loading}
            disabled={loading}
            style={{ padding: "0.8rem 0" }}
            onClick={() => isSelf ? navigate(`/user/${user.username}/edit`) : follow()}
            basic={!isSelf && isFollowed}
          >
            {isSelf ? "设置" : (isFollowed ? "取消关注" : "关注")}
          </Button>
          <Button fluid secondary style={{ padding: "0.8rem 0" }}>私信</Button>
        </div>
        <Divider />

      </Segment>
    );
  }
  return (
    <Segment>
      <Avatar
        username={user.username}
        email={user.email}
        width={256}
      />
      <div className={styles.labels}>
        <div style={{ fontSize: "0.9rem", color: "grey" }}>
          @{user.username}
        </div>
        <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
          {user.nickname}
        </div>
        <div style={{
          marginTop: "1.2rem",
          fontSize: "1.1rem",
          lineBreak: "anywhere",
        }}>
          {user.slogan}
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <Button
          primary
          fluid
          loading={loading}
          disabled={loading}
          style={{ padding: "0.8rem 0" }}
          onClick={() => isSelf ? navigate(`/user/${user.username}/edit`) : follow()}
          basic={!isSelf && isFollowed}
        >
          {isSelf ? "设置" : (isFollowed ? "取消关注" : "关注")}
        </Button>
        <Button
          secondary
          fluid
          style={{ padding: "0.8rem 0" }}
          onClick={() => navigate(`/message${!isSelf ? "?username=" + user.username : ""}`)}
        >
          私信
        </Button>
      </div>
      <Divider />
      <div style={{
        display: "flex",
        justifyContent: "space-around",
      }}>
        <Statistic as={Link} to={`/user/${user.username}/following`} size="mini">
          <Statistic.Value>{user.followingCount}</Statistic.Value>
          <Statistic.Label>关注</Statistic.Label>
        </Statistic>
        <Statistic as={Link} to={`/user/${user.username}/follower`} size="mini" style={{ marginLeft: 0 }}>
          <Statistic.Value>{user.followerCount}</Statistic.Value>
          <Statistic.Label>粉丝</Statistic.Label>
        </Statistic>
      </div>
      <Divider />
      <div className={styles.tips}>
        <div className={styles.tip}>
          <Icon name="user" />{userType}
        </div>
        <div className={styles.tip}>
          <Icon name="mail" />{user.email}
        </div>
        <div className={styles.tip}>
          <Icon name="time" />{smallScreen && "加入于 "}{registerTime.format("YYYY-MM-DD HH:mm:ss")}
        </div>
      </div>
    </Segment >
  );
};

export default UserSidebarImpl;
