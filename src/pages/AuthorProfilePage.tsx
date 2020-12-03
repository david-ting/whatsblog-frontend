import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import { getAuthorProfile } from "../customFunc/asyncRequests/otherRequests";
import PreviewPost from "../components/PreviewPost";
import DefaultProfileIcon from "../components/DefaultProfileIcon";

const AuthorProfilePage: React.FC<{}> = () => {
  const [user, setUser] = useState<{ [keys: string]: string }>({});
  const [posts, setPosts] = useState<{
    data: { [keys: string]: any }[];
    loading: boolean;
  }>({ data: [], loading: true });
  const { user_id } = useParams<{ user_id: string }>();

  useEffect(() => {
    getAuthorProfile(parseInt(user_id))
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          setUser(res.data.user);
          setPosts({ data: res.data.posts, loading: false });
        } else {
          console.error(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [user_id]);

  return (
    <section id="user-profile-container">
      <Container>
        {Object.keys(user).length > 0 && (
          <div id="user-profile-top">
            <div>
              {user.profile_url ? (
                <img src={user.profile_url} alt="profile"></img>
              ) : (
                <DefaultProfileIcon size={80} name={user.name} />
              )}

              <b>{user.name}</b>
            </div>
            <i>{user.email}</i>
          </div>
        )}
        {posts.loading && (
          <div className="spinner-wrapper">
            <Spinner animation="border" variant="primary" />
          </div>
        )}
        {!posts.loading && (
          <div>
            {posts.data.length === 0 ? (
              <h3>the user has not created any posts yet.</h3>
            ) : (
              posts.data.map((data) => (
                <PreviewPost
                  key={data.post.post_id}
                  showAuthor={false}
                  data={data}
                ></PreviewPost>
              ))
            )}
          </div>
        )}
      </Container>
    </section>
  );
};

export default AuthorProfilePage;
