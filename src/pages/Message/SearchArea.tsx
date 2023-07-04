import { Divider, Message, Search, Segment } from "semantic-ui-react";
import styles from "./styles.module.scss";
import { MessageInfo, Self } from "@data/interface";
import { useEffect, useMemo, useState } from "react";
import { useRecentMessage, useSearchUser } from "@utils/hooks";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loading } from "@components";
import SearchItem from "./SearchItem";
import { getAnother } from "./utils";

interface SearchAreaProps {
  self: Self;
  another: string | null;
  setAnother: React.Dispatch<React.SetStateAction<string | null>>;
}

export const SearchArea = (props: SearchAreaProps) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<MessageInfo[]>([]);
  const [searchFor, setSearchFor] = useState("");


  const recentList = useRecentMessage(props.self.username, page, props.self?.jwt);

  const total = useMemo(() => {
    if (typeof recentList.data === "undefined") {
      return -1;
    }
    return Math.ceil(recentList.data.data.count / recentList.data.data.perPage);
  }, [recentList.data]);

  useEffect(() => {
    if (typeof recentList.data !== "undefined") {
      const rawData = recentList.data.data.result;      
      const loaded = new Set();
      rawData.forEach((value) => loaded.add(getAnother(value, props.self).username));
      const resData = data.filter((value) => !loaded.has(getAnother(value, props.self).username));
      setData([...resData, ...rawData].sort((a,b) => (a.time - b.time)));
    }
  }, [recentList.data]);

  const result = useSearchUser(searchFor, props.self.jwt);

  return (
    <Segment
      style={{ height: "110%", marginRight: "1rem", width: "100%" }}
    >
      <Search
        placeholder="搜索联系人"
        className={styles.search}
        onSearchChange={(e, d) => setSearchFor(d.value ?? "")}
        onResultSelect={(e, d) => {
          setSearchFor(d.result.title);
          props.setAnother(d.result.value);
        }}
        results={
          (searchFor.length === 0 || typeof result.data === "undefined") ? undefined
            : (
              result.data.data.result.map((value) => ({
                "title": value.nickname.length === 0 ? value.username : value.nickname,
                "value": value.username,
              })))
        }
      />
      <div style={{marginTop:"1rem", marginLeft:"0.2rem" }}>
        <h4>
          最近联系
        </h4>
        <Divider style={{ marginBottom:"0.4rem" }}/>
        <InfiniteScroll
          dataLength={data.length}
          next={() => setPage((page) => page + 1)}
          hasMore={total === -1 || page < total}
          endMessage={<Message> 已全部显示 </Message>}
          loader={<Loading />}
        >
          {
            data.map((message) =>
              <SearchItem
                key={message.id}
                another={props.another ?? ""}
                setAnother={props.setAnother}
                message={message}
                self={props.self}
              />)
          }
        </InfiniteScroll>
      </div>
    </Segment>
  );
};

