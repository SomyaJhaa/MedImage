import React, { Component } from "react";
import { withRouter } from "./withRouter";
import Tesseract from "tesseract.js";

class PerformOCR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageId: null,
      imageUrl: "",
      extractedText: "",
      structuredData: null,
      comparisonResults: null,
      loading: true,
    };
  }

  componentDidMount() {
    const { id } = this.props.router.params;
    this.setState({ imageId: id });

    // Fetch image URL from backend
    fetch(`http://localhost:5000/getImage/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          this.setState({ imageUrl: `http://localhost:5000/${data.data.imagePath}` });
          this.performOCR(data.data.imagePath);
        } else {
          alert("Failed to fetch image data");
        }
      })
      .catch((error) => {
        console.error("Error fetching image data:", error);
        alert("An error occurred while fetching image data.");
      });
  }

  parseOCROutput(ocrOutput) {
    const invoiceSchema = {
      invoiceNumber: "",
      orderDate: "",
      patientInfo: {
        name: "",
        phone: "",
        address: ""
      },
      physicianInfo: {
        name: "",
        phone: "",
        address: ""
      },
      items: [],
      paymentMethod: "",
      totalAmount: ""
    };
    
    const invoice = JSON.parse(JSON.stringify(invoiceSchema)); // Deep copy the schema
    const lines = ocrOutput.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
    lines.forEach((line, index) => {
      if (line.startsWith('INV-')) {
        invoice.invoiceNumber = line.split(' ')[0];
      }
      if (line.includes('Order Date')) {
        invoice.orderDate = line.split('Order Date ')[1];
      }
      if (line.includes('Patient Information')) {
        const patientInfo = lines[index + 1];
        const [patientName, physicianName] = patientInfo.split(' Richard Glenn');
        invoice.patientInfo.name = patientName.trim();
        invoice.physicianInfo.name = 'Richard Glenn';
      }
      if (line.includes('(555)')) {
        const [patientPhone, physicianPhone] = line.split(' ');
        invoice.patientInfo.phone = patientPhone;
        invoice.physicianInfo.phone = physicianPhone;
      }
      if (line.includes('Rosewood Lanesample11')) {
        invoice.patientInfo.address = 'Rosewood Lanesample11, Happy Village, New York, NY, 433545 United States';
      }
      if (line.includes('Medical Supply')) {
        const item = {};
        const itemDetails = line.split(' ').filter(part => part.trim().length > 0);
        item.description = itemDetails.slice(1, -3).join(' ');
        item.quantity = itemDetails[itemDetails.length - 3];
        item.unitPrice = itemDetails[itemDetails.length - 2];
        item.amount = itemDetails[itemDetails.length - 1].replace('$', '');
        invoice.items.push(item);
      }
      if (line.startsWith('Payment Method')) {
        invoice.paymentMethod = line.split(',')[0].split('Payment Method ')[1];
        invoice.totalAmount = line.split('Total Amount $')[1];
      }
    });
  
    return invoice;
  }

  performOCR(imagePath) {
    Tesseract.recognize(
      `http://localhost:5000/${imagePath}`,
      "eng",
      {
        logger: (m) => console.log(m),
      }
    )
      .then(({ data: { text } }) => {
        const structuredData = this.parseOCROutput(text);
        this.setState({ extractedText: text, structuredData, loading: false });

        // Save operation log to backend
        fetch(`http://localhost:5000/performOCR/${this.state.imageId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ extractedText: text, structuredData }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status !== "ok") {
              alert("Failed to log OCR operation");
            }
          })
          .catch((error) => {
            console.error("Error logging OCR operation:", error);
          });

        // Compare extracted medicines with official prices
        const extractedMedicines = {};
        structuredData.items.forEach(item => {
          extractedMedicines[item.description] = parseFloat(item.amount);
        });

        fetch(`http://localhost:5000/compareMedicineCosts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ extractedMedicines }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "ok") {
              this.setState({ comparisonResults: data.data });
            } else {
              alert("Failed to compare medicine costs");
            }
          })
          .catch((error) => {
            console.error("Error comparing medicine costs:", error);
            alert("An error occurred while comparing medicine costs.");
          });
      })
      .catch((error) => {
        console.error("Error performing OCR:", error);
        alert("An error occurred while performing OCR.");
      });
  }

  render() {
    const { structuredData, comparisonResults } = this.state;

    return (
      <div>
        <h2>OCR Operation</h2>
        {this.state.loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <img src={this.state.imageUrl} alt="User Upload" className="img-thumbnail" />
            <p>Extracted Text:</p>
            <div>{this.state.extractedText}</div>
            {structuredData && (
              <div>
                <h3>Structured Data</h3>
                <p><strong>Invoice Number:</strong> {structuredData.invoiceNumber}</p>
                <p><strong>Order Date:</strong> {structuredData.orderDate}</p>
                <h4>Patient Information</h4>
                <p><strong>Name:</strong> {structuredData.patientInfo.name}</p>
                <p><strong>Phone:</strong> {structuredData.patientInfo.phone}</p>
                <p><strong>Address:</strong> {structuredData.patientInfo.address}</p>
                <h4>Physician Information</h4>
                <p><strong>Name:</strong> {structuredData.physicianInfo.name}</p>
                <p><strong>Phone:</strong> {structuredData.physicianInfo.phone}</p>
                <p><strong>Address:</strong> {structuredData.physicianInfo.address}</p>
                <h4>Items</h4>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {structuredData.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>{item.unitPrice}</td>
                        <td>{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p><strong>Payment Method:</strong> {structuredData.paymentMethod}</p>
                <p><strong>Total Amount:</strong> ${structuredData.totalAmount}</p>
              </div>
            )}
            {comparisonResults && (
              <div>
                <h3>Comparison with Official Prices</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>User Price</th>
                      <th>Official Price</th>
                      <th>Extra Charged</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonResults.map((result, index) => (
                      <tr key={index}>
                        <td>{result.name}</td>
                        <td>${result.userPrice}</td>
                        <td>${result.officialPrice}</td>
                        <td>${result.difference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(PerformOCR);
