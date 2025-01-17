import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";
import "../styles/UploadImagePage.css";

function UploadImagePage() {
  const navigate = useNavigate();
  const storedAuth = localStorage.getItem("auth") === "true";

  useEffect(() => {
    if (!storedAuth) {
      navigate("/signin");
    }
  }, [storedAuth, navigate]);

  if (!storedAuth) {
    return null;
  }

  return (
    <div className="upload-image-page">
      <div className="upload-form">
        <ImageUpload />
      </div>
    </div>
  );
}

export default UploadImagePage;
