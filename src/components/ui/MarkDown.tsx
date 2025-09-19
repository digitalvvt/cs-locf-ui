import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkEmoji from "remark-emoji";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
// import remarkBreaks from "remark-breaks";

function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="mark_down_text">
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkEmoji, remarkGfm]} // ✅ Add remarkBreaks
        rehypePlugins={[rehypeRaw]}
      />
    </div>
  );
}

export default memo(MarkdownRenderer);
