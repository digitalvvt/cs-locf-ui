"use client";
import type React from "react";
import { CKEditor, useCKEditorCloud } from "@ckeditor/ckeditor5-react";
import type { UploadAdapter, FileLoader } from "@ckeditor/ckeditor5-upload/src/filerepository";
import type { Editor } from "@ckeditor/ckeditor5-core";
import axios from "axios";
import { MainDialog } from "@/components/Common/MainDialog";
import { Button } from "@/components/ui/button";

const NEXT_PUBLIC_LICENSE_KEY =
  "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NzEzNzI3OTksImp0aSI6IjJhMGI3MDJmLTlkODktNDhhMC05MmQ5LWRmN2IzMjMzN2VkMCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCJdLCJ2YyI6IjVhZTU2MDhkIn0.l__8lMDGuUu-0JoHRsuWlqyCa5BgROr0LJApbfASmX0lm34n-I07Ioghf_1zr8ltY7zjmc8nCx0YRcvqwpinqA";

interface EditorCKProps {
  open: boolean;
  onClose: () => void;
  editorState: string;
  setEditorState: React.Dispatch<React.SetStateAction<string>>;
  onUpdate?: () => void;
  title?: string;
}

const CustomEditor = ({
  open,
  onClose,
  editorState,
  setEditorState,
  onUpdate,
  title = "Edit Instructions",
}: EditorCKProps) => {
  const cloud = useCKEditorCloud({
    version: "44.2.0",
  });

  if (cloud.status === "error") {
    return <div>Error!</div>;
  }

  if (cloud.status === "loading") {
    return <div>Loading...</div>;
  }

  const {
    ClassicEditor,
    Autoformat,
    Bold,
    Italic,
    Underline,
    BlockQuote,
    CloudServices,
    Essentials,
    Heading,
    Image,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    PictureEditing,
    Indent,
    IndentBlock,
    Link,
    List,
    Font,
    Mention,
    Paragraph,
    PasteFromOffice,
    Table,
    TableColumnResize,
    TableToolbar,
    TextTransformation,
    SourceEditing,
    MediaEmbed,
    HtmlEmbed,
  } = cloud.CKEditor;

  function uploadAdapter(loader: FileLoader): UploadAdapter {
    return {
      upload: async () => {
        return new Promise((resolve, reject) => {
          loader.file
            .then((file) => {
              if (!file) {
                reject("No file selected");
                return;
              }
              const formData = new FormData();
              formData.append("image", file);
              formData.append("folder", "image");

              axios
                .post("/api/s3-upload", formData)
                .then((response) => {
                  if (response.data && response.data.url) {
                    resolve({ default: response.data.url });
                  } else {
                    reject("Invalid response from server");
                  }
                })
                .catch(() => {
                  reject("Upload failed");
                });
            })
            .catch(() => {
              reject("Upload failed");
            });
        });
      },
      abort: () => {},
    };
  }

  function uploadPlugin(editor: Editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      const adapter = uploadAdapter(loader);
      return adapter;
    };
  }

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate();
    } else {
      onClose();
    }
  };

  return (
    <MainDialog isOpen={open} title={title} onOpenChange={onClose} size="lg">
      <div className="space-y-4">
        <div className="min-h-[400px]">
          {/* Custom CSS for CKEditor Lists */}
          <style jsx global>{`
            .ck-editor__editable {
              min-height: 400px !important;
            }

            /* Bullet Lists */
            .ck-editor__editable ul {
              list-style-type: disc !important;
              margin-left: 20px !important;
              padding-left: 20px !important;
            }

            .ck-editor__editable ul li {
              display: list-item !important;
              list-style-type: disc !important;
              margin-left: 0 !important;
              padding-left: 5px !important;
            }

            /* Numbered Lists */
            .ck-editor__editable ol {
              list-style-type: decimal !important;
              margin-left: 20px !important;
              padding-left: 20px !important;
            }

            .ck-editor__editable ol li {
              display: list-item !important;
              list-style-type: decimal !important;
              margin-left: 0 !important;
              padding-left: 5px !important;
            }

            /* Nested Lists */
            .ck-editor__editable ul ul {
              list-style-type: circle !important;
            }

            .ck-editor__editable ul ul ul {
              list-style-type: square !important;
            }

            .ck-editor__editable ol ol {
              list-style-type: lower-alpha !important;
            }

            .ck-editor__editable ol ol ol {
              list-style-type: lower-roman !important;
            }

            /* Ensure proper spacing */
            .ck-editor__editable li {
              margin-bottom: 5px !important;
            }

            /* Fix for any CSS reset that might be interfering */
            .ck-editor__editable ul,
            .ck-editor__editable ol {
              list-style: revert !important;
            }

            .ck-editor__editable li {
              list-style: inherit !important;
            }
          `}</style>

          <CKEditor
            editor={ClassicEditor}
            data={editorState}
            config={{
              licenseKey: NEXT_PUBLIC_LICENSE_KEY,
              plugins: [
                Autoformat,
                BlockQuote,
                Bold,
                CloudServices,
                Essentials,
                Heading,
                Image,
                ImageResize,
                ImageStyle,
                ImageToolbar,
                ImageUpload,
                Indent,
                IndentBlock,
                Italic,
                Link,
                Font,
                List,
                Mention,
                Paragraph,
                PasteFromOffice,
                PictureEditing,
                Table,
                TableColumnResize,
                TableToolbar,
                TextTransformation,
                Underline,
                SourceEditing,
                MediaEmbed,
                HtmlEmbed,
              ],
              toolbar: [
                "undo",
                "redo",
                "|",
                "heading",
                "|",
                "bold",
                "italic",
                "underline",
                "|",
                "link",
                "uploadImage",
                "insertTable",
                "blockQuote",
                "|",
                "fontColor",
                "fontBackgroundColor",
                "|",
                "bulletedList",
                "numberedList",
                "|",
                "outdent",
                "indent",
                "sourceEditing",
                "|",
                "mediaEmbed",
                "HtmlEmbed",
              ],
              heading: {
                options: [
                  {
                    model: "paragraph",
                    title: "Paragraph",
                    class: "ck-heading_paragraph",
                  },
                  {
                    model: "heading1",
                    view: "h1",
                    title: "Heading 1",
                    class: "ck-heading_heading1",
                  },
                  {
                    model: "heading2",
                    view: "h2",
                    title: "Heading 2",
                    class: "ck-heading_heading2",
                  },
                  {
                    model: "heading3",
                    view: "h3",
                    title: "Heading 3",
                    class: "ck-heading_heading3",
                  },
                  {
                    model: "heading4",
                    view: "h4",
                    title: "Heading 4",
                    class: "ck-heading_heading4",
                  },
                ],
              },
              image: {
                resizeOptions: [
                  {
                    name: "resizeImage:original",
                    label: "Default image width",
                    value: null,
                  },
                  {
                    name: "resizeImage:50",
                    label: "50% page width",
                    value: "50",
                  },
                  {
                    name: "resizeImage:75",
                    label: "75% page width",
                    value: "75",
                  },
                ],
                toolbar: [
                  "imageTextAlternative",
                  "toggleImageCaption",
                  "|",
                  "imageStyle:inline",
                  "imageStyle:wrapText",
                  "imageStyle:breakText",
                  "|",
                  "resizeImage",
                ],
              },
              extraPlugins: [uploadPlugin],
              // Additional list configuration
              list: {
                properties: {
                  styles: true,
                  startIndex: true,
                  reversed: true,
                },
              },
            }}
            onChange={(_event, editor) => {
              const data = editor.getData();
              setEditorState(data);
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Update
          </Button>
        </div>
      </div>
    </MainDialog>
  );
};

export default CustomEditor;
