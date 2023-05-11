import React, { useState, useEffect } from "react";
import "./watermark.css";

function Watermark() {
  const [image, setImage] = useState(null);
  const [watermarkText, setWatermarkText] = useState("");
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [watermarkedImage, setWatermarkedImage] = useState(null);
  const [watermarkType, setWatermarkType] = useState("text");

  const handleImageUpload = event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleWatermarkType = e => {
    setWatermarkType(e.target.value);
  };

  const handleWatermarkText = e => {
    setWatermarkText(e.target.value);
  };

  const handleWatermarkImage = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setWatermarkImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

useEffect(() => {
  if (watermarkType === "text") {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      ctx.font = "bold 4rem Arial";
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.textAlign = "center";
      const x = canvas.width / 2;
      const y = canvas.height - 50;
      ctx.fillText(watermarkText, x, y);
      const watermarkedUrl = canvas.toDataURL();
      setWatermarkedImage(watermarkedUrl);
    };
  } else {
    const canvas = document.createElement("canvas");
    const img = new Image();
    const overlayImage = new Image();
    img.src = image;
    overlayImage.src = watermarkImage;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const overlayWidth = 100;
      const overlayHeight =
        (overlayWidth / overlayImage.width) * overlayImage.height;
      const overlayX = (canvas.width - overlayWidth) / 2;
      const overlayY = canvas.height - overlayHeight - 50;
      ctx.drawImage(
        overlayImage,
        overlayX,
        overlayY,
        overlayWidth,
        overlayHeight
      );
      const watermarkedUrl = canvas.toDataURL();
      setWatermarkedImage(watermarkedUrl);
    };
  }
}, [image, watermarkText, watermarkImage, watermarkType]);


  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = watermarkedImage;
    link.download = "watermarked-image.jpg";
    link.click();
  };

  return (
    <div className="watermark-container">
      <h1>Watermark your image</h1>
      <form className="form-control" onSubmit={e => e.preventDefault()}>
        <div className="input-container">
          <label htmlFor="image">Upload Image:</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        <div className="radio-group">
          <p>Select watermark type</p>
          <label>
            <input
              type="radio"
              name="text"
              value="text"
              checked={watermarkType === "text"}
              onClick={handleWatermarkType}
            />
            Text
          </label>

          <label>
            <input
              type="radio"
              name="image"
              value="image"
              checked={watermarkType === "image"}
              onClick={handleWatermarkType}
            />
            Image
          </label>
        </div>

        {watermarkType === "text" ? (
          <div className="input-container">
            <label htmlFor="text">Watermark text:</label>
            <input
              id="text"
              type="text"
              onChange={handleWatermarkText}
              value={watermarkText}
              placeholder="Watermark text"
            />
          </div>
        ) : (
          <div className="input-container">
            <label htmlFor="image">Watermark image:</label>
            <input
              id="watermark-image"
              type="file"
              accept="image/*"
              onChange={handleWatermarkImage}
            />
          </div>
        )}
      </form>

      {image && watermarkType === "text" && watermarkText && (
        <button className="download-btn" onClick={handleDownload}>
          Download
        </button>
      )}
      {image && watermarkType === "image" && watermarkImage && (
        <button className="download-btn" onClick={handleDownload}>
          Download
        </button>
      )}
    </div>
  );
}

export default Watermark;
