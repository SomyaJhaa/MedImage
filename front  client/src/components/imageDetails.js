import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './ImageDetails.css';

class ImageDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      ocrText: '',
      totalExtraCharged: 0,
    };
  }

  componentDidMount() {
    const { imageId } = this.props.match.params;
    const token = window.localStorage.getItem('token');

    if (!token) {
      alert('No token found, please log in.');
      window.location.href = './sign-in';
      return;
    }

    fetch('http://localhost:5000/getImageDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ imageId, token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          this.setState({
            image: data.image,
            ocrText: data.image.ocrText,
            totalExtraCharged: data.totalExtraCharged,
          });
        } else {
          alert('Failed to fetch image details');
        }
      })
      .catch((error) => {
        console.error('Error fetching image details:', error);
        alert('An error occurred while fetching image details.');
      });
  }

  render() {
    const { image, ocrText, totalExtraCharged } = this.state;

    return (
      <div className="image-details-container">
        {image ? (
          <>
            <img
              src={`http://localhost:5000/${image.imagePath}`}
              alt="User Upload"
              className="img-thumbnail"
            />
            <div className="ocr-text">
              <h3>OCR Text</h3>
              <pre>{ocrText}</pre>
            </div>
            <div className="extra-charge">
              <h3>Total Extra Charged</h3>
              <p>${totalExtraCharged}</p>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
}

export default withRouter(ImageDetails);
