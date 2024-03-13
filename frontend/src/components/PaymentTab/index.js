import React, { Component } from "react";
import "./index.css";

class PaymentComponent extends Component {
  state = {
    payments: [],
    selectedPayments: [],
    paymentSuccess: false,
    checkBox: false,
    totalPayingAmount: 0,
    activeYear: "1st btech",
  };

  componentDidMount() {
    const { rollNumber } = this.props;
    fetch(`http://localhost:4000/sem-fees/${rollNumber}`)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({ payments: responseData });
      })
      .catch((error) => {
        console.error(`Error fetching payments data:`, error);
      });
  }

  handleCheckboxChange = (id, committeeAmount) => {
    const { selectedPayments } = this.state;
    const paymentIndex = selectedPayments.findIndex(
      (payment) => payment.id === id
    );

    if (paymentIndex === -1) {
      this.setState((prevState) => ({
        selectedPayments: [
          ...prevState.selectedPayments,
          { id, committeeAmount, amount: 0 },
        ],
        checkBox: true,
        totalPayingAmount: prevState.totalPayingAmount + committeeAmount,
      }));
    } else {
      const updatedSelectedPayments = [...selectedPayments];
      updatedSelectedPayments.splice(paymentIndex, 1);

      this.setState((prevState) => ({
        selectedPayments: updatedSelectedPayments,
        checkBox: updatedSelectedPayments.length > 0,
        totalPayingAmount: prevState.totalPayingAmount - committeeAmount,
      }));
    }
  };

  handleAmountChange = (id, amount) => {
    const { selectedPayments } = this.state;
    const updatedSelectedPayments = selectedPayments.map((payment) =>
      payment.id === id ? { ...payment, amount: parseInt(amount, 10) } : payment
    );
    this.setState({ selectedPayments: updatedSelectedPayments });
  };

  handlePayNow = async () => {
    const { rollNumber } = this.props;
    const { selectedPayments } = this.state;

    try {
      const payments = selectedPayments.map(({ id, amount }) => ({
        feeId: id,
        amount: parseInt(amount, 10),
      }));

      const response = await fetch(
        `http://localhost:4000/update-fees/${rollNumber}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payments }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update payments");
      }

      console.log("Payments updated successfully");
      this.setState({ paymentSuccess: true, selectedPayments: [] });
    } catch (error) {
      console.error("Error updating payments:", error);
      alert("Failed to update payments");
    }
  };

  renderTableRows = () => {
    const { payments } = this.state;

    return payments.map((payment) => (
      <tr key={payment.id}>
        <td>{payment.fee_id}</td>
        <td>{payment.year}</td>
        <td>{payment.fees_name}</td>
        <td>{payment.due_amount}</td>
        <td>{payment.paid_amount}</td>
        <td>{payment.balance_amount}</td>
        <td>
          <input
            className="payments-tab-input"
            type="checkbox"
            onChange={() =>
              this.handleCheckboxChange(payment.id, payment.committee_amount)
            }
            disabled={payment.balance_amount === 0}
          />
        </td>
        <td>
          {this.state.selectedPayments.some((item) => item.id === payment.id) &&
            payment.balance_amount !== 0 && (
              <input
                type="number"
                placeholder="Enter amount"
                disabled={
                  !this.state.selectedPayments.some(
                    (item) => item.id === payment.id
                  )
                }
                onChange={(e) => {
                  this.handleAmountChange(payment.id, e.target.value);
                }}
              />
            )}
        </td>
      </tr>
    ));
  };

  onBackButtonClick = () => {
    this.setState({ paymentSuccess: false });
    window.location.reload();
  };

  render() {
    const { paymentSuccess } = this.state;

    return (
      <div>
        {paymentSuccess ? (
          <div className="payment-verification">
            <h1>Payment Successful!</h1>
            <img
              alt="payment success"
              src="https://momentumacademy.net/wp-content/uploads/2020/05/Paymentsuccessful21.png"
            />
            <button
              style={{ marginTop: "1%" }}
              className="payments-tab-button"
              onClick={this.onBackButtonClick}
            >
              Back
            </button>
          </div>
        ) : (
          <div>
            <div className="table-info-tab">
              <h2>Payment Details</h2>
              <table className="payment-table">
                <thead>
                  <tr>
                    <th>Fee ID</th>
                    <th>Year</th>
                    <th>Fees Name</th>
                    <th>Total Amount</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Select</th>
                    <th style={{ width: "5vw" }}>Fee Paying</th>
                  </tr>
                </thead>
                <tbody>{this.renderTableRows()}</tbody>
              </table>
              {this.state.checkBox && (
                <div className="pay-now">
                  <button
                  className="payments-tab-button"
                  onClick={this.handlePayNow}
                >
                  Pay Now
                </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default PaymentComponent;
