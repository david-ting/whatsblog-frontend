import { convertFromRaw, EditorState } from "draft-js";
import React, { useState, useContext, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { localeDateString } from "../customFunc/helperFunc";
import DefaultProfileIcon from "./DefaultProfileIcon";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import EditableReply from "./EditableReply";
import { getReply } from "../customFunc/asyncRequests/blogPostRequest";
import ReadOnlyReply from "./ReadOnlyReply";
import { UserContext } from "../customContext/UserContextProvider";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const ReadOnlyComment: React.FC<{
  data: { [keys: string]: any };
  setCurrentCommentCounts: React.Dispatch<
    React.SetStateAction<string | number>
  >;
}> = ({ data, setCurrentCommentCounts }) => {
  const { currentUser } = useContext(UserContext);
  const [replies, setReplies] = useState<{
    replies: { [keys: string]: any }[];
    replyCounts: number;
    commentCounts: number;
  }>({ replies: [], replyCounts: 0, commentCounts: 0 });
  const { comment, commenter } = data;
  const editorState = EditorState.createWithContent(
    convertFromRaw(comment.content)
  );
  const [replyIsShow, setReplyIsShow] = useState(false);
  const [currentReplyCounts, setCurrentReplyCounts] = useState<number | string>(
    0
  );
  const [showSpinner, setShowSpinner] = useState(false);

  const toggleReplies = () => {
    if (replyIsShow) {
      setReplyIsShow(false);
    } else {
      setShowSpinner(true);
      getReply(comment.post_id, comment.comment_id)
        .then((res) => {
          if (res.status === 200) {
            setShowSpinner(false);
            setReplyIsShow(true);
            setReplies(res.data);
          } else {
            console.error(res.data.message);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  useEffect(() => {
    setCurrentReplyCounts(data.reply_counts);
  }, [data]);

  return (
    <div className="read-only-comment-wrapper">
      <div className="read-only-comment-left">
        {commenter.profile_url ? (
          <img src={commenter.profile_url} alt="profile"></img>
        ) : (
          <DefaultProfileIcon name={commenter.name} size={40} />
        )}
      </div>
      <div className="read-only-comment-right">
        <Link
          className="black-link"
          to={`/author/profile/${commenter.user_id}`}
        >
          <b>{commenter.name}</b>
        </Link>
        <i> {localeDateString(comment.created_at)}</i>
        <Editor readOnly toolbarHidden editorState={editorState} />
        <div className="mt-3 mb-2">
          {currentUser.loggedIn && (
            <EditableReply
              post_id={comment.post_id}
              reply_to={comment.comment_id}
              setReplies={setReplies}
              setCurrentReplyCounts={setCurrentReplyCounts}
              setCurrentCommentCounts={setCurrentCommentCounts}
            />
          )}
          {currentReplyCounts > 0 && (
            <i onClick={toggleReplies} style={{ cursor: "pointer" }}>
              {replyIsShow ? <GoTriangleUp /> : <GoTriangleDown />}
              {replyIsShow ? "hide" : "show"} {currentReplyCounts}
              {currentReplyCounts === 1 || currentReplyCounts === "1"
                ? " reply "
                : " replies "}
            </i>
          )}
          {showSpinner && (
            <div className="spinner-small px-3">
              <Spinner animation="border" variant="primary" />
            </div>
          )}
          {replyIsShow &&
            replies.replies.map((data) => (
              <ReadOnlyReply key={data.comment.comment_id} data={data} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ReadOnlyComment;
