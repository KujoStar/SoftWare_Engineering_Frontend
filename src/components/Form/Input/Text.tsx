import { useCallback, useState } from "react";
import { Form, Input, TextArea } from "semantic-ui-react";
import { InputChange } from "@data/interface";

export interface TextInputProps {
  type: "input" | "textarea";
  icon?: string;
  placeholder?: string;
  onChange?: (newValue: string) => void;
  maxLength?: number;
  onConfirm?: (newValue: string) => void;
  banList?: string;
  fluid?: boolean;
  value?: string;
  size?: string;
}

const TextInput = (props: TextInputProps) => {
  const [value, setValue] = useState(props.value === undefined ? "" : props.value);

  const onChange = useCallback((e: InputChange) => {
    let v = e.target.value;

    if (props.maxLength && v.length > props.maxLength) {
      v = v.slice(0, props.maxLength);
    }

    const BANLIST = props.banList;

    if (typeof BANLIST !== "undefined") {
      const valid = (c: string) => (!BANLIST.includes(c));
      v = v.split("").filter(valid).join("");
    }

    setValue(v);

    if (typeof props.onChange !== "undefined") {
      props.onChange(v);
    }
  }, [props.maxLength, setValue, props.onChange, props.banList]);

  const onKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (typeof props.onConfirm === "undefined") {
      return;
    }

    if (e.key !== "Enter") {
      return;
    }

    props.onConfirm(value);
    setValue("");
  }, [props.onConfirm, value, setValue]);

  return (
    <div style={{ position: "relative" }}>
      <Form.Field
        control={props.type === "input" ? Input : TextArea}
        icon={props.icon}
        iconPosition={props.icon && "left"}
        placeholder={props.placeholder}
        value={value}
        onKeyPress={onKeyPress}
        onChange={onChange}
        style={{ minHeight: props.type === "textarea" && "10rem" }}
        type={props.type}
        fluid={props.fluid}
        size={props.size}
      />
      {props.maxLength && (
        <span style={{
          position: "absolute",
          right: "0.7rem",
          bottom: "0.7rem",
        }}>
          {`${value.length}/${props.maxLength}`}
        </span>
      )}
    </div>
  );
};

export default TextInput;
