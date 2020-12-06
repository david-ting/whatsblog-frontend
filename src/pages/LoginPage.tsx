import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import useAlert from "../customHook/useAlert";
import { loginUser } from "../customFunc/asyncRequests/authRequests";
import { ButtonGroup, Spinner } from "react-bootstrap";
import { UserContext } from "../customContext/UserContextProvider";

const LoginPage: React.FC<{}> = () => {
  const { dispatchCurrentUser } = useContext(UserContext);
  const [key, setKey] = useState<"email" | "name">("email");
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const { showAlert, dispatchShowAlert } = useAlert();
  const [showSpinner, setShowSpinner] = useState(false);

  const changeKey = (newKey: "email" | "name") => {
    if (newKey === key) {
      return;
    } else {
      setKey(newKey);
      setIdentity("");
    }
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowSpinner(true);
    loginUser(key, identity, password)
      .then((res) => {
        setShowSpinner(false);
        if (res.status === 200) {
          dispatchCurrentUser({
            type: "LOG-IN",
            payload: {
              name: res.data.name,
              email: res.data.email,
              profile_url: res.data.profile_url,
            },
          });
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("name", res.data.name);
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("profile_url", res.data.profile_url);
        } else {
          dispatchShowAlert({
            type: "SHOW",
            variant: "danger",
            content: res.data.message,
          });
        }
      })
      .catch((err) => {
        setShowSpinner(false);
        console.error(err);
      });
  };

  useEffect(() => {
    document.title = "Login | Whatsblog";
  }, []);

  return (
    <section id="login-form">
      <div>
        <h3>
          LOGIN{" "}
          {showSpinner && <Spinner animation="border" variant="primary" />}
        </h3>
        <Alert
          show={showAlert.show}
          variant={showAlert.variant}
          onClose={() => dispatchShowAlert({ type: "HIDE" })}
          dismissible
        >
          {showAlert.content}
        </Alert>

        <Form onSubmit={submitHandler}>
          <ButtonGroup>
            <Button
              className={key === "email" ? "themeColor-btn" : "btn-secondary"}
              onClick={() => changeKey("email")}
            >
              Email
            </Button>
            <Button
              className={key === "name" ? "themeColor-btn" : "btn-secondary"}
              onClick={() => changeKey("name")}
            >
              Name
            </Button>
          </ButtonGroup>

          <Form.Group>
            <Form.Label>
              {key === "email" ? "Email address" : "User name"}
            </Form.Label>
            <Form.Control
              type={key}
              placeholder={`Enter ${key}`}
              value={identity}
              onChange={(event) => {
                setIdentity(event.target.value);
              }}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              required
            />
          </Form.Group>

          <Form.Group className="mt-4">
            <Button className="themeColor-btn" type="submit">
              Login
            </Button>
            <Link to="/sign-up" className="ml-2" style={{ color: "gray" }}>
              <i>or sign up</i>
            </Link>
          </Form.Group>
        </Form>
      </div>
    </section>
  );
};

export default LoginPage;
