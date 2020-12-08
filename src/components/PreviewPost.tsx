import React from "react";
import { localeDateString } from "../customFunc/helperFunc";
import DefaultProfileIcon from "./DefaultProfileIcon";
import { RiArticleLine } from "react-icons/ri";
import { FaRegComment } from "react-icons/fa";
import { Link } from "react-router-dom";
import LikeDislike from "./LikeDislike";

const PreviewPost: React.FC<{
  showAuthor: boolean;
  data: {
    [keys: string]: any;
  };
}> = ({ showAuthor, data }) => {
  const { author, post, comment_counts: commentCounts } = data;

  return (
    <article className="preview-post-container">
      {
        <div className="preview-post-top">
          {showAuthor && author && (
            <>
              {author.profile_url ? (
                <img
                  alt="profile"
                  src={author.profile_url}
                  width="25px"
                  height="25px"
                  style={{
                    borderRadius: "50%",
                    border: "1px solid #F5F5F5",
                  }}
                ></img>
              ) : (
                <DefaultProfileIcon name={author.name} size={20} />
              )}
              <Link
                to={`/author/profile/${author.user_id}`}
                className="black-link"
              >
                {author.name}
              </Link>
            </>
          )}
        </div>
      }
      <h5 className="preview-post-title">
        <Link className="black-link" to={`/post/${post.post_id}`}>
          {post.title}
        </Link>
      </h5>
      <p className="preview-post-description">{post.description}</p>
      <div className="preview-post-bottom">
        <div className="mr-5">
          {post.blog_type} • {localeDateString(post.created_at)}
        </div>
        <div className="icons-wrapper">
          <LikeDislike
            initialState={{
              likeCounts: data.like_counts,
              dislikeCounts: data.dislike_counts,
              currentIsLike: data.current_user_is_like,
            }}
            post_id={post.post_id}
          />

          <FaRegComment size={"19.2px"} fill={"gray"} />
          <span className="ml-1">{commentCounts}</span>
        </div>
      </div>

      <div className="preview-post-img-wrapper">
        {post.header_image_url ? (
          <img alt="post_header" src={post.header_image_url}></img>
        ) : (
          <div className="preview-post-default-post-icon">
            <RiArticleLine size={"40px"} style={{ fill: "white" }} />
          </div>
        )}
      </div>
    </article>
  );
};

export default PreviewPost;
