import { AronaInput } from "@components/Form";
import { TAG_BANNED_CHAR } from "@data/constants";
import { SearchForm } from "@data/interface";
import { useCallback, useMemo, useState } from "react";
import { Checkbox, Form, Icon, Label, Message } from "semantic-ui-react";

interface AdvancedSearchFormProps {
  form: SearchForm
  setForm: React.Dispatch<React.SetStateAction<SearchForm>>
}

const PARAM_LIST: {name: keyof SearchForm, display:string, placeholder: string}[] = [
  {name: "widthMin",  display: "最小宽度", placeholder: "0"},
  {name: "widthMax",  display: "最大宽度", placeholder: "65536"},
  {name: "heightMin", display: "最小高度", placeholder: "0"},
  {name: "heightMax", display: "最大高度", placeholder: "65536"},
];

const AdvancedSearchForm = (props: AdvancedSearchFormProps) => {
  
  const handleChange = useCallback((name: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const str = event.target.value.replace(/\D/g, "");
    if (str.length === 0) {
      props.setForm({...props.form, [name]: undefined});
      return;
    }
    const val = Math.min(parseFloat(str), 65536);
    props.setForm({...props.form, [name]: val});
  }, [props.setForm, props.form]);

  const valid = (c: string) => (!TAG_BANNED_CHAR.includes(c));

  const basic = useMemo(() => {
    const res = [];
    if ((props.form.widthMin ?? 0) > (props.form.widthMax ?? 65536)) {
      res.push("宽度范围不合法");
    }
    if ((props.form.heightMin ?? 0) > (props.form.heightMax ?? 65536)) {
      res.push("高度范围不合法");
    }
    return res;
  }, [props.form]);

  const [errMsg, setErrMsg] = useState<string[]>(basic);

  const addTag = useCallback((rawTag: string) => {
    if (props.form.tags.length >= 20) {
      setErrMsg(["标签数量过多"]);
      return;
    }
    const tag = rawTag.trim();
    if (props.form.tags.includes(tag)) {
      setErrMsg(["标签已存在"]);
      return;
    }
    props.setForm((form) => ({ ...form, tags: [...form.tags, tag] }));
    setErrMsg([]);
  }, [props.form.tags, props.setForm]);

  const removeTag = useCallback((rawTag: string) => {
    const tag = rawTag.trim();
    props.setForm((form) => ({ ...form, tags: form.tags.filter((t) => t !== tag) }));
    setErrMsg([]);
  }, [props.form.tags, props.setForm]);

  const onCurrentTagConfirm = useCallback((value: string) => {
    const tag = value.trim();
    if (tag.length === 0) {
      return;
    }
    addTag(tag);
  }, [addTag]);

  return <div style={{ margin:"1.2rem"}}>
    <Form>
      <Form.Group widths='equal'>
        {PARAM_LIST.map((value, index) => 
          <Form.Input
            key={index}
            label={value.display}
            value={props.form[value.name]}
            placeholder={value.placeholder}
            onChange={(e)=>handleChange(value.name, e)}
          />)}
      </Form.Group>
      <Form.Group widths='equal'>
        <Form.Input
          label="指定上传者"
          value={props.form.uploader}
          placeholder="Fuyuki"
          onChange={(e)=>{
            const val = e.target.value.split("").filter(valid).join("");
            props.setForm({...props.form, uploader: val.length === 0 ? undefined : val});
          }}
        />
      </Form.Group>
      <Form.Field>
        <Checkbox
          label="使用正则表达式"
          checked={props.form.regexp === 1}
          onClick={() => {
            const now = props.form.regexp ?? 0;
            props.setForm({...props.form, regexp: now === 0 ? 1 : 0});
          }}
        />
      </Form.Field>
      <Form.Field>
        <AronaInput
          type="input"
          placeholder="请添加相关标签，用回车分隔"
          onConfirm={onCurrentTagConfirm}
          maxLength={20}
          banList={TAG_BANNED_CHAR}
        />
      </Form.Field>
    </Form>

    {props.form.tags.length !== 0 && (
      <div style={{ marginBottom: "1rem" }}>
        {props.form.tags.map((v: string, i: number) => (
          <Label key={i} onClick={() => removeTag(v)}>
            <span>{v}</span>
            <Icon name="delete"/>
          </Label>
        ))}
      </div>
    )}
    {
      errMsg.length !== 0 && <Message negative header="参数错误" list={errMsg} ></Message>
    }
  </div>;
};

export default AdvancedSearchForm;
