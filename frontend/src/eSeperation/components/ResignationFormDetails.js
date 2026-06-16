import React, { Component } from 'react';
import ExitService from '../services/ExitService';
import './ExitForm.css';

class ResignationFormDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
    };
    //this.addEmployee = this.addEmployee.bind(this);
  }

  componentDidMount() {
    ExitService.getExitFormData()
      .then((res) => {
        this.setState({ employees: res.data });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  // addEmployee() {
  //   this.props.history.push('/exit');
  // }

  render() {
    return (
      <div>
        <h2 className="text-center">Employee Resignation Data</h2>
        <div className="table-container">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Employee Name</th>
                <th>Employee Code</th>
                <th>Email Id</th>
                <th>Manager Email Id</th>
                <th>Designation</th>
                <th>Last Working Date</th>
                <th>Official Last Working Date</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {this.state.employees.map((employeeData, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{employeeData.empName}</td>
                  <td>{employeeData.empId}</td>
                  <td>{employeeData.officialEmailId}</td>
                  <td>{employeeData.managerEmailId}</td>
                  <td>{employeeData.designation}</td>
                  <td>{employeeData.lastWorkingDay}</td>
                  <td>{employeeData.officialLastWorkingDay}</td>
                  <td>{employeeData.reason}</td>
                  <td>
                    {employeeData.status}
                    <div>
                      <button className="btn btn-success mr-2">Approve</button>
                      <button className="btn1 btn-danger">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ResignationFormDetails;
