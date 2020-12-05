import React, { useState, useMemo, useCallback } from "react";
import ReactQuill from "react-quill";
import { uploadImageToServer } from "../customFunc/asyncRequests/otherRequests";
import loadingGif from "../gif/loading.gif";

const EditablePost: React.FC<{ quillRef: React.RefObject<ReactQuill> }> = ({
  quillRef,
}) => {
  const [content, setContent] = useState("");

  const imageHandler = useCallback(() => {
    if (quillRef?.current?.getEditor().getContents()) {
      const delta = quillRef?.current?.getEditor().getContents();
      console.log(JSON.stringify(delta));
    }

    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      try {
        if (input.files && input.files[0] && quillRef && quillRef.current) {
          const file = input.files[0];

          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);

          quill.insertEmbed(range.index, "image", loadingGif);
          const res = await uploadImageToServer(file);
          quill.deleteText(range.index, 1);
          quill.insertEmbed(range.index, "image", res.data.url);
          quill.setSelection(range.index + 1, 0);
        }
      } catch (err) {
        console.error(err);
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ size: [] }, { font: [] }],
          [{ color: [] }, { background: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler]
  );

  const formats = [
    "size",
    "font",
    "color",
    "background",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={content}
      modules={modules}
      formats={formats}
      onChange={(value) => setContent(value)}
    ></ReactQuill>
  );
};

export default EditablePost;
