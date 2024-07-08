import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./UserDetails.css";

import UserDetailsHeader from "./userDetailsHeader";

import ConfirmationDialog from "./ConfirmationDialog";

export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      images: [],  // Add state to hold images
      image: null,  // Add state to hold the image to be uploaded
      showConfirmationDialog: false,
      selectedImageId: null,
    };
  }

  componentDidMount() {
    const token = window.localStorage.getItem("token");

    if (!token) {
      alert("No token found, please log in.");
      window.location.href = "./sign-in";
      return;
    }

    fetch("http://localhost:5000/userData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data === "Token Expired") {
          alert("Token Expired - Log In Again");
          window.localStorage.clear();
          window.location.href = "./sign-in";
        } else {
          this.setState({ userData: data.data });
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        alert("An error occurred while fetching user data.");
      });

      setTimeout(() => {
        const userdata = {
          fname: this.state.fname, // Replace with actual data fetched from API
          email: this.state.email,
        };
        this.setState({ userdata });
      }, 1000); // Simulating delay for fetching data

       // Fetch user's images
       this.fetchUserImages(token);
  }

  fetchUserImages(token) {
    fetch("http://localhost:5000/getUserImages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          this.setState({ images: data.data });
        } else {
          alert("Failed to fetch images");
        }
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
        alert("An error occurred while fetching images.");
      });
  }

  logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };

  handleUpload = (event) => {
    this.setState({ image: event.target.files[0] });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const token = window.localStorage.getItem("token");
    if (!token) {
      alert("No token found, please log in.");
      window.location.href = "./sign-in";
      return;
    }

    const formData = new FormData();
    formData.append("image", this.state.image);
    formData.append("token", token);

    fetch("http://localhost:5000/uploadImage", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          alert("Image uploaded successfully");
          // Optionally, you can update the state or perform any other actions
          // Fetch the updated images
          this.fetchUserImages(token);
        } else {
          alert("Failed to upload image");
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        alert("An error occurred while uploading the image.");
      });
  };

  handleImageClick = (imageId) => {
    this.setState({
      showConfirmationDialog: true,
      selectedImageId: imageId,
    });
  };

  handleCloseDialog = () => {
    this.setState({
      showConfirmationDialog: false,
      selectedImageId: null,
    });
  };

  handleDeleteImage = () => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      alert("No token found, please log in.");
      window.location.href = "./sign-in";
      return;
    }

    fetch(`http://localhost:5000/deleteImage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ token, imageId: this.state.selectedImageId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          this.setState((prevState) => ({
            images: prevState.images.filter((image) => image._id !== prevState.selectedImageId),
          }));
          this.handleCloseDialog();
          alert("Image deleted successfully");
        } else {
          alert("Failed to delete image");
        }
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
        alert("An error occurred while deleting the image.");
      });
  };

  handlePerformOCR = () => {
    window.open(`/perform-ocr/${this.state.selectedImageId}`, "_blank");
    this.handleCloseDialog();
  };

  
  render() {
    const { userData, images, showConfirmationDialog  } = this.state;

    return (
      <div>
        {/* Pass userData and logOut function as props to UserDetailsHeader */}
        <UserDetailsHeader userdata={this.state.userData} logout={this.logOut} />
        
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              {/* Sidebar with user images */}
              <div className="user-images">
                <h3>Your Images</h3>
                <ul className="list-group">
                  {images.map((image) => (
                    <li
                      key={image._id}
                      className="list-group-item"
                      onClick={() => this.handleImageClick(image._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={`http://localhost:5000/${image.imagePath}`}
                        alt="User Upload"
                        className="img-thumbnail"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-md-9">
              <h2>Welcome, {userData ? userData.fname : "User"}!</h2>
              <p>Email: {userData ? userData.email : "-"}</p>

              {/* Upload form */}
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="imageUpload">Upload Image</label>
                  <input
                    type="file"
                    className="form-control-file"
                    id="imageUpload"
                    onChange={this.handleUpload}
                  />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  Upload
                </button>
              </form>
            </div>
          </div>
        </div>
        {showConfirmationDialog && (
          <ConfirmationDialog
            onDelete={this.handleDeleteImage}
            onPerformOCR={this.handlePerformOCR}
            onClose={this.handleCloseDialog}
          />
        )}
      </div>
    );
  }

}
