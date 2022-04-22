import React from "react";
import "./CTable.css";
import numeral from "numeral";
import Table from 'react-bootstrap/Table';

function CTable({ countries }) {
  return (
    // <div className="table">
    //   {countries.map((country) => (
    //     <tr>
    //       <td>{country.country}</td>
    //       <td>
    //         <strong>{numeral(country.cases).format("0,0")}</strong>
    //       </td>
    //     </tr>
    //   ))}
    // </div>
    <div style={{overflow: 'scroll'}}> 
    <Table striped bordered hover variant="dark">
       <thead>
    <tr>
      
      <th>Country</th>
      <th>Case Number</th>
    </tr>
  </thead>
  <tbody>
    {countries.map((country) => (
      
        <tr>
          <td>{country.country}</td>
          <td>
            <strong>{numeral(country.cases).format("0,0")}</strong>
          </td>
        </tr>
        
        ))}
      </tbody>
      </Table>
      </div>
 
      


  );
}

export default CTable;
