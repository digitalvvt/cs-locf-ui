import { cn } from "@/lib/utils";
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
const MainCard = ({
  children,
  title,
  description,
  cardAction,
  className,
  contentClassName,
  titleClassName,
  headerClassName,
  onClick,
}: {
  children: React.ReactElement;
  title: React.ReactElement | string;
  description?: React.ReactElement;
  cardAction?: React.ReactElement;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  headerClassName?: string;
  onClick?: () => void;
}) => {
  return (
    <Card
      className={cn("dark:bg-[#171717] p-[16px] lg:p-[28px] lg:pb-[23px]", className)}
      onClick={() => onClick && onClick()}
    >
      {title && (
        <CardHeader className={cn("px-0 pt-0", headerClassName)}>
          {typeof title === "string" ? (
            <CardTitle
              aria-label={`Title for ${title}`}
              aria-labelledby={title}
              className={cn(
                "px-0 dark:text-[#A6BCF0] text-[#192B69] mb-[14px] lg:text-[28px] text-[20px] ",
                titleClassName
              )}
            >
              {title}
            </CardTitle>
          ) : (
            title
          )}
          {description && <CardDescription className="px-0">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn("px-0", contentClassName)}>{children}</CardContent>
      {cardAction && <CardFooter className="px-0 pb-0">{cardAction}</CardFooter>}
    </Card>
  );
};
export default MainCard;
