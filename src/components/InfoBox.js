import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

const InfoBox = (props) => {

  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${props.active && "infoBox--selected"} ${props.color==='blue' && "infoBox--blue"} 
      ${props.color==='red' && "infoBox--red"}`}
    >
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {props.title}
        </Typography>
        <h2 className={`infoBox__cases ${props.color==='red' && "infoBox__cases--red"} ${props.color==='blue' && "infoBox__cases--blue"}` }>
          {props.cases}
        </h2>

        <Typography className="infoBox__total" color="textSecondary">
          {props.total} Total
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
