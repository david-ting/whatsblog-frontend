import React, { useEffect, useState, useContext } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ReadOnlyPost from "../components/ReadOnlyPost";
import {
  getComment,
  getPost,
} from "../customFunc/asyncRequests/blogPostRequest";
import EditableComment from "../components/EditableComment";
import ReadOnlyComment from "../components/ReadOnlyComment";
import { UserContext } from "../customContext/UserContextProvider";
import Spinner from "react-bootstrap/Spinner";
import LikeDislike from "../components/LikeDislike";
import { FaRegComment } from "react-icons/fa";

const PostPage: React.FC<{}> = () => {
  const { post_id } = useParams<{ post_id: string }>();
  const { currentUser } = useContext(UserContext);

  const [post, setPost] = useState<{
    data: { [keys: string]: any };
    loading: boolean;
  }>({ data: {}, loading: true });

  const [comments, setComments] = useState<{
    data: { comments: { [keys: string]: any }[]; commentCounts: number };
    loading: boolean;
  }>({ data: { comments: [], commentCounts: 0 }, loading: true });

  const [currentCommentCounts, setCurrentCommentCounts] = useState<
    number | string
  >(0);

  useEffect(() => {
    getPost(parseInt(post_id))
      .then((res) => {
        if (res.status === 200) {
          setPost({ data: res.data, loading: false });
        } else {
          console.error(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [post_id]);

  useEffect(() => {
    getComment(parseInt(post_id))
      .then((res) => {
        if (res.status === 200) {
          setComments({ data: res.data, loading: false });
        } else {
          console.error(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [post_id]);

  useEffect(() => {
    setCurrentCommentCounts(comments.data.commentCounts);
  }, [comments]);

  useEffect(() => {
    if (post.data.post && post.data.post.title)
      document.title = `${post.data.post.title} | Post | Whatsblog`;
  }, [post]);

  return (
    <section>
      <Container className="my-5">
        {(post.loading || comments.loading) && (
          <div className="spinner-wrapper">
            <Spinner animation="border" variant="primary" />
          </div>
        )}
        {!post.loading && !comments.loading && (
          <>
            {Object.keys(post.data).length > 0 && (
              <ReadOnlyPost postData={post.data} />
            )}
            <div className="pl-2 pt-2">
              <LikeDislike
                initialState={{
                  likeCounts: post.data.like_counts,
                  dislikeCounts: post.data.dislike_counts,
                  currentIsLike: post.data.current_user_is_like,
                }}
                post_id={post.data.post_id}
              />
            </div>
            {currentUser.loggedIn && (
              <EditableComment
                post_id={parseInt(post_id)}
                setComments={setComments}
              />
            )}

            <div
              className="pl-2 pt-2"
              style={{
                paddingBottom:
                  currentCommentCounts === 0 || currentCommentCounts === "0"
                    ? "100px"
                    : "0px",
              }}
            >
              <FaRegComment
                size={"19.2px"}
                fill={"gray"}
                className="mr-1 mb-1"
              />
              {currentCommentCounts}
            </div>
            {comments.data.comments.map((data) => (
              <ReadOnlyComment
                key={data.comment.comment_id}
                data={data}
                setCurrentCommentCounts={setCurrentCommentCounts}
              />
            ))}
          </>
        )}
      </Container>
    </section>
  );
};

export default PostPage;
