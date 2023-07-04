import { ImageList, Loading } from "@components";
import { ImageInfo, SearchForm, Self } from "@data/interface";
import { useSearchList } from "@utils/hooks";
import { useEffect, useMemo, useState } from "react";
import { Message, Segment } from "semantic-ui-react";
import { getSearchUrl } from ".";
import InfiniteScroll from "react-infinite-scroll-component";

interface SearchListProps {
  form: SearchForm;
  self: Self | null;
}

const SearchList = (props: SearchListProps) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ImageInfo[]>([]);

  const params = useMemo(() => getSearchUrl({ ...props.form, "pageId": page }), [props.form, page]);

  const searchList = useSearchList(params, props.self?.jwt);

  const total = useMemo(() => {
    if (typeof searchList.data === "undefined") {
      return -1;
    }
    return Math.ceil(searchList.data.data.count / searchList.data.data.perPage);
  }, [searchList.data]);

  const loaded = new Set();

  useEffect(() => {
    if (typeof searchList.data !== "undefined") {
      const rawData = searchList.data.data.result;
      const newData = rawData.filter((value) => !loaded.has(value.id));

      newData.forEach((value) => loaded.add(value.id));
      setData((data) => [...data, ...newData]);
    }
  }, [searchList.data]);

  if (data.length === 0 && typeof searchList.data === "undefined" && searchList.isLoading) {
    return <Segment><Loading /></Segment>;
  }

  return (
    <Segment >
      <InfiniteScroll
        dataLength={data.length}
        next={() => setPage((page) => page + 1)}
        hasMore={total === -1 || page < total}
        endMessage={(
          <Message>
            你已到达世界的尽头。
          </Message>
        )}
        loader={<Loading />}
      >
        {
          data.length !== 0 &&
          <ImageList
            images={data}
            showUploader={true}
          />
        }
        {
          typeof searchList.error !== "undefined" &&
          <Message negative>
            {`搜索失败： ${searchList.error}`}
          </Message>
        }
      </InfiniteScroll>
    </Segment>
  );

};

export default SearchList;
