import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./components/InfoBox";
import SmallCharts from "./components/SmallCharts";
import CTable from "./components/CTable";
import { sortData, prettyPrintStat } from "./components/util";
import numeral from "numeral";
import Map from "./components/Map";
import "leaflet/dist/leaflet.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // console.log(searchTerm)
      // Send Axios request here
    }, 3000)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  useEffect(() => {
      fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  // console.log(casesType);

  const onCountryChange_nav = async (key) => {
    const countryCode = key;
    console.log('country Code: ',key);
    console.log('country Code type: ',typeof countryCode);
    console.log(key==='worldwide');

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {

        
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      }
      );
  };

  const handleSelect=(key)=>{
    
    alert(`selected ${key}`);
    
    
}



  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    console.log('country Code: ',countryCode);
    console.log('country Code type: ',typeof countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
  
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
       
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
      <Navbar.Brand href="#home">Covid-19 Data Visualization</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">

      <Nav variant="pills" activeKey="1"  
                >

          <NavDropdown title="Case Type" id="nav-dropdown" onSelect={(e) => setCasesType(e)}>
                  
                  
                  <NavDropdown.Item eventKey='cases'>Coronavirus Cases</NavDropdown.Item>
                  <NavDropdown.Item eventKey="recovered">Recovered</NavDropdown.Item>
                  <NavDropdown.Item eventKey="deaths">Deaths</NavDropdown.Item>
                
                </NavDropdown>
                
                
                <NavDropdown title="Country" id="nav-dropdown" onSelect={onCountryChange_nav}>
         
                    {countries.map((country) => (
                    <NavDropdown.Item eventKey={country.value}>{country.name}</NavDropdown.Item>
                  ))}
                    
                </NavDropdown>
            </Nav>

            </Navbar.Collapse>
      </Container>
      </Navbar>
      <Container>
  <Row>
    <Col><h3>Live Cases by Country</h3>
            <CTable countries={tableData} /></Col>
    <Col>{(() => {
        if (casesType==='cases') {
          return (
            <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
            color="grey"
          />
          )
        } else if (casesType==='recovered') {
          return (
            <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
            color={"blue"}
          />
          )
        } else {
          return (
            <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
            color={"red"}
          />
          )
        }
      })()}
      <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </Col>
  </Row>
  </Container>
  </div>
</div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            {/* <h3>Live Cases by Country</h3>
            <CTable countries={tableData} /> */}
            <SmallCharts casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
