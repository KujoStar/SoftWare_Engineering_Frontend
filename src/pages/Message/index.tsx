import { AppLayout } from "@layouts";
import { useSearchParams } from "react-router-dom";
import MessageArea from "./MessageArea";
import { useAppState } from "@state";
import { LoginPlz } from "@pages/ErrorPages";
import { SearchArea } from "./SearchArea";
import { useState } from "react";


export const Page = () => {
  
  const { self } = useAppState();
  const [ searchParams ] = useSearchParams();
  const [another, setAnother] = useState(searchParams.get("username"));

  if (self === null) {
    return <LoginPlz/>;
  }

  return (
    <AppLayout>
      <div
        style={{ display: "flex", height: "50rem"}}
      >
        <div style={{ display: "flex", flex: 1 }}>
          <SearchArea
            self={self}
            another={another}
            setAnother={setAnother}
          />
        </div>
        <div style={{ flex: 3, maxWidth: "75%" }}>
          <MessageArea
            key={another}
            another={another}
            self={self}
            senderPosition="bottom"
          />
        </div>
      </div>
    </AppLayout>
  );
};
