import React, { useState, useMemo, useCallback } from "react";
import ReactQuill from "react-quill";
import { uploadImageToServer } from "../customFunc/asyncRequests/otherRequests";
import loadingGif from "../gif/loading.gif";
import { Alert } from "react-bootstrap";
import useAlert from "../customHook/useAlert";

const EditablePost: React.FC<{ quillRef: React.RefObject<ReactQuill> }> = ({
  quillRef,
}) => {
  const [content, setContent] = useState("");
  const { showAlert, dispatchShowAlert } = useAlert();

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      try {
        if (input.files && input.files[0] && quillRef && quillRef.current) {
          const file = input.files[0];

          if (!/^image\//.test(file.type)) {
            dispatchShowAlert({
              type: "SHOW",
              variant: "danger",
              content: "only image file is allowed",
            });
            return;
          }

          if (file.size > 2097152) {
            dispatchShowAlert({
              type: "SHOW",
              variant: "danger",
              content:
                "file size is too large. please upload an image with size less than or equal to 2MB",
            });
            return;
          }

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
    <>
      <Alert
        show={showAlert.show}
        variant={showAlert.variant}
        onClose={() => dispatchShowAlert({ type: "HIDE" })}
        dismissible
      >
        {showAlert.content}
      </Alert>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={content}
        modules={modules}
        formats={formats}
        onChange={(value) => setContent(value)}
      ></ReactQuill>
    </>
  );
};

export default EditablePost;
