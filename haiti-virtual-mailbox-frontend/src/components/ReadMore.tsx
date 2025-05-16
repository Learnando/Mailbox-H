import { useState } from "react";

interface ReadMoreProps {
  text: string;
  maxLength?: number;
}

const ReadMore = ({ text, maxLength = 100 }: ReadMoreProps) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > maxLength;

  const toggle = () => setExpanded((prev) => !prev);

  return (
    <p style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
      {expanded || !isLong ? text : text.slice(0, maxLength) + "... "}
      {isLong && (
        <button
          type="button" // ✅ prevents accidental form submission
          onClick={toggle}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            cursor: "pointer",
            paddingLeft: "5px",
          }}
        >
          {expanded ? "Read Less" : "Read More"}
        </button>
      )}
    </p>
  );
};

export default ReadMore;
