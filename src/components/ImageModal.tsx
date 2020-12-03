import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { convertImageToBase64 } from "../customFunc/helperFunc";

const pixelRatio = window.devicePixelRatio || 1;

const ImageModal: React.FC<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setCroppedPicDataURL: React.Dispatch<React.SetStateAction<string>>;
  initialCrop: { unit: "px" | "%"; width: number; aspect: number };
  canvasWrapperClass: string;
}> = ({
  show,
  setShow,
  setCroppedPicDataURL,
  initialCrop,
  canvasWrapperClass,
}) => {
  const closeHandler = () => setShow(false);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop] = useState<Crop>(initialCrop);
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);

  const [uploadedPicDataURL, setUploadedPicDataURL] = useState("");

  const saveCanvasHandler = () => {
    if (previewCanvasRef && previewCanvasRef.current) {
      setCroppedPicDataURL(previewCanvasRef.current.toDataURL());
    }
  };

  const uploadImageHandler = async (event: any) => {
    const file = event.target.files[0];
    try {
      const dataURL = await convertImageToBase64(file);
      setUploadedPicDataURL(dataURL as string);
    } catch (err) {
      console.error(err);
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = (imgRef.current as unknown) as HTMLImageElement;
    const canvas = (previewCanvasRef.current as unknown) as HTMLCanvasElement;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    if (
      crop.x === undefined ||
      crop.y === undefined ||
      crop.width === undefined ||
      crop.height === undefined
    ) {
      return;
    }
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }, [completedCrop]);

  return (
    <Modal show={show} onHide={closeHandler}>
      <Modal.Body>
        <h4>Upload and Crop the Image</h4>
        {uploadedPicDataURL === "" ? (
          <p>please select an image to upload......</p>
        ) : (
          <div className="">
            <ReactCrop
              src={uploadedPicDataURL}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
            />
            <div className={canvasWrapperClass}>
              <canvas ref={previewCanvasRef} />
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <input type="file" onChange={uploadImageHandler}></input>
        <div>
          {uploadedPicDataURL && (
            <Button
              variant="primary"
              className="mr-2"
              onClick={() => {
                saveCanvasHandler();
                closeHandler();
              }}
            >
              Save
            </Button>
          )}
          <Button variant="secondary" onClick={closeHandler}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageModal;
