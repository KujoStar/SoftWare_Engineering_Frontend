import styles from "./styles.module.scss";
import { useEffect, useRef, useState } from "react";

interface ImagePreviewProps {
  url: string;
  text: string;
  fontSize: number;
  top: number;
  left: number;
}

export const ImagePreview = (props: ImagePreviewProps) => {
  console.log("left:", props.left, "top:", props.top, "fontSize:", props.fontSize);
  const imageRef = useRef<HTMLImageElement>(null);
  // const [loading, setLoading] = useState();
  const [fontSize, setFontSize] = useState("0px");
  const [top, setTop] = useState("0px");
  const [left, setLeft] = useState("0px");

  const handleSizeChange = () => {
    console.log("resize!");
    if (imageRef.current) {
      const height = imageRef.current.getBoundingClientRect().height;
      const width = imageRef.current.getBoundingClientRect().width;
      const fs = 0.01 * props.fontSize * Math.min(height, width);
      const l = 0.01 * props.left * width;
      const t = 0.01 * props.top * height;
      setFontSize(`${fs}px`);
      setLeft(`${l}px`);
      setTop(`${t}px`);
      console.log("result: ", "top - ", t, "left - ", l, "font - ", fs);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleSizeChange);
    handleSizeChange();
  }, [imageRef]);

  useEffect(() => {
    window.addEventListener("resize", handleSizeChange);
    handleSizeChange();
  });

  return (<>
    <img ref={imageRef} src={props.url} alt="image" onLoad={handleSizeChange} width={"100%"} />
    <span
      className={styles.watermark_text}
      style={{ top, left, fontSize }}
    >
      {props.text}
    </span >
  </>
  );
};

