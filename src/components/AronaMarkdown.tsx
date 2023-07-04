import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css";
interface AronaMarkdownProps{
  content: string;
}

const AronaMarkdown = (props: AronaMarkdownProps) => (
  <ReactMarkdown
    remarkPlugins={[remarkMath]}
    rehypePlugins={[rehypeKatex, rehypeRaw]}
  >
    {props.content}
  </ReactMarkdown>
);

export default AronaMarkdown;
