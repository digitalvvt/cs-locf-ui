import React, { memo, useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkEmoji from "remark-emoji";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";

function MarkdownForBot({ content }: { content: string }) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const preprocessLaTeX = useCallback((content: string) => {
    const lineBreakProcessed = content
      .replace(/\n\t+/g, "\n&nbsp;&nbsp;&nbsp;&nbsp;")
      .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
      .replace(/(\d)\s+(\d)/g, "$1\u200B$2");

    const questionFormattedContent = lineBreakProcessed.replace(
      /(.*?)(\*\*Question\s*\d+:?\*\*)/gs,
      (_, beforeQuestion, questionHeading) => `${beforeQuestion.trim()}\n\n${questionHeading}\n`
    );

    const optionsTitleFormatted = questionFormattedContent.replace(
      /\s*\*\*Options:?\*\*\s*/g,
      "\n\n**Options**\n\n"
    );

    const separatedOptions = optionsTitleFormatted.replace(
      /([ABCD]\))\s*(.*?)(?=\n?[ABCD]\)|$)/gs,
      (_, letter, text) => `\n${letter} ${text.trim()}\n`
    );

    const blockProcessedContent = separatedOptions.replace(
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
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkEmoji, remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          img: ({ src, alt }) => (
            <img
              onClick={(e: any) => {
                setIsImageModalOpen(true);
                setImageUrl(e.target.src);
              }}
              src={src || ""}
              alt={alt || ""}
              className="w-[250px] h-[200px] rounded-2xl border contain-style p-2"
              width={1500}
              height={1500}
            />
          ),
        }}
        {...({ breaks: true } as any)}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}

export default memo(MarkdownForBot);
