import React, { Component } from "react";
import { useParams } from "react-router-dom";
import Tesseract from "tesseract.js";

export default function ImageOperations() {
  const { id } = useParams();
  return <ImageOperationsComponent imageId={id} />;
}

class ImageOperationsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      operations: [],
      ocrText: "",
      loading: false,
    };
  }

  componentDidMount() {
    const { imageId } = this.props;
    const token = window.localStorage.getItem("token");

    fetch("http://localhost:5000/getImageOperations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ imageId, token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          this.setState({ operations: data.data });
        } else {
          alert("Failed to fetch image operations");
        }
      })
      .catch((error) => {
        console.error("Error fetching image operations:", error);
        alert("An error occurred while fetching image operations.");
      });

    // Fetch image details
    fetch("http://localhost:5000/getImageDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ imageId, token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          this.setState({ image: data.data });
        } else {
          alert("Failed to fetch image details");
        }
      })
      .catch((error) => {
        console.error("Error fetching image details:", error);
        alert("An error occurred while fetching image details.");
      });
  }

  handleOcr = () => {
    const { image } = this.state;
    this.setState({ loading: true });

    Tesseract.recognize(`http://localhost:5000/${image.imagePath}`, 'eng')
      .then(({ data: { text } }) => {
        this.setState({ ocrText: text, loading: false });

        // Save the OCR operation
        const { imageId } = this.props;
        const token = window.localStorage.getItem("token");

        fetch("http://localhost:5000/saveImageOperation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            imageId,
            operationType: "OCR",
            operationResult: text,
            token,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "ok") {
              // Update the operations state with the new operation
              this.setState((prevState) => ({
                operations: [...prevState.operations, {
                  type: "OCR",
                  result: text,
                  timestamp: new Date(),
                }],
              }));
            } else {
              alert("Failed to save operation");
            }
          })
          .catch((error) => {
            console.error("Error saving operation:", error);
            alert("An error occurred while saving the operation.");
          });
      })
      .catch((error) => {
        console.error("Error performing OCR:", error);
        alert("An error occurred while performing OCR.");
        this.setState({ loading: false });
      });
  };

  render() {
    const { image, operations, ocrText, loading } = this.state;

    return (
      <div className="container">
        <h2>Image Operations</h2>
        {image && <img src={`http://localhost:5000/${image.imagePath}`} alt="Selected" className="img-fluid" />}
        
        <div className="mt-3">
          <button onClick={this.handleOcr} className="btn btn-primary" disabled={loading}>
            {loading ? "Processing..." : "Convert to Text"}
          </button>
        </div>
        
        {ocrText && (
          <div className="mt-3">
            <h4>OCR Text</h4>
            <p>{ocrText}</p>
          </div>
        )}

        <div className="mt-3">
          <h4>Operations</h4>
          <ul className="list-group">
            {operations.map((operation, index) => (
              <li key={index} className="list-group-item">
                <strong>{operation.type}</strong>: {operation.result} <br />
                <small>{new Date(operation.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
