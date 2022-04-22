import React, { useState, useEffect } from "react";
import { Line, Doughnut, Pie } from "react-chartjs-2";
import { chartColors } from "./colors";
import numeral from "numeral";
import "./pieStyle.css";

const SmallCharts = (props) => {
  const [newCaseWorldwide, setNewCaseWorldwide] = useState([]);
  const [deathWw, setDeathWw] = useState([]);

  const [pieData, setPieData] = useState([]);

  const styles = {
    pieContainer: {
      width: "30%",
      height: "30%",
      position: "relative",
    },
    relative: {
      position: "relative"
    }
  };

  const WWOptions = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };

  const pieOptions = {
    legend: { display: true, position: "right" },
    elements: {
      arc: {
        borderWidth: 0
      }
    },
  };

  const pieUSAData = {
    maintainAspectRatio: false,
    responsive: false,
    labels: ["todayCases", "todayDeaths", "todayRecovered"],
    datasets: [
      {
        data: pieData,
        backgroundColor: chartColors,
        hoverBackgroundColor: chartColors
      }
    ]
  };
  const buildUSAData = (data) => {
    setPieData([])
    setPieData(oldArray => [...oldArray, data.todayCases])
    setPieData(oldArray => [...oldArray, data.todayDeaths])
    setPieData(oldArray => [...oldArray, data.todayRecovered])
    console.log('why');
    console.log(data.todayCases);
    console.log(pieData);
  }

  const buildWWData = (data, casesType) => {
    let chartData = [];
    let lastDataPoint;
    console.log(data[casesType]);
    for (let date in data[casesType]) {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  useEffect(() => {
    const fetchDataWW = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=30")
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            let chartDataCases = buildWWData(data, props.casesType);
            console.log(chartDataCases);
            setNewCaseWorldwide(chartDataCases);
          });
    };

    fetchDataWW();

  }, [props.casesType]);

  useEffect(() => {
    const fetchDataUSA = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries/usa")
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            buildUSAData(data);
          });
    };

    fetchDataUSA();
  }, [])

  let lineColor = ""
  let lineBackgroundColor = ""
  if (props.casesType === 'cases') {
    lineColor = "#666666"
    lineBackgroundColor = "#CCCCCC"
  } else if (props.casesType === 'recovered') {
    lineColor = "#6699CC"
    lineBackgroundColor = "#99CCFF"
  } else {
    lineColor = "#CC1034"
    lineBackgroundColor = "#f95d6a"
  }

  return (
      <div>
        <h3>Worldwide {props.casesType} last month</h3>
        <div style={styles.relative}>
          {newCaseWorldwide.length > 0 && (
              <Line
                  data={{
                    datasets: [
                      {
                        label: "New cases",
                        backgroundColor: lineBackgroundColor,
                        borderColor: lineColor,
                        data: newCaseWorldwide,
                      },
                    ],
                  }}
                  legend={{
                    display: true,
                    position: "bottom",
                    labels: {
                      fontColor: "#323130",
                      fontSize: 14
                    }
                  }}
                  options={WWOptions}
              />
          )}
        </div>
        <h3>Today in the United States</h3>

        <div style={styles.pieContainer}>
          <Pie
              data={pieUSAData}
              options={pieOptions}
          />


        </div>

      </div>
  );

};
export default SmallCharts;
