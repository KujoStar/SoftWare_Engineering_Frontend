import { Card } from "semantic-ui-react";
import { NoItem } from "@components";
import UserCard from "./UserCard";

interface UserListProps {
  usernames: string[];
}

const UserList = (props: UserListProps) => {
  if (props.usernames.length === 0) {
    return <NoItem />;
  }
  // alert(props.usernames[0]);
  return (
    <Card.Group>
      {props.usernames.map((_) => (
        <UserCard key={_} username={_} />
      ))}
    </Card.Group>
  );
};

export default UserList;
