import React, { useState } from "react";
import Metric from "./Metric";
import PositionedMenu from "./IndicatorMenu";
import { AppBar, Toolbar, Tabs, Tab, Container } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, useNavigate, Switch, BrowserRouter, useLocation } from "react-router-dom";
import AddMetric from './AddMetric'
import IndicatorMenu from "./IndicatorMenu";
import ViewMetric from "./ViewMetric";
import Statistic from "./Statistic";

import FoodList from './diet/FoodList.js';
import AddDiet from './diet/AddDiet.js';
import AllDiets from './diet/AllDiets';
import DietInfo from './diet/DietInfo.js';
import ActualDiets from './diet/ActualDiets.js';

import PlannedMeals from "./diet/PlannedMeals.js";
import NextMeals from "./diet/NextMeals.js";

const pages = [
  { label: "Metrics", path: "/add-metric" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" }
];

const NavBar = () => {
  return (
    <AppBar position="fixed" color="green">
      <Toolbar>
        <NavigationTabs />
      </Toolbar>
    </AppBar>
  );
};

const NavigationTabs = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  return (
    <Tabs
      value={value}
      onChange={(e, newValue) => {
        setValue(newValue);
        navigate(pages[newValue].path);
      }}
      textColor="inherit"
      indicatorColor="secondary"
    >
      {pages.map((page, index) => (
        <Tab key={index} label={page.label} />
      ))}
    </Tabs>
  );
};

function App() {
  const [foodList, setFoodList] = useState([]);

  return (
    <div className="">
      <Router>
      <NavBar />
      <br/>
      <br />
      <br />
      <br/>
      <br />
      <br />
      <Routes>
        <Route path="/add-metric" element={<AddMetric />}/>
        <Route path="/view-metric" element={<ViewMetric />}/>
        <Route path="/metric-statistic" element={<Statistic />}/>
        <Route path="/add-food" element={<FoodList onAddFood={(f) => setFoodList([...foodList, f])} />} />
        <Route path="/diet" element={<AddDiet />} />
        <Route path="/diets" element={<AllDiets />} />
        <Route path="/diets/:id" element={<DietInfo />} />
        <Route path="/actual-diets" element={<ActualDiets />} />
        <Route path="/planned-meals" element={<PlannedMeals />} />
        <Route path="/next-meals" element={<NextMeals />} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;
