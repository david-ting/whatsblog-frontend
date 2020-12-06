import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../customContext/UserContextProvider";
import DefaultProfileIcon from "./DefaultProfileIcon";
import { updateUserProfileURL } from "../customFunc/asyncRequests/authRequests";
import ImageModal from "../components/ImageModal";
import { Button, FormGroup, FormLabel, Spinner, Alert } from "react-bootstrap";
import useAlert from "../customHook/useAlert";

const ChangeProfile: React.FC<{}> = () => {
  const { showAlert, dispatchShowAlert } = useAlert();
  const [showSpinner, setShowSpinner] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [croppedPicDataURL, setCroppedPicDataURL] = useState("");
  const { currentUser, dispatchCurrentUser } = useContext(UserContext);

  const existingProfilePic = !currentUser.loggedIn ? null : currentUser.profile_url ? (
    <img src={currentUser.profile_url} alt="profile"></img>
  ) : (
    <DefaultProfileIcon name={currentUser.name} size={100}></DefaultProfileIcon>
  );

  useEffect(() => {
    if (croppedPicDataURL !== "") {
      setShowSpinner(true);
      updateUserProfileURL(croppedPicDataURL)
        .then((res) => {
          if (res.status === 200) {
            setShowSpinner(false);
            dispatchCurrentUser({
              type: "UPDATE",
              payload: {
                profile_url: res.data.profile_url,
              },
            });
            dispatchShowAlert({
              type: "SHOW",
              variant: "success",
              content: "profile picture updated successfully",
            });
            localStorage.setItem("profile_url", res.data.profile_url);
          } else {
            throw new Error(res.data.message);
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
    }
  }, [croppedPicDataURL, dispatchCurrentUser, dispatchShowAlert]);

  return (
    <FormGroup>
      <FormLabel className="d-flex align-center">
        Profile Picture{" "}
        {showSpinner && (
          <Spinner animation="border" variant="primary" className="ml-2" />
        )}
      </FormLabel>
      <Alert
        show={showAlert.show}
        variant={showAlert.variant}
        onClose={() => dispatchShowAlert({ type: "HIDE" })}
        dismissible
      >
        {showAlert.content}
      </Alert>
      <div id="sign-up-form-profile-pic-wrapper">
        {croppedPicDataURL.length > 0 ? (
          <img src={croppedPicDataURL} alt="uploaded profile"></img>
        ) : (
          existingProfilePic
        )}
      </div>
      <div className="mt-2">
        <Button
          className="themeColor-btn"
          onClick={() => setShowImageModal(true)}
        >
          {croppedPicDataURL.length > 0 ? "Modify / Upload" : "Upload"}
        </Button>
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
  );
};

export default ChangeProfile;
