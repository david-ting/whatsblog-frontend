import React, { useContext, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import ChangePassword from "../components/ChangePassword";
import ChangeProfile from "../components/ChangeProfile";
import { UserContext } from "../customContext/UserContextProvider";

const UserSettingPage: React.FC<{}> = () => {
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    document.title = "User Setting | Whatsblog";
  }, []);

  return currentUser.loggedIn ? (
    <section id="user-setting-container">
      <Container>
        <h3>User Setting</h3>
        <Row>
          <Col xs={{ order: 2, span: 12 }} md={{ order: 1, span: 6 }}>
            <div>Username: {currentUser.name}</div>
            <div>Email: {currentUser.email}</div>
            <ChangePassword />
          </Col>
          <Col xs={{ order: 1, span: 12 }} md={{ order: 2, span: 6 }}>
            <ChangeProfile />
          </Col>
        </Row>
      </Container>
    </section>
  ) : (
    <></>
  );
};

export default UserSettingPage;
