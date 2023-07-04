import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Image, Loader } from "semantic-ui-react";
import { useAppState } from "@state";
import { request, isOk } from "@utils/network";
import { Avatar } from "@components";
import { useUserDetail } from "@utils/hooks";

interface UserCardProps {
  username: string;
}

const UserCard = (props: UserCardProps) => {
  const navigate = useNavigate();
  const { self } = useAppState();
  const rawUser = useUserDetail(props.username, self?.jwt);
  const [loading, setLoading] = useState<boolean>(false);

  const follow = useCallback(async () => {
    if (rawUser.data === undefined) { return; }
    const user = rawUser.data.data;
    const isFollowed = user.followState % 2 === 1;
    const mutate = rawUser.mutate;
    setLoading(true);

    if (self === null) {
      navigate("/login");
      return;
    }

    if (!isFollowed) {
      const resp = await request<null>(`/api/user/${user.username}/follow`, "POST", null, self.jwt);

      if (isOk(resp)) {
        mutate();
      } else {
        alert(`关注失败：${resp.data.msg}`);
      }
    } else {
      const resp = await request<null>(`/api/user/${user.username}/unfollow`, "POST", null, self.jwt);

      if (isOk(resp)) {
        mutate();
      } else {
        alert(`取消关注失败：${resp.data.msg}`);
      }
    }

    setLoading(false);
  }, [setLoading, self, navigate, rawUser]);

  return (
    typeof rawUser.data === "undefined" ?
      (
        <Card>
          <Card.Content textAlign="left">
            {rawUser.isLoading ? <Loader /> : "用户加载失败"}
          </Card.Content>
        </Card>
      )
      :
      <Card>
        <Card.Content textAlign="left">
          <Button
            primary
            floated="right"
            basic={rawUser.data.data.followState % 2 === 1}
            onClick={follow}
            loading={loading}
            disabled={loading || rawUser.data.data.followState === -1}
            icon={rawUser.data.data.followState % 2 === 1 ? "minus" : "plus"}
          />
          <Image floated="left">
            <Avatar username={rawUser.data.data.username} email={rawUser.data.data.email} width={32} />
          </Image>
          <Card.Header>{rawUser.data.data.nickname}</Card.Header>
          <Card.Meta>{`@${rawUser.data.data.username}`}</Card.Meta>
          <Card.Description>{rawUser.data.data.slogan}</Card.Description>
        </Card.Content>
      </Card>
  );
};

export default UserCard;
