import standardRequest from "./standardRequest";

const HOST_URL = process.env.REACT_APP_HOST_URL;

export const addPost = (newPost: {
  title: string;
  description: string;
  headerImageData: string;
  blog_type: string;
  content: any;
}) => {
  const path = `${HOST_URL}/post/add`;
  const options: RequestInit = {
    method: "POST",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  };
  return standardRequest(path, options);
};

export const getPost = (post_id: number) => {
  const path = `${HOST_URL}/post/get_by_post_id/${post_id}`;
  const options: RequestInit = {
    method: "GET",
    credentials: "include",
    mode: "cors",
  };
  return standardRequest(path, options);
};

export const getOwnPosts = () => {
  const path = `${HOST_URL}/post/get_own_posts`;
  const options: RequestInit = {
    method: "GET",
    credentials: "include",
    mode: "cors",
  };
  return standardRequest(path, options);
};

export const likeDislikePost = (is_like: boolean, post_id: number) => {
  const path = `${HOST_URL}/like_dislike/add`;
  const options: RequestInit = {
    method: "POST",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_like, post_id: post_id }),
  };
  return standardRequest(path, options);
};

export const addComment = (
  post_id: number,
  content: { [keys: string]: any }
) => {
  const path = `${HOST_URL}/comment/add_comment`;
  const options: RequestInit = {
    method: "POST",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ post_id, content }),
  };
  return standardRequest(path, options);
};

export const addReply = (
  post_id: number,
  content: { [keys: string]: any },
  reply_to: number
) => {
  const path = `${HOST_URL}/comment/add_reply`;
  const options: RequestInit = {
    method: "POST",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ post_id, content, reply_to }),
  };
  return standardRequest(path, options);
};

export const getComment = (post_id: number) => {
  const path = `${HOST_URL}/comment/get/${post_id}`;
  const options: RequestInit = {
    method: "GET",
  };
  return standardRequest(path, options);
};

export const getReply = (post_id: number, comment_id: number) => {
  const path = `${HOST_URL}/comment/get_reply/${post_id}/${comment_id}`;
  const options: RequestInit = {
    method: "GET",
  };
  return standardRequest(path, options);
};

export const getAllPosts = (page: number) => {
  const itemsPerPage = 3;

  const path = `${HOST_URL}/post/getAll/${itemsPerPage}/${page}`;
  console.log(path);
  const options: RequestInit = {
    method: "GET",
    credentials: "include",
    mode: "cors",
  };
  return standardRequest(path, options);
};
