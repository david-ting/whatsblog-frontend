import React, { useState, useContext, useRef } from "react";
import { Button, Spinner } from "react-bootstrap";
import { addComment } from "../customFunc/asyncRequests/blogPostRequest";
import { UserContext } from "../customContext/UserContextProvider";
import DefaultProfileIcon from "./DefaultProfileIcon";
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

const EditableComment: React.FC<{
  post_id: number;
  setComments: React.Dispatch<
    React.SetStateAction<{
      data: {
        comments: {
          [keys: string]: any;
        }[];
        commentCounts: number;
      };
      loading: boolean;
    }>
  >;
}> = ({ post_id, setComments }) => {
  const { currentUser } = useContext(UserContext);
  const [content, setContent] = useState("");
  const [focus, setFocus] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  const submitComment = () => {
    if (quillRef.current) {
      const submittedContent = quillRef.current.getEditor().getContents();
      setSubmitting(true);
      addComment(post_id, submittedContent)
        .then((res) => {
          if (res.status === 200) {
            setSubmitting(false);
            setComments({ data: res.data, loading: false });
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
  return !currentUser.loggedIn ? (
    <></>
  ) : (
    <section className="my-3 editable-comment-container">
      <div className="editable-comment-top">
        {currentUser.profile_url ? (
          <img src={currentUser.profile_url} alt="profile"></img>
        ) : (
          <DefaultProfileIcon name={currentUser.name} size={40} />
        )}
        <span className="ml-2">New comment</span>
        {focus && (
          <Button
            className="themeColor-btn p-1 ml-2 mb-2"
            onClick={submitting ? () => {} : submitComment}
          >
            {submitting ? "Submiting" : "Submit"}
            {submitting && (
              <Spinner className="ml-2" animation="grow" size="sm" />
            )}
          </Button>
        )}
        {focus && !submitting && (
          <Button
            className="btn-secondary p-1 ml-2 mb-2"
            onClick={() => {
              setFocus(false);
              setContent("");
            }}
          >
            Cancel
          </Button>
        )}
      </div>
      <div
        className="editable-comment-bottom overlay-container"
        tabIndex={-1}
        onFocus={() => {
          setFocus(true);
        }}
      >
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
    </section>
  );
};

export default EditableComment;
