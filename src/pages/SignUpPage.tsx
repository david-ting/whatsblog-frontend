import React, { useState, useContext } from "react";
import { signUpUser } from "../customFunc/asyncRequests/authRequests";
import useAlert from "../customHook/useAlert";
import {
  Alert,
  Container,
  FormGroup,
  FormLabel,
  Form,
  FormControl,
  Col,
  Button,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ImageModal from "../components/ImageModal";
import { UserContext } from "../customContext/UserContextProvider";
import PasswordRequirements from "../components/PasswordRequirements";
import usePassword from "../customHook/usePassword";

const SignUpPage: React.FC<{}> = () => {
  const { dispatchCurrentUser } = useContext(UserContext);
  const { showAlert, dispatchShowAlert } = useAlert();
  const [name, setName] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);

  const [croppedPicDataURL, setCroppedPicDataURL] = useState("");
  const [email, setEmail] = useState("");
  const { password, setPassword, passwordRules } = usePassword();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      dispatchShowAlert({
        type: "SHOW",
        variant: "danger",
        content: "password is not matched",
      });
      return;
    }
    if (passwordRules.some((rule) => rule === false)) {
      dispatchShowAlert({
        type: "SHOW",
        variant: "danger",
        content: "password rules are not fulfilled",
      });
      return;
    }

    setShowSpinner(true);
    signUpUser({
      name,
      email,
      password,
      profileData: croppedPicDataURL,
    })
      .then((res) => {
        setShowSpinner(false);
        if (res.status === 200) {
          dispatchCurrentUser({
            type: "LOG-IN",
            payload: {
              name: res.data.user.name,
              email: res.data.user.email,
              profile_url: res.data.user.profile_url,
            },
          });
        } else {
          dispatchShowAlert({
            type: "SHOW",
            variant: "danger",
            content: res.data.message,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <section id="sign-up-form">
      <Container className="pt-3 overlay-spinner-wrapper">
        <h3>SIGN UP</h3>
        {showSpinner && (
          <div className="spinner spinner-large">
            <Spinner animation="border" variant="primary" />
          </div>
        )}
        <Alert
          show={showAlert.show}
          variant={showAlert.variant}
          onClose={() => dispatchShowAlert({ type: "HIDE" })}
          dismissible
        >
          {showAlert.content}
        </Alert>
        <Form onSubmit={submitHandler}>
          <Form.Row>
            <Col>
              <FormGroup>
                <FormLabel>Name</FormLabel>
                <FormControl
                  type="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  required
                ></FormControl>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <FormLabel>Profile Picture</FormLabel>
                <div id="sign-up-form-profile-pic-wrapper">
                  {croppedPicDataURL.length > 0 ? (
                    <img src={croppedPicDataURL} alt="uploaded profile"></img>
                  ) : (
                    <img
                      src="https://res.cloudinary.com/dmskcaysu/image/upload/v1605941797/user_icons/default_lopyxz.png"
                      alt="default profile"
                    ></img>
                  )}
                </div>
                <div className="mt-2">
                  <Button
                    className="themeColor-btn"
                    onClick={() => setShowImageModal(true)}
                  >
                    {croppedPicDataURL.length > 0
                      ? "Modify / Upload"
                      : "Upload"}
                  </Button>
                  {croppedPicDataURL.length > 0 && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setCroppedPicDataURL("");
                      }}
                    >
                      Default
                    </Button>
                  )}
                </div>
                <ImageModal
                  show={showImageModal}
                  setShow={setShowImageModal}
                  setCroppedPicDataURL={setCroppedPicDataURL}
                  initialCrop={{
                    unit: "px",
                    width: 100,
                    aspect: 1 / 1,
                  }}
                  canvasWrapperClass="canvas-profile-icon-wrapper"
                />
              </FormGroup>
            </Col>
          </Form.Row>
          <FormGroup>
            <FormLabel>Email Address</FormLabel>
            <FormControl
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              required
            ></FormControl>
          </FormGroup>

          <Form.Row>
            <Col className="d-flex flex-column justify-content-end">
              <FormGroup className="mb-0">
                <FormLabel>Password</FormLabel>
                <FormControl
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  required
                  autoComplete="off"
                ></FormControl>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="mb-0">
                <FormLabel>Confirm password</FormLabel>
                <FormControl
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                  }}
                  required
                  autoComplete="off"
                ></FormControl>
              </FormGroup>
            </Col>
            <Col xs={12} className="mt-2">
              <PasswordRequirements
                password={password}
                passwordRules={passwordRules}
              />
            </Col>
          </Form.Row>
          <Form.Group className="mt-4 d-flex align-items-center">
            <Button className="mt-2 themeColor-btn" type="submit">
              Sign up
            </Button>
            <Link to="/log-in" className="ml-2" style={{ color: "gray" }}>
              <i>or login</i>
            </Link>
          </Form.Group>
        </Form>
      </Container>
    </section>
  );
};

export default SignUpPage;
