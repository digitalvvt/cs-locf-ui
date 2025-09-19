"use client";

import { ChevronLeftIcon, ChevronRightIcon, ExitIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

interface FooterProps {
  onPrev: () => void;
  onNext: () => void;
  onSaveAndNext: () => void;
  onSubmitExam: () => void;
  onMarkForReview: () => void;
  onLeaveExam: () => void;
  disablePrev: boolean;
  disableNext: boolean;
  isBusy?: boolean;
}

const Footer = ({
  onPrev,
  onNext,
  onSaveAndNext,
  onMarkForReview,
  onLeaveExam,
  disablePrev,
  disableNext,
  onSubmitExam,
  isBusy = false,
}: FooterProps) => {
  return (
    <div className="fixed bottom-0 w-full bg-opacity-[40%] left-0 p-2 lg:p-5 z-10 !bg-[#FFF] dark:!bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-700">
      <div className="w-full max-w-screen-md mx-auto">
        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-between items-center gap-x-6 h-[80px]">
          {/* Prev Button */}
          <Button
            aria-label="previous button"
            onClick={onPrev}
            disabled={disablePrev || isBusy}
            className="bg-[#F5F5F5] hover:bg-[#F5F5F5] text-[#101010] shadow-none"
          >
            <ChevronLeftIcon className="mr-1" />
            Previous
          </Button>

          {/* Middle Buttons */}
          <div className="flex items-center gap-x-6">
            <Button
              aria-label="mark for review"
              onClick={onMarkForReview}
              disabled={isBusy}
              className="bg-[#FFF2CC99] hover:bg-[#FFF2CC99] dark:bg-[#FFF2CC] dark:hover:bg-[#FFF2CC] shadow-none text-[#B75F00] font-medium text-[16px]"
            >
              Mark for Review
            </Button>
            <Button
              aria-label="save and next"
              onClick={onSaveAndNext}
              disabled={isBusy}
              className="bg-[#C7F7D499] hover:bg-[#C7F7D499] dark:bg-[#C7F7D4] dark:hover:bg-[#C7F7D4] text-[#046444] shadow-none font-medium"
            >
              Save & Next
            </Button>
          </div>

          {/* Next Button */}
          <Button onClick={onNext} disabled={disableNext || isBusy}>
            Next <ChevronRightIcon className="ml-1" />
          </Button>

          {/* Right group: Leave & Submit */}
          <div className="flex items-center gap-x-4">
            <Button onClick={onLeaveExam} disabled={isBusy} className="bg-[#D70015] hover:bg-[#D70015] text-white">
              Leave Test
            </Button>
            <Button onClick={onSubmitExam} disabled={isBusy} className="bg-[#046444] hover:bg-[#046444] text-white">
              Submit Test
            </Button>
          </div>
        </div>

        {/* Mobile Layout - Compact 2-row design */}
        <div className="lg:hidden space-y-2">
          {/* Top Row - Main Action Buttons */}
          <div className="flex items-center gap-x-1.5">
            <Button
              aria-label="mark for review"
              onClick={onMarkForReview}
              disabled={isBusy}
              className="bg-[#FFF2CC99] hover:bg-[#FFF2CC99] dark:bg-[#FFF2CC] dark:hover:bg-[#FFF2CC] shadow-none text-[#B75F00] font-medium text-xs px-2 py-1.5 h-8 flex-1"
            >
              Mark Review
            </Button>
            <Button
              aria-label="save and next"
              onClick={onSaveAndNext}
              disabled={isBusy}
              className="bg-[#C7F7D499] hover:bg-[#C7F7D499] dark:bg-[#C7F7D4] dark:hover:bg-[#C7F7D4] text-[#046444] shadow-none font-medium text-xs px-2 py-1.5 h-8 flex-1"
            >
              Save & Next
            </Button>
          </div>

          {/* Bottom Row - Navigation and Exit Buttons */}
          <div className="flex items-center gap-x-1.5">
            <Button
              aria-label="previous button"
              onClick={onPrev}
              disabled={disablePrev || isBusy}
              className="bg-[#F5F5F5] hover:bg-[#F5F5F5] text-[#101010] shadow-none text-xs px-2 py-1.5 h-8 flex-1"
            >
              <ChevronLeftIcon className="w-3 h-3 mr-1" />
              Prev
            </Button>
            <Button
              onClick={onNext}
              disabled={disableNext || isBusy}
              className="text-xs px-2 py-1.5 h-8 flex-1"
            >
              Next
              <ChevronRightIcon className="w-3 h-3 ml-1" />
            </Button>
            {/* <Button
              onClick={onLeaveExam}
              className="bg-[#D70015] hover:bg-[#D70015] text-white text-xs px-2 py-1.5 h-8 w-8 p-0"
              aria-label="leave test"
            >
              <ExitIcon className="w-3 h-3" />
            </Button> */}
            <Button
              onClick={onSubmitExam}
              disabled={isBusy}
              className="bg-[#046444] hover:bg-[#046444] text-white text-xs px-2 py-1.5 h-8 flex-1"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
