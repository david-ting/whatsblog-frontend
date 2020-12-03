import { convertToRaw, EditorState } from "draft-js";
import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { Button, Spinner } from "react-bootstrap";
import { addReply } from "../customFunc/asyncRequests/blogPostRequest";

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
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [reply, setReply] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitReply = () => {
    const content = convertToRaw(editorState.getCurrentContent());
    setSubmitting(true);
    addReply(post_id, content, reply_to)
      .then((res) => {
        if (res.status === 200) {
          setSubmitting(false);
          setReplies(res.data);
          setCurrentReplyCounts(res.data.replyCounts);
          setCurrentCommentCounts(res.data.commentCounts);
          setEditorState(EditorState.createEmpty());
        } else {
          console.error(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
      });
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
              setEditorState(EditorState.createEmpty());
            }}
          >
            Cancel
          </button>
        )}
      </div>
      {reply && (
        <div className="overlay-container">
          {submitting && <div className="overlay"></div>}
          <Editor
            editorState={editorState}
            wrapperClassName="comment-wrapper"
            toolbarClassName="comment-toolbar"
            editorClassName="comment-main"
            onEditorStateChange={(newEditorState) =>
              setEditorState(newEditorState)
            }
            toolbar={{
              options: ["inline", "emoji"],
              inline: {
                options: [
                  "bold",
                  "italic",
                  "underline",
                  "strikethrough",
                  "monospace",
                ],
              },
            }}
          />
        </div>
      )}
    </>
  );
};

export default EditableReply;
