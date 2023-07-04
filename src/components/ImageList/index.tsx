import { Card } from "semantic-ui-react";
import { ImageInfo } from "@data/interface";
import { NoItem } from "@components";
import ImageCard from "./ImageCard";

interface ImageListProps {
  images: ImageInfo[];
  showUploader?: boolean;
}

const ImageList = (props: ImageListProps) => {
  if (props.images.length === 0) {
    return <NoItem />;
  }

  return (
    <Card.Group style={{ margin: "0rem" }}>
      {props.images.map((image) => (
        <ImageCard key={image.id} image={image} showUploader={props.showUploader} />
      ))}
    </Card.Group>
  );
};

export default ImageList;
