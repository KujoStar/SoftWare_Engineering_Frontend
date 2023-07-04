import { ImageList, Loading } from "@components";
import { ImageInfo, Self } from "@data/interface";
import { useHistory } from "@utils/hooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { Message, Segment } from "semantic-ui-react";
import InfiniteScroll from "react-infinite-scroll-component";

interface SearchListProps {
  self: Self;
}

const HistoryList = (props: SearchListProps) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ImageInfo[]>([]);

  const historyList = useHistory(page, props.self?.jwt);

  const total = useMemo(() => {
    if (typeof historyList.data === "undefined") {
      return -1;
    }
    return Math.ceil(historyList.data.data.count / historyList.data.data.perPage);
  }, [historyList.data]);

  // const loaded = new Set();
  const loaded = useRef<{ [key: number]: boolean }>({});
  
  useEffect(() => {
    if (typeof historyList.data !== "undefined") {
      const rawData = historyList.data.data.result;
      const delta = rawData.reduce((newData, value) => {
        if (loaded.current[value.id]) {
          return newData;
        }
        loaded.current[value.id] = true;
        return [...newData, value];
      }, [] as ImageInfo[]);
      setData((data) => [...data, ...delta]);
    }
  }, [historyList.data]);

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
      </InfiniteScroll>
    </Segment>
  );

};

export default HistoryList;
