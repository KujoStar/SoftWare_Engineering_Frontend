import { useCallback } from "react";
import { InputChange } from "@data/interface";

export interface ControlledInputProps {
  type: "controlled";
  icon?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  maxLength?: number;
  onConfirm?: (e: string) => void;
  banList?: string;
  ctrlEnter?: boolean;
  isloading?: boolean;
}

const ControlledInput = (props: ControlledInputProps) => {

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

    props.setValue(v);

    if (typeof props.setValue !== "undefined") {
      props.setValue(v);
    }
  }, [props.maxLength, props.setValue, props.setValue, props.banList]);

  const onKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (typeof props.onConfirm === "undefined") {
      return;
    }
    console.log("get key change");
    if (e.shiftKey && e.key === "Enter") {
      console.log("get key fuck");
      props.onConfirm(props.value);
    }
  }, [props.onConfirm]);

  return (
    <div style={{ position: "relative", marginBottom:"1rem"}}>
      <textarea
        style={{ resize:"none"}}
        placeholder={props.placeholder}
        value={props.value}
        onKeyDown={onKeyPress}
        onChange={onChange}
      />
      {props.maxLength && (
        <span style={{
          position: "absolute",
          right: "0.7rem",
          bottom: "0.7rem",
        }}>
          {`${props.value.length}/${props.maxLength}`}
        </span>
      )}
    </div>
  );
};

export default ControlledInput;
