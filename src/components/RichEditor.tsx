import React from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { uploadImageToServer } from "../customFunc/asyncRequests/otherRequests";

const RichEditor: React.FC<{
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}> = ({ editorState, setEditorState }) => {
  const uploadImageCallBack = async (file: File) => {
    let imageURL: string;
    const res = await uploadImageToServer(file);
    if (res.status === 200) {
      imageURL = res.data.url;
    } else {
      throw new Error("image cannot be uploaded");
    }

    const imageObject = {
      file: file,
      src: imageURL,
    };
    return { data: { link: imageObject.src } };
  };

  return (
    <Editor
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      editorClassName="editor-wrapper"
      onEditorStateChange={(newEditorState) => setEditorState(newEditorState)}
      toolbar={{
        image: { uploadCallback: uploadImageCallBack },
      }}
    />
  );
};

export default RichEditor;
