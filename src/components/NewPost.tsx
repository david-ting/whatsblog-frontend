import { convertToRaw, EditorState } from "draft-js";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { addPost } from "../customFunc/asyncRequests/blogPostRequest";
import {
  Button,
  Col,
  Dropdown,
  DropdownButton,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Spinner,
  Alert,
} from "react-bootstrap";
import RichEditor from "./RichEditor";
import ImageModal from "../components/ImageModal";
import useAlert from "../customHook/useAlert";
import { blogTypes } from "../constants";

const NewPost: React.FC<{}> = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [croppedPicDataURL, setCroppedPicDataURL] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [blogType, setBlogType] = useState("Others");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const history = useHistory();
  const { showAlert, dispatchShowAlert } = useAlert();

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    setShowSpinner(true);
    addPost({
      title,
      description,
      headerImageData: croppedPicDataURL,
      blog_type: blogType,
      content: rawContent,
    })
      .then((res) => {
        setShowSpinner(false);
        if (res.status === 200) history.push(`/post/${res.data.post_id}`);
        else {
          throw new Error(res.data.message);
        }
      })
      .catch((err) => {
        setShowSpinner(false);
        dispatchShowAlert({
          type: "SHOW",
          variant: "danger",
          content: "something went wrong",
        });
        console.error(err);
      });
  };
  return (
    <section className="overlay-spinner-wrapper">
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
        <FormGroup>
          <FormLabel>Title</FormLabel>
          <FormControl
            type="text"
            placeholder="title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Description</FormLabel>
          <FormControl
            type="text"
            placeholder="description"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            required
          />
        </FormGroup>
        <Form.Row>
          <Col xs={12} md={6}>
            <h6 className="d-flex align-items-center">
              Header Image{" "}
              <Button
                className="themeColor-btn ml-2"
                onClick={() => setShowImageModal(true)}
              >
                {croppedPicDataURL ? "Modify / Upload" : "Upload"}
              </Button>
            </h6>
            {croppedPicDataURL && (
              <img
                className="blog-preview-image"
                alt="blog_preview"
                src={croppedPicDataURL}
              ></img>
            )}

            <ImageModal
              show={showImageModal}
              setShow={setShowImageModal}
              setCroppedPicDataURL={setCroppedPicDataURL}
              initialCrop={{
                unit: "%",
                width: 15,
                aspect: 16 / 9,
              }}
              canvasWrapperClass="canvas-header-image-wrapper"
            />
          </Col>
          <Col xs={12} md={6} className="mt-2 mt-md-0">
            <h6 className="d-flex align-items-center">
              <span className="mr-2">categories</span>
              <DropdownButton title={blogType} className="themeColor-dropdown">
                {" "}
                {blogTypes.map((type, i) => [
                  <Dropdown.Item
                    eventKey={i.toString()}
                    active={type === blogType}
                    onClick={() => {
                      setBlogType(type);
                    }}
                  >
                    {type}
                  </Dropdown.Item>,
                ])}
              </DropdownButton>
            </h6>
          </Col>
        </Form.Row>
        <h5 className="mt-3">Body</h5>
        <RichEditor editorState={editorState} setEditorState={setEditorState} />
        <Button className="themeColor-btn mt-3" type="submit">
          Submit
        </Button>
      </Form>
    </section>
  );
};

export default NewPost;
