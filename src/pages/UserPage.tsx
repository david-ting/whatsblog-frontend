import React, { useEffect } from "react";
import { Container, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import NewPost from "../components/NewPost";
import PreviousPosts from "../components/PreviousPosts";

const UserPage: React.FC<{}> = () => {
  const pathname = useLocation().pathname;

  useEffect(() => {
    document.title = "Manage Posts | Whatsblog";
  }, []);

  return (
    <section className="new-post-container py-5">
      <Container>
        <Nav fill variant="tabs" className="mb-2">
          <Nav.Item style={{ flexGrow: 0 }}>
            <Link
              to="/user/new_post"
              className={`nav-link ${
                pathname === "/user/new_post" ? "active" : ""
              }`}
            >
              New Post
            </Link>
          </Nav.Item>
          <Nav.Item style={{ flexGrow: 0 }}>
            <Link
              to="/user/previous_posts"
              className={`nav-link ${
                pathname === "/user/previous_posts" ? "active" : ""
              }`}
            >
              Previous Posts
            </Link>
          </Nav.Item>
        </Nav>
        {pathname === "/user/new_post" && <NewPost />}
        {pathname === "/user/previous_posts" && <PreviousPosts />}
      </Container>
    </section>
  );
};

export default UserPage;
