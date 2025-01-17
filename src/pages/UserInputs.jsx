import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/userInput.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function App() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    number_of_room: "",
    land_width: "",
    land_length: "",
    floor_angle: "0",
  });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const storedAuth = localStorage.getItem("auth") === "true";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/get-all-user-inputs",
        {
          withCredentials: true,
        }
      );
      showToast("success", "Fetched data:");
      setData(response.data);
    } catch (error) {
      console.log(
        "Error fetching data:",
        error.response?.data || error.message
      );
      showToast("error", error.response?.data?.error || "Failed to fetch data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "number_of_room" && value > 10) {
      showToast("error", "Number of rooms cannot exceed 10");
      return;
    }
    if (name === "number_of_room" && value < 0) {
      showToast("error", "Enter correct value");
      return;
    }
    if (name === "land_width" && value < 0) {
      showToast("error", "Enter correct value");
      return;
    }
    if (name === "land_length" && value < 0) {
      showToast("error", "Enter correct value");
      return;
    }
    if (name === "land_width" && value > 50) {
      showToast("error", "Width cannot exceed 50 Feet");
      return;
    }
    if (name === "land_length" && value > 50) {
      showToast("error", "Length cannot exceed 50 Feet");
      return;
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8081/user-inputs",
        {
          number_of_room: formData.number_of_room,
          land_width: formData.land_width,
          land_length: formData.land_length,
          floor_angle: formData.floor_angle,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        console.log("New property added:", response.data);
        fetchData();
        showToast("success", "Property added successfully!");
        setFormData({
          number_of_room: "",
          land_width: "",
          land_length: "",
          floor_angle: "0",
        });
        setSubmitted(true); // Set submitted to true on successful form submission
      }
    } catch (error) {
      console.error(
        "Error adding property:",
        error.response?.data || error.message
      );
      showToast(
        "error",
        error.response?.data?.error || "Failed to add property"
      );
    }
  };

  const handleGenerate2DPlan = () => {
    navigate("/uploadImagePage");
  };

  const showToast = (type, message) => {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  useEffect(() => {
    if (!storedAuth) {
      navigate("/signin");
    }
  }, [storedAuth, navigate]);

  if (!storedAuth) {
    return null;
  }

  return (
    <div className="user-input-container">
      <Header />
      <div className="container">
        <h2>Add your plan data</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Number of Rooms (Only bed rooms you want):
            <input
              type="number"
              name="number_of_room"
              value={formData.number_of_room}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Land Width (by Feet):
            <input
              type="number"
              name="land_width"
              value={formData.land_width}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Land Length (by Feet):
            <input
              type="number"
              name="land_length"
              value={formData.land_length}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Land Angle (Have or Not):
            <select
              name="floor_angle"
              value={formData.floor_angle}
              onChange={handleChange}
              required
            >
              <option value="0">0</option>
              <option value="1">1</option>
            </select>
          </label>
          <button type="submit">Submit</button>
          {submitted && (
            <button type="button" onClick={handleGenerate2DPlan}>
              Next Step
            </button>
          )}
        </form>

        <h2>Your Entered Data</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Rooms</th>
                <th>Land Width</th>
                <th>Land Length</th>
                <th>Land Angle</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i}>
                  <td>{d.input_id}</td>
                  <td>{d.number_of_room}</td>
                  <td>{d.land_width}</td>
                  <td>{d.land_length}</td>
                  <td>{d.floor_angle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
