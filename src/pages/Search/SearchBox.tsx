import { IMAGE_CATEGORY } from "@data/constants";
import { SearchForm, Self } from "@data/interface";
import { useCallback, useEffect, useState } from "react";
import { Button, Dropdown, DropdownProps, Search } from "semantic-ui-react";
import styles from "./styles.module.scss";
import { useSearchHistory } from "@utils/hooks";
import AdvancedSearchForm from "./AdvancedSearchForm";

interface SearchBoxProps {
  self: Self | null;
  form: SearchForm;
  onSearch: (form: SearchForm) => void;
  setEmpty?: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBox = (props: SearchBoxProps) => {

  const [advanced, setAdvanced] = useState(false);
  const [category, setCategory] = useState(typeof props.form.category === "undefined" ? "all" : props.form.category);
  const [form, setForm] = useState(typeof props.form.sortBy !== "undefined" ? props.form : {...props.form, "sortBy": "match"} );

  const onSelectChange = useCallback((_: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    if (typeof data.value !== "string") {
      throw new Error("???");
    }

    setCategory(data.value);
  }, []);

  useEffect(() => {
    if (typeof form.searchFor === "undefined" || form.searchFor.length === 0) {
      return;
    }
    handleSearch();
  }, [form.sortBy]);

  const fieldChange = useCallback((name: string, v: string | undefined | number) => {
    setForm((form) => ({ ...form, [name]: v }));
  }, [setForm]);

  const handleSearch = useCallback(() => {
    if (typeof form.searchFor === "undefined" || form.searchFor.length === 0) {
      return;
    }
    if (typeof props.setEmpty !== "undefined") {
      props.setEmpty(false);
    }
    props.onSearch({
      ...form,
      category: category === "all" ? undefined : category,
    });
  }, [props.onSearch, form, category]);

  const onKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }, [handleSearch]);

  const history = useSearchHistory(form.searchFor ?? "", props.self?.jwt ?? "logged-out");

  const sortButton = useCallback((target: string, content: string) =>
    <Button
      color={ form.sortBy === target ? "red" : "grey"}
      content={content}
      onClick={() => { fieldChange("sortBy", target); }}
    />
  , [form.sortBy, fieldChange]);

  return (
    <>
      <div className={styles.container}>
        <Dropdown
          selection
          direction="left"
          onChange={onSelectChange}
          options={
            [{ key: "-1", text: "综合", value: "all" }]
              .concat(IMAGE_CATEGORY.slice(1))
          }
          defaultValue={category}
          fluid
        />
        <Search
          loading={typeof history !== "undefined" && history.isLoading}
          className={styles.search}
          input={{ icon: "search", iconPosition: "left" }}
          placeholder="搜索你想要的内容..."
          defaultValue={form.searchFor}
          onSearchChange={(e, d) => fieldChange("searchFor", d.value ?? "")}
          onResultSelect={(e, d) => fieldChange("searchFor", d.result.title)}
          onKeyPress={onKeyPress}
          results={
            typeof history === "undefined" ? undefined
              : (
                (typeof history.data === "undefined" && !history.isLoading) ?
                  undefined
                  :
                  history.data?.data.result.map((value) => ({ "title": value.search_for })))
          }
          fluid
        />
        <Button primary content="搜索" direction="right" onClick={handleSearch}/>
      </div>
      <div className={styles.search_form}>
        {sortButton("match",      "综合排序")}
        {sortButton("uploadTime", "由新到旧")}
        {sortButton("likes",      "最多点赞")}
        <Button
          style={{ float: "right", marginRight: "2%" }}
          color={advanced ? "pink": "purple"}
          icon={advanced ? "caret up" :"caret down"}
          content="高级搜索"
          direction="right"
          onClick={() => setAdvanced((now) => !now)}
        />
        {advanced && <AdvancedSearchForm form={form} setForm={setForm}/>}
      </div>

    </>
  );
};

export default SearchBox;
