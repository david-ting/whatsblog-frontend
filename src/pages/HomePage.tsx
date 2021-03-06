import React, { useContext, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import PreviewPost from "../components/PreviewPost";
import { UserContext } from "../customContext/UserContextProvider";
import { getAllPosts } from "../customFunc/asyncRequests/blogPostRequest";
import useObserver from "../customHook/useObserver";

const HomePage: React.FC<{}> = () => {
  const { currentUser } = useContext(UserContext);
  const { loading, results, lastItemRef, end } = useObserver(getAllPosts);
  const promptRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = "Home | Whatsblog";
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function resize() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (promptRef.current === null) return;
        const newSizeX: number =
          promptRef.current.offsetWidth /
          Math.round(promptRef.current.offsetWidth / 15);
        promptRef.current.style.setProperty("--sizeX", newSizeX + "px");

        const newSizeY: number =
          promptRef.current.offsetHeight /
          Math.round(promptRef.current.offsetHeight / 15);
        promptRef.current.style.setProperty("--sizeY", newSizeY + "px");
      }, 300);
    }
    resize();
    window.addEventListener("resize", resize);
    return function () {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <Container className="pt-3">
      <section className="mt-3">
        {!currentUser.loggedIn && (
          <aside
            id="prompt"
            className="jagged-border-container"
            ref={promptRef}
          >
            Want to create your own posts or interact with the community?
            <div>
              <Link to="/log-in" className="themeColor-btn btn white-link m-1">
                Log in
              </Link>
              or
              <Link to="/sign-up" className="themeColor-btn btn white-link m-1">
                Signup
              </Link>
              now !!
            </div>
            <div className="jagged-border-left" />
            <div className="jagged-border-right" />
          </aside>
        )}
        {results.length > 0 &&
          results.map((r, index) => {
            return (
              <div
                className="post-preview-wrapper"
                key={r.post.post_id}
                ref={index === results.length - 1 ? lastItemRef : null}
              >
                <PreviewPost key={r.post.post_id} showAuthor={true} data={r} />
              </div>
            );
          })}
        {loading && (
          <div className="spinner-wrapper">
            <Spinner animation="border" variant="primary" />
          </div>
        )}
        {end && <div className="p-5 text-center">End of Posts</div>}
      </section>
    </Container>
  );
};

export default HomePage;
