import { useRef, useEffect, useCallback, ReactNode, useState } from "react";

interface AronaScrollProps {
  datalength: number;
  children: ReactNode;
  next: () => void;
  hasMore: boolean;
  isLoading?: boolean;
  endMessage?: ReactNode;
}

const AronaScroll = (props: AronaScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [needScroll, setNeedScroll] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      if (needScroll) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }
    setNeedScroll(true);
  }, [props.datalength]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    const scrollTop = containerRef.current.scrollTop;

    if (scrollTop === 0 && props.hasMore && !props.isLoading) {
      setNeedScroll(false);
      props.next();
    }

  }, [props.next, props.hasMore, containerRef.current]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <div ref={containerRef} style={{ maxHeight: "100%", overflow: "auto" }}>
      {!props.hasMore && props.endMessage}
      {props.children}
    </div>
  );
};

export default AronaScroll;
