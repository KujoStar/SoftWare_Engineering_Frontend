import { useMemo, useState } from "react";
import { Header, Container } from "semantic-ui-react";
import { useAppState } from "@state";
import { AppLayout } from "@layouts";
import { LoginPlz } from "@pages/ErrorPages";
import ImageSelect from "./ImageSelect";
import InfoForm from "./InfoForm";

export interface UploadProps {
  file?: File;
  atUpload?: boolean;
}
export const Upload = (props: UploadProps) => {
  const { self } = useAppState();

  const [atUploadPage, setAtUploadPage] = useState<boolean>(props.atUpload === undefined ? true : props.atUpload);
  const [file, setFile] = useState<File | null>(props.file === undefined ? null : props.file);

  const imageUrl = useMemo(() => {
    if (file === null) {
      return null;
    }

    return URL.createObjectURL(file);
  }, [file]);

  if (self === null) {
    return <LoginPlz />;
  }

  return (
    <AppLayout>
      <Container style={{
        width: "1000px",
        textAlign: "center",
      }}>
        <Header as="h1" style={{ margin: "2rem 0" }}>上传图片</Header>
        {atUploadPage ? (
          <ImageSelect
            imageUrl={imageUrl}
            setFile={setFile}
            nextPage={() => setAtUploadPage(false)}
          />
        ) : (
          <InfoForm
            self={self}
            file={file}
            imageUrl={imageUrl}
            prevPage={() => setAtUploadPage(true)}
          />
        )}
      </Container>
    </AppLayout>
  );
};

export const Page = () => <Upload />;
