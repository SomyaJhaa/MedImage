# MedImage ( Medical Bill OCR )

This project extracts medicine names and their prices from medical bills using OCR (Optical Character Recognition).

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Future Expansion](#future-expansion)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project allows users to upload images of medical bills, extracts relevant information using OCR, and displays the structured data.

## Features

- Upload medical bill images
- Extract medicine names and prices using Tesseract OCR
- Display structured data from extracted text
- Compare extracted medicine costs with official prices

## Technologies Used

- **Frontend:**
  - React
  - React Router
  - Bootstrap
- **Backend:**
  - Node.js
  - Express
- **OCR:**
  - Tesseract.js
- **Database:**
  - MongoDB (for storing user data and images)

## Setup and Installation

### Prerequisites

- Node.js and npm installed
- MongoDB instance running

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/medical-bill-ocr.git
   cd medical-bill-ocr
   ```

2. **Backend Setup:**
   ```sh
   cd backend
   npm install
   node index.js
   ```

3. **Frontend Setup:**
   ```sh
   cd frontend
   npm install
   npm start
   ```

### Environment Variables

Create a `.env` file in the `backend` directory with the following contents:
```sh
MONGO_URI=<your_mongodb_connection_string>
```

**Note:** I have removed personal codes such as my MongoDB cluster link, and Firebase email and passwords. If you face any difficulty, please feel free to reach out. I would be happy to help!

## Usage

1. **Upload Medical Bill:**
   - Log in to your account.
   - Navigate to the user dashboard.
   - Upload a medical bill image.

2. **Perform OCR:**
   - Select an uploaded image.
   - Click on "Perform OCR" to extract data.

## File Structure

```
medical-bill-ocr/
├── backend/
│   ├── index.js
│   ├── models/
│   ├── routes/
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PerformOCR.js
│   │   │   ├── UserDetails.js
│   │   │   └── ...
│   │   ├── App.js
│   │   └── ...
│   ├── package.json
│   └── ...
├── .gitignore
├── README.md
└── ...
```

## Future Expansion

- **Chatbot Integration:** Add an interactive chatbot interface for users to view and interact with the extracted data.
- **Enhanced Parsing Rules:** Develop more advanced parsing rules to handle a wider variety of medical bill formats.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
```