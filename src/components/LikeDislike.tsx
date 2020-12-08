import React, { useContext, useState } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { UserContext } from "../customContext/UserContextProvider";
import { likeDislikePost } from "../customFunc/asyncRequests/blogPostRequest";

const LikeDislike: React.FC<{
  initialState: {
    likeCounts: number;
    dislikeCounts: number;
    currentIsLike: boolean;
  };
  post_id: number;
}> = ({ initialState, post_id }) => {
  const { currentUser } = useContext(UserContext);
  const [likeCounts, setLikeCounts] = useState(initialState.likeCounts);
  const [dislikeCounts, setDislikeCounts] = useState(
    initialState.dislikeCounts
  );
  const [currentIsLike, setCurrentIsLike] = useState(
    initialState.currentIsLike
  );

  const likeDislikeHandler = (is_like: boolean) => {
    likeDislikePost(is_like, post_id)
      .then((res) => {
        if (res.status === 200) {
          setCurrentIsLike(is_like);
          setLikeCounts(res.data.like_counts);
          setDislikeCounts(res.data.dislike_counts);
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
      {" "}
      <AiFillLike
        style={{ cursor: "pointer" }}
        size={"19.2px"}
        fill={currentUser.loggedIn && currentIsLike ? "green" : "gray"}
        onClick={
          currentUser.loggedIn && currentIsLike === null
            ? () => likeDislikeHandler(true)
            : () => {}
        }
      />
      <span className="mr-2">{likeCounts}</span>
      <AiFillDislike
        style={{ cursor: "pointer" }}
        size={"19.2px"}
        fill={currentUser.loggedIn && currentIsLike === false ? "red" : "gray"}
        onClick={
          currentUser.loggedIn && currentIsLike === null
            ? () => likeDislikeHandler(false)
            : () => {}
        }
      />
      <span className="mr-4">{dislikeCounts}</span>
    </>
  );
};

export default LikeDislike;
