import React, { useState, useRef } from "react";
import "./watermark.css";
// import { saveAs } from "file-saver";
// import { Canvas } from "canvas";

function Watermark() {
  const [image, setImage] = useState(null);
  const [watermarkText, setWatermarkText] = useState("");

  const handleImageUpload = event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (image) {
      const canvas = document.createElement("canvas");
      const img = document.createElement("img");
      img.src = image;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        ctx.font = "bold 4rem Arial";
        ctx.fillStyle = "rgba(0, 0, 0, 0.678)";
        ctx.textAlign = "center";
        const x = canvas.width / 2;
        const y = canvas.height - 50;
        ctx.fillText(watermarkText, x, y);
        canvas.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "watermarked-image.jpg";
          link.click();
          URL.revokeObjectURL(url);
        }, "image/jpeg");
      };
    }
  };

  return (
    <div className="watrermark-container">
      <form className="form-control">
        <div className="input-container">
          <label htmlFor="image">Upload Image:</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        <div className="input-container">
          <input
            id="text"
            type="text"
            onChange={e => setWatermarkText(e.target.value)}
            value={watermarkText}
            placeholder="Watermark text"
          />
        </div>
      </form>

      <div className="watermark__preview">
        {image && <img src={image} alt="" />}
        <p className="watermark-text">{watermarkText}</p>
      </div>

      <a className="download-btn" download="image" onClick={handleDownload}>
        Download
      </a>
    </div>
  );
}

export default Watermark;
