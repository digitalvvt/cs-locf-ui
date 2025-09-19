import React, { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";

// ❗ rehypeRaw removed to avoid double rendering

function MarkdownWithLatex({ content }: { content: string }) {
  const processedContent = useMemo(() => {
    return content
      .replace(/\\n/g, "\n")
      .replace(/\n\t\t/g, "\n&nbsp;&nbsp;&nbsp;&nbsp;")
      .replace(/\n\t/g, "\n&nbsp;")
      .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
      .replace(/\\\[(.*?)\\\]/gs, (_, equation) => `$$${equation}$$`)
      .replace(/\\\((.*?)\\\)/gs, (_, equation) => `$${equation}$`);
  }, [content]);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkEmoji, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
    //   className="mark_down_text_question_showing"
    >
      {processedContent}
    </ReactMarkdown>
  );
}

export default memo(MarkdownWithLatex);
