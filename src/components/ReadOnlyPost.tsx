import { Editor } from "react-draft-wysiwyg";
import { localeDateString } from "../customFunc/helperFunc";
import React from "react";
import { EditorState, convertFromRaw } from "draft-js";
import DefaultProfileIcon from "./DefaultProfileIcon";
import { Link } from "react-router-dom";

const ReadOnlyPost: React.FC<{
  postData: {
    [keys: string]: any;
  };
}> = ({ postData }) => {
  const { post, author } = postData;
  const editorState = EditorState.createWithContent(
    convertFromRaw(post.content)
  );
  const { created_at } = post;
  return (
    <>
      <div className="post-head">
        {Object.keys(author).length !== 0 && (
          <>
            {author.profile_url === null ? (
              <DefaultProfileIcon name={author.name} size={45} />
            ) : (
              <img src={author.profile_url} alt="profile"></img>
            )}
            <div>
              <h6 className="mb-0">
                {" "}
                <Link
                  className="white-link"
                  to={`/author/profile/${author.user_id}`}
                >
                  {author.name}
                </Link>
              </h6>
              {
                <p className="mb-0">
                  {post.blog_type} • {localeDateString(created_at)}
                </p>
              }
            </div>
          </>
        )}
      </div>
      <div className="editor-wrapper">
        <h3 className="text-center">{post.title}</h3>
        <div className="text-center">
          {post.header_image_url && (
            <img
              src={post.header_image_url}
              alt="post_header"
              style={{ maxWidth: "100%" }}
            />
          )}
          <p>
            <i>{post.description}</i>
          </p>
        </div>
        <Editor
          readOnly
          toolbarHidden
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
        />
      </div>
    </>
  );
};

export default ReadOnlyPost;