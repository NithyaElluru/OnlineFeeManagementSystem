import React, { Component } from "react";
import "./StudentSearch.css"; // Import your CSS file for unique styling

class StudentSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      department: "",
      students: [],
    };
  }

  handleDepartmentChange = (event) => {
    this.setState({ department: event.target.value });
  };

  handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/students?department=${this.state.department}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      this.setState({ students: data });
    } catch (error) {
      console.error("Error searching students:", error.message);
    }
  };

  render() {
    return (
      <div>
        <h2 align="center">View Students</h2>
        <div className="std-search-tab">
          <select
            className="std-search-select-element"
            value={this.state.department}
            onChange={this.handleDepartmentChange}
          >
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="EEE">EEE</option>
            <option value="ECE">ECE</option>
            <option value="CIVIL">CIVIL</option>
            <option value="MECH">MECH</option>
          </select>
          <button
            className="std-search-std-button-ele"
            onClick={this.handleSearch}
          >
            Search
          </button>
        </div>
        <div className="student-table">
          {" "}
          {/* Apply unique class name for styling */}
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Year</th>
                <th>isConveyor</th>
              </tr>
            </thead>
            <tbody>
              {this.state.students.map((student) => (
                <tr key={student.id} className="student-row">
                  {" "}
                  {/* Apply unique class name for styling */}
                  <td>{student.name}</td>
                  <td>{student.rollnumber}</td>
                  <td>{student.department}</td>
                  <td>{student.semester}</td>
                  <td>{student.isConveyor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default StudentSearch;
