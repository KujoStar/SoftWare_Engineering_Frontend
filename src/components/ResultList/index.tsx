import { NoItem } from "@components";
import { ResultInfo } from "@data/interface/utilities";
import { Card } from "semantic-ui-react";
import ResultCard from "./ResultCard";

interface ResultListProps {
  results: ResultInfo[];
  setPreview: (url: string, fileType: "gif" | "jpeg" | "png") => void;
  onDownload: (url: string, fileType: "gif" | "jpeg" | "png") => void;
}

const ResultList = (props: ResultListProps) => {
  if (props.results.length === 0) {
    return <NoItem />;
  }

  return (
    <Card.Group style={{ margin: "0rem" }}>
      {props.results.map((result) => (
        <ResultCard key={result.url} result={result} setPreview={props.setPreview} onDownload={props.onDownload} />
      ))}
    </Card.Group>
  );
};
export default ResultList;
