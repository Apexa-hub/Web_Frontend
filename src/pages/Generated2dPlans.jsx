import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "../styles/generated2dPlans.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const ViewImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const storedAuth = localStorage.getItem("auth") === "true";

  useEffect(() => {
    axios
      .get("http://localhost:8081/get-room-split-images", { withCredentials: true })
      .then((response) => {
        console.log(response);
        setImages(response.data.images);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
        toast.error("Error fetching images");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!storedAuth) {
      navigate("/signin");
    }
  }, [storedAuth, navigate]);

  if (!storedAuth) {
    return null;
  }

  return (
    <div className="floor-plans-2d">
      <Header />
      <div className="view-images-container">
        <ToastContainer />
        <h2>Generated Floor Plan</h2>

        {loading ? (
          <p>Loading images...</p>
        ) : (
          <div className="image-grid">
            {images.length > 0 ? (
              <div className="image-card">
                <img
                  src={`data:image/png;base64,${images[0].image_data}`}
                  alt={`Image 1`}
                  className="image-thumbnail"
                />
              </div>
            ) : (
              <p>No images found.</p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ViewImages;
