import React, { memo, useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

function MarkdownBotLatest({ content }: { content: string }) {
  // **1.** Convert any literal “\n” in your JSON into real newlines
  const normalizeNewlines = useCallback((c: string) => c.replace(/\\n/g, "\n"), []);

  // **2.** (Optional) If you still need indentation tweaks, do it *after* newline
  const preprocess = useCallback(
    (c: string) => {
      const withLines = normalizeNewlines(c);
      // e.g. your indenting, heading fixes, etc
      return withLines
        .replace(/\n\t+/g, "\n&nbsp;&nbsp;&nbsp;&nbsp;")
        .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
    },
    [normalizeNewlines]
  );

  const processed = preprocess(content);

  return (
    <ReactMarkdown
      // **3.** GFM first, then emoji, then math
      remarkPlugins={[remarkGfm, remarkEmoji, remarkMath]}
      // **4.** Allow raw HTML *before* Katex runs
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      // **5.** Enable raw HTML parsing
      skipHtml={false}
    >
      {processed}
    </ReactMarkdown>
  );
}

export default memo(MarkdownBotLatest);
