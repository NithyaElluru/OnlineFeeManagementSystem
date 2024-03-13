import React, { Component } from "react";

import "./index.css";

class CsvUpload extends Component {
  handleFileUpload = async (event, fileType) => {
    try {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("csvFile", file);

      let endpoint = "";
      if (fileType === "fee_data") {
        endpoint = "http://localhost:4000/upload-fee-data";
      } else {
        endpoint = "http://localhost:4000/upload-csv";
      }

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("CSV file uploaded successfully!");
      } else {
        throw new Error("Failed to upload CSV file");
      }
    } catch (error) {
      console.error("Error uploading CSV file:", error.message);
      alert("Error uploading CSV file. Please try again.");
    }
  };

  render() {
    return (
      <div className="upload-csv">
        <div>
          <h2>Upload CSV File</h2>
          <input type="file" accept=".csv" onChange={(e) => this.handleFileUpload(e, "csv")} />
        </div>
        <div>
          <h2>Upload Fee Data</h2>
          <input type="file" accept=".csv" onChange={(e) => this.handleFileUpload(e, "fee_data")} />
        </div>
      </div>
    );
  }
}

export default CsvUpload;
