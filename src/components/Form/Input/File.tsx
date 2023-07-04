import { Button } from "semantic-ui-react";
import { FileInputChange } from "@data/interface";

export interface FileInputProps {
  type: "file";
  name: string;
  onChange: (e: FileInputChange) => void;
}

const FileInput = (props: FileInputProps) => (
  <div>
    <input
      type="file"
      id={props.name}
      style={{ display: "none" }}
      onChange={props.onChange}
    />
    <Button as="label" htmlFor={props.name}>
      本地上传
    </Button>
  </div>
);

export default FileInput;
