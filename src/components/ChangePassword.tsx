import React, { useState } from "react";
import {
  Form,
  FormGroup,
  FormControl,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import useAlert from "../customHook/useAlert";
import PasswordRequirements from "../components/PasswordRequirements";
import usePassword from "../customHook/usePassword";
import { updateUserPassword } from "../customFunc/asyncRequests/authRequests";

const ChangePassword: React.FC<{}> = () => {
  const { showAlert, dispatchShowAlert } = useAlert();
  const [currentPassword, setCurrentPassword] = useState("");
  const {
    password: newPassword,
    setPassword: setNewPassword,
    passwordRules,
  } = usePassword();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);

  const changePasswordHandler = () => {
    if (newPassword === "") {
      dispatchShowAlert({
        type: "SHOW",
        variant: "warning",
        content: "No changes detected",
      });
      return;
    }

    if (newPassword !== "" && currentPassword === "") {
      dispatchShowAlert({
        type: "SHOW",
        variant: "danger",
        content: "current password is missing",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      dispatchShowAlert({
        type: "SHOW",
        variant: "danger",
        content: "new password is not matched with confirm password",
      });
      return;
    }

    if (passwordRules.some((r) => r === false)) {
      dispatchShowAlert({
        type: "SHOW",
        variant: "danger",
        content: "The password rules are not fulfilled",
      });
      return;
    }

    // async requests to the server
    setShowSpinner(true);
    updateUserPassword(currentPassword, newPassword)
      .then((res) => {
        setShowSpinner(false);
        if (res.status === 200) {
          dispatchShowAlert({
            type: "SHOW",
            variant: "success",
            content: res.data.message,
          });
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
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
        setShowSpinner(false);
        dispatchShowAlert({
          type: "SHOW",
          variant: "danger",
          content:
            "unable to connect to the server. please check your network or try again later",
        });
      });
  };

  return (
    <>
      <Alert
        show={showAlert.show}
        variant={showAlert.variant}
        onClose={() => dispatchShowAlert({ type: "HIDE" })}
        dismissible
      >
        {showAlert.content}
      </Alert>
      <FormGroup className="overlay-spinner-wrapper">
        {showSpinner && (
          <div className="spinner spinner-large">
            <Spinner animation="border" variant="primary" />
          </div>
        )}
        <FormGroup>
          <Form.Label>Current Password</Form.Label>
          <FormControl
            type="password"
            placeholder="current password"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
            }}
          ></FormControl>
        </FormGroup>

        <FormGroup>
          <Form.Label>New Password</Form.Label>
          <FormControl
            type="password"
            placeholder="new password"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);
            }}
          ></FormControl>
          <PasswordRequirements
            password={newPassword}
            passwordRules={passwordRules}
          />
        </FormGroup>

        <FormGroup>
          <Form.Label>Confirm Password</Form.Label>
          <FormControl
            type="password"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
          ></FormControl>
        </FormGroup>
        <Button className="themeColor-btn mt-3" onClick={changePasswordHandler}>
          Change password
        </Button>
      </FormGroup>
    </>
  );
};

export default ChangePassword;
