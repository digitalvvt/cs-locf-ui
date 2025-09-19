import { IExtractedPdf } from "@/api/api/program-outcomes-api";
import MarkdownRenderer from "@/components/ui/MarkDown";

const ExtractedPdfSection = ({ pdfData }: { pdfData: IExtractedPdf }) => {
  // return <MarkdownRenderer content={data} />;
  return (
    <div className="space-y-4">
      <MarkdownRenderer content={pdfData.clean_content} />
    </div>
  );
};

export default ExtractedPdfSection;
