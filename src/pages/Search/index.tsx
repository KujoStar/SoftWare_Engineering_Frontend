import { RawSearchForm, SearchForm } from "@data/interface";
import { AppLayout } from "@layouts";
import { useSearchParams } from "react-router-dom";
import { Header, Icon } from "semantic-ui-react";
import { useAppState } from "@state";
import SearchBox from "./SearchBox";
import SearchList from "./SearchList";
import { SEARCH_PARAMETERS } from "@data/constants";
import { useMemo, useState } from "react";

export const getSearchUrl = (form: SearchForm) => {
  const searchParams = new URLSearchParams();
  Object.entries(form).forEach(([kei, value]) => {
    if (typeof value !== "undefined") {
      if (kei === "tags") {
        const tags = value as string[];
        tags.forEach((tag) => {
          searchParams.append(kei, encodeURIComponent(tag));
        });
      }
      else if (kei !== "category" || value !== "all") {
        searchParams.set(kei, encodeURIComponent(value));
      }
    }
  });
  return searchParams.toString();
};

export const Page = () => {
  const { self } = useAppState();

  const [searchParams] = useSearchParams();

  const initialForm = useMemo(() => SEARCH_PARAMETERS.reduce((form, paramName) => {
    const queryValue = searchParams.get(paramName);
    return { ...form, [paramName]: queryValue ?? undefined };
  }, {tags: searchParams.getAll("tag")} as RawSearchForm), [searchParams]);

  const [form, setForm] = useState(initialForm);
  const [empty, setEmpty] = useState(
    typeof form.searchFor === "undefined" || form.searchFor.length === 0,
  );

  console.log(empty);

  return (
    <AppLayout
      hideSearch={true}
    >
      {
        empty && <div style={{ marginTop: "5rem", marginBottom: "5rem", width: "100%" }} >
          <Header icon textAlign='center'>
            <Icon name='search' />
            A.R.O.N.A.
          </Header>
        </div>
      }
      <SearchBox
        self={self}
        setEmpty={setEmpty}
        form={initialForm}
        onSearch={setForm}
      />
      {!empty &&<SearchList
        key={JSON.stringify(form)}
        self={self}
        form={form}
      />}
    </AppLayout>
  );
};
