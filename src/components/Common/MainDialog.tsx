import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { Icon } from "../ui/icon";
import { useMediaQuery } from "@/hooks/use-media-query";

interface IDialogProps {
  isOpen: boolean;
  title?: string;
  secondaryTitle?: string;
  description?: string;
  children: React.ReactNode;
  onOpenChange?: (data: boolean) => void;
  size?: "default" | "sm" | "md" | "lg" | "lg1" | "lg0";
  secondaryButton?: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  icon?: boolean;
  iconName?: string;
  image?: boolean;
  imagePath?: string;
}

export function MainDialog({
  isOpen,
  title,
  secondaryTitle,
  description,
  children,
  onOpenChange,
  size = "default",
  secondaryButton,
  className,
  showCloseButton,
  icon = false,
  iconName,
  image,
  imagePath,
}: IDialogProps) {
  const isMobile = useMediaQuery("(min-width: 768px)");
  const sizeClasses = {
    sm: "md:max-w-[384px] w-[90%]",
    default: "md:max-w-[576px] w-[90%]",
    md: "md:max-w-[996px] w-[90%]",
    lg0: "md:max-w-[70%] w-[90%]",
    lg: "md:max-w-[90%] w-[90%]",
    lg1: "sm:max-w-[640px]",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={`max-h-[90vh] overflow-y-auto ${sizeClasses[size]} ${className}`}
        showCloseIcon={showCloseButton}
      >
        <DialogHeader>
          {/* Wrapper for title, secondary title, and secondary button */}
          <div className="flex items-center gap-2">
            {/* {image && (
              <div className="mr-2 flex items-center rounded-full border border-borderad p-2">
                <Image src={imagePath!} alt="upload-icon" width={35} height={35} className="" />
              </div>
            )}
            {icon && (
              <div className="mr-2 flex items-center">
                <Icon icon={iconName!} className="size-7 md:size-9" />
              </div>
            )} */}
            <div className="flex flex-grow flex-col">
              {/* Main title */}
              <DialogTitle
                className={`${className} text-left text-base font-semibold text-[#222222]`}
              >
                {title}
              </DialogTitle>
              {/* Secondary title */}
              {secondaryTitle && (
                <p className="text-left text-sm font-medium text-[#6F6F6F] md:mt-1">
                  {secondaryTitle}
                </p>
              )}
            </div>
            {/* Secondary button */}
            {secondaryButton && (
              <div
                className={`${
                  isMobile ? "ml-auto" : "w-full overflow-x-auto"
                } flex md:mr-5 md:justify-end`}
              >
                {secondaryButton}
              </div>
            )}
          </div>
        </DialogHeader>

        {description && <DialogDescription>{description}</DialogDescription>}

        {children}
      </DialogContent>
    </Dialog>
  );
}
