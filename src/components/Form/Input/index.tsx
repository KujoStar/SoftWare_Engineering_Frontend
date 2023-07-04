import FileInput, { FileInputProps } from "./File";
import TextInput, { TextInputProps } from "./Text";
import ControlledInput, { ControlledInputProps } from "./Controlled";

type AronaInputProps = TextInputProps | FileInputProps | ControlledInputProps;

const AronaInput = (props: AronaInputProps) => {
  if (props.type === "file") {
    return <FileInput {...props} />;
  }

  if (props.type === "controlled") {
    return <ControlledInput {...props} />;
  }

  return <TextInput {...props} />;
};

export default AronaInput;
