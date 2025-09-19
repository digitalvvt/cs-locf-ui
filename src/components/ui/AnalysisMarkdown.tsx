import React, { memo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkEmoji from "remark-emoji";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

function MarkdownWithLatex({ content }: { content: string }) {
  const preprocessLaTeX = useCallback((content: string) => {
    const lineBreakProcessed = content
      .replace(/\\n/g, "\n")
      .replace(/ {2}\*\*/g, "**")
      .replace(/\\n/g, "\n")
      .replace(/\n\t\t/g, "\n&nbsp;&nbsp;&nbsp;&nbsp;")
      .replace(/\n\t/g, "\n&nbsp;")
      .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
    const blockProcessedContent = lineBreakProcessed.replace(
      /\\\[(.*?)\\\]/gs,
      (_, equation) => `$$${equation}$$`
    );
    const inlineProcessedContent = blockProcessedContent.replace(
      /\\\((.*?)\\\)/gs,
      (_, equation) => `$${equation}$`
    );
    return inlineProcessedContent;
  }, []);
  const processedContent = preprocessLaTeX(`${content}`);
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkEmoji, remarkGfm]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        div: ({ children }) => <div className="mark_down_text">{children}</div>
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
}

export default memo(MarkdownWithLatex);
