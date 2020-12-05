import React, { useState, useRef } from "react";
import { Button, Spinner } from "react-bootstrap";
import { addReply } from "../customFunc/asyncRequests/blogPostRequest";
import ReactQuill from "react-quill";

const modules = {
  toolbar: {
    container: [
      [{ color: [] }, { background: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  },
};

const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
];

const EditableReply: React.FC<{
  post_id: number;
  reply_to: number;
  setReplies: React.Dispatch<
    React.SetStateAction<{
      replies: {
        [keys: string]: any;
      }[];
      replyCounts: number;
      commentCounts: number;
    }>
  >;
  setCurrentReplyCounts: React.Dispatch<React.SetStateAction<string | number>>;
  setCurrentCommentCounts: React.Dispatch<
    React.SetStateAction<string | number>
  >;
}> = ({
  post_id,
  reply_to,
  setReplies,
  setCurrentCommentCounts,
  setCurrentReplyCounts,
}) => {
  const [content, setContent] = useState("");
  const [reply, setReply] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  const submitReply = () => {
    if (quillRef.current) {
      const submittedContent = quillRef.current.getEditor().getContents();
      setSubmitting(true);
      addReply(post_id, submittedContent, reply_to)
        .then((res) => {
          if (res.status === 200) {
            setSubmitting(false);
            setReplies(res.data);
            setCurrentReplyCounts(res.data.replyCounts);
            setCurrentCommentCounts(res.data.commentCounts);
            setContent("");
          } else {
            console.error(res.data.message);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <>
      <div className="mb-1">
        {!reply && (
          <Button
            className="themeColor-outline-btn"
            style={{ padding: "2px" }}
            onClick={() => {
              setReply(true);
            }}
          >
            reply
          </Button>
        )}
        {reply && (
          <Button
            className="themeColor-outline-btn"
            style={{ padding: "2px" }}
            onClick={submitting ? () => {} : submitReply}
          >
            {submitting ? "Submiting" : "Submit"}
            {submitting && (
              <Spinner className="ml-2" animation="grow" size="sm" />
            )}
          </Button>
        )}
        {reply && !submitting && (
          <button
            className="btn btn-outline-secondary ml-2"
            style={{ padding: "2px" }}
            onClick={() => {
              setReply(false);
              setContent("");
            }}
          >
            Cancel
          </button>
        )}
      </div>
      {reply && (
        <div className="overlay-container">
          {submitting && <div className="overlay"></div>}
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            modules={modules}
            formats={formats}
            onChange={(value) => setContent(value)}
          ></ReactQuill>
        </div>
      )}
    </>
  );
};

export default EditableReply;
