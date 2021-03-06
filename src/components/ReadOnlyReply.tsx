import { convertFromRaw, EditorState } from "draft-js";
import React from "react";
import { Editor } from "react-draft-wysiwyg";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import { localeDateString } from "../customFunc/helperFunc";
import DefaultProfileIcon from "./DefaultProfileIcon";

const ReadOnlyReply: React.FC<{ data: { [keys: string]: any } }> = ({
  data,
}) => {
  const { comment, commenter } = data;
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
        <ReactQuill
          value={comment.content}
          readOnly={true}
          modules={{ toolbar: false }}
        ></ReactQuill>
      </div>
    </div>
  );
};

export default ReadOnlyReply;
