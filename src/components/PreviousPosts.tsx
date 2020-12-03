import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { getOwnPosts } from "../customFunc/asyncRequests/blogPostRequest";
import PreviewPost from "./PreviewPost";

const PreviousPosts: React.FC<{}> = () => {
  const [ownPosts, setOwnPosts] = useState<{
    data: { [keys: string]: any }[];
    loading: boolean;
  }>({ data: [], loading: true });

  useEffect(() => {
    getOwnPosts()
      .then((res) => {
        if (res.status === 200) {
          setOwnPosts({ data: res.data, loading: false });
        } else {
          console.error(res.data.message);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {ownPosts.loading && (
        <div className="spinner-wrapper">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      {!ownPosts.loading && (
        <>
          {ownPosts.data.length === 0 ? (
            <h3>Opps, you haven't created any posts yet.</h3>
          ) : (
            ownPosts.data.map((data) => {
              return (
                <PreviewPost
                  key={data.post.post_id}
                  showAuthor={false}
                  data={data}
                ></PreviewPost>
              );
            })
          )}
        </>
      )}
    </div>
  );
};

export default PreviousPosts;
