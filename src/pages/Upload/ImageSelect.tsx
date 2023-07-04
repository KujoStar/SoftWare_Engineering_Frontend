import { useCallback, useState } from "react";
import { Button, Image, Segment } from "semantic-ui-react";
import { FileInputChange } from "@data/interface";
import { AronaInput } from "@components/Form";

interface ImageSelectProps {
  imageUrl: string | null;
  setFile: (file: File) => void;
  nextPage: () => void;
}

const ImageSelect = ({ imageUrl, setFile, nextPage }: ImageSelectProps) => {
  const [fileValid, setFileValid] = useState(false);

  const onSelectImage = useCallback((e: FileInputChange) => {
    const file = e.target.files?.[0];

    if (typeof file !== "undefined") {
      setFile(file);
    }
  }, [setFile]);

  const onImageLoad = useCallback(() => {
    setFileValid(true);
    // TODO: fetch recommended tags
  }, [setFileValid]);

  return (
    <Segment textAlign="center">
      <div style={{
        display: "flex",
        justifyContent: "space-evenly",
      }}>
        <AronaInput
          type="file"
          name="image"
          onChange={onSelectImage}
        />
        {fileValid && (
          <Button onClick={nextPage} primary>
            下一步
          </Button>
        )}
      </div>
      {imageUrl && (
        <Image
          fluid
          src={imageUrl}
          alt="preview"
          style={{ marginTop: "1rem" }}
          onLoad={onImageLoad}
          onError={() => setFileValid(false)}
        />
      )}
    </Segment>
  );
};

export default ImageSelect;
