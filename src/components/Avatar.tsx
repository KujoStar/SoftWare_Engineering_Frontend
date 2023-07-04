import { Link } from "react-router-dom";
import { Image } from "semantic-ui-react";
import { md5 } from "@utils/mika_kawaii/mika_kawaii";
import { DEFAULT_AVATAR_LINK } from "@data/constants";

interface AvatarProps {
  username: string;
  email: string;
  width?: number;
}

const Avatar = (props: AvatarProps) => {
  const hash = md5(props.email.trim().toLowerCase());

  // TODO: don't hard code this
  let url = `https://gravatar.shinku.life/avatar/${hash}?d=${DEFAULT_AVATAR_LINK}`;

  if (typeof props.width !== "undefined") {
    url = url.concat(`&s=${props.width}`);
  }

  return (
    <div style={{ height: "100%", width: typeof props.width !== "undefined" ? `${props.width}px` : "100%" }}>
      <Link to={`/user/${props.username}`}>
        <Image
          src={url}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </Link>
    </div>
  );
};

export default Avatar;
