import React, { useState, useContext } from "react";
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Button, Spinner } from "react-bootstrap";
import { addComment } from "../customFunc/asyncRequests/blogPostRequest";
import { UserContext } from "../customContext/UserContextProvider";
import DefaultProfileIcon from "./DefaultProfileIcon";

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
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [focus, setFocus] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitComment = () => {
    const content = convertToRaw(editorState.getCurrentContent());
    setSubmitting(true);
    addComment(post_id, content)
      .then((res) => {
        if (res.status === 200) {
          setSubmitting(false);
          setComments({ data: res.data, loading: false });
          setEditorState(EditorState.createEmpty());
        } else {
          console.error(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
      });
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
              setEditorState(EditorState.createEmpty());
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
        <Editor
          toolbarHidden={!focus}
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
    </section>
  );
};

export default EditableComment;
