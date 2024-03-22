import React, { Component } from "react";
import "./index.css";

class PaymentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rollNumber: "",
      semesterFeeName: "",
      committeeAmount: "",
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "semesterFeeName") {
      // Logic to set committeeAmount based on the selected penalty name
      let committeeAmount = "";
      switch (value) {
        case "DressCode":
          committeeAmount = "100";
          break;
        case "LateFine":
          committeeAmount = "500";
          break;
        case "LibraryFine":
          committeeAmount = "1000";
          break;
        default:
          committeeAmount = "";
      }
      this.setState({ [name]: value, committeeAmount });
    } else {
      this.setState({ [name]: value });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { rollNumber, semesterFeeName, committeeAmount } = this.state;
    const formData = {
      rollNumber,
      semesterFeeName,
      committeeAmount,
    };

    // Send PUT request to backend API
    try {
      const response = await fetch("http://localhost:4000/std-payments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      alert("Payment created successfully");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to create payment");
    }
  };

  render() {
    const { rollNumber, semesterFeeName, committeeAmount, } = this.state;
    return (
      <>
        <div className="form-container-1">
          <h2 className="form-title">Student Penalty Form</h2>
          

       

          <form onSubmit={this.handleSubmit} className="form">
            <table>
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="rollNumber">Student RollNo:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      id="rollNumber"
                      name="rollNumber"
                      value={rollNumber}
                      onChange={this.handleChange}
                      placeholder="Student ID"
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="semesterFeeName">Penalty Name:</label>
                  </td>
                  <td>
                    <select
                      required
                      className="form-input"
                      name="semesterFeeName"
                      value={semesterFeeName}
                      onChange={this.handleChange}
                    >
                      <option value="">Select</option>
                      <option value="DressCode">DRESS CODE</option>
                      <option value="LateFine">LATE FINE</option>
                      <option value="LibraryFine">LIBRARY FINE</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="committeeAmount">Fine Amount:</label>
                  </td>
                  <td>
                    <select
                      required
                      className="form-input"
                      name="committeeAmount"
                      value={committeeAmount}
                      onChange={this.handleChange}
                    >
                      <option value="0">None</option>
                      <option value="100">100</option>
                      <option value="500">500</option>
                      <option value="1000">1000</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </>
    );
  }
}

export default PaymentForm;
