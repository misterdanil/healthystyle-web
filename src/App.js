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

import FoodValue from "./diet/FoodValue.js";

import Exercise from './sport/Exercise.js';
import AddSport from './sport/AddSport.js';
import AllSports from './sport/AllSports.js';
import PlannedTrains from './sport/PlannedTrains.js';
import SportsStatistic from './sport/SportStatistic.js';

import CreateArticle from './article/AddArticle.js';
import ArticleView from './article/ArticleView.js';
import Articles from './article/Articles.js';

import Auth from './Auth.js';

import AddEvent from './event/AddEvent.js';
import EventSearch from './event/EventSearch.js';
import EventView from './event/EventView.js';

import AddMedicine from './medicine/AddMedicine.js';
import AddTreatment from './medicine/AddTreatment.js';
import PlannedIntakes from './medicine/PlannedIntakes.js';
import MissedIntakes from './medicine/MissedIntakes.js';

import MenuTest from './MenuTest.js';
import InnerMenu from './InnerMenu.js';

import Home from './Home.js';

import store from './store';
import { Provider } from 'react-redux';

import { styled } from "@mui/system";


const GradientBox = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(-45deg, #d4eaf7, #cfe9dc, #f6f0d8, #e3eaf4)',
  backgroundSize: '400% 400%',
  animation: 'gradientMove 30s ease infinite',
  '@keyframes gradientMove': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
}));

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

  const ReactDOMServer = require('react-dom/server');

  return (
    <GradientBox>
      <Router>
      <MenuTest />
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
        <Route path="/food-values" element={<FoodValue />} />
        <Route path="/exercises" element={<Exercise />} />
        <Route path="/sport" element={<AddSport />} />
        <Route path="/sports" element={<AllSports />} />
        <Route path="/planned-trains" element={<PlannedTrains />} />
        <Route path="/sport-statistic" element={<SportsStatistic />} />
        <Route path="/article" element={<CreateArticle />} />
        <Route path="/articles/:articleId" element={<ArticleView />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/event" element={<AddEvent />}></Route>
        <Route path="/events" element={<EventSearch />}></Route>
        <Route path="/events/:id" element={<EventView />}></Route>
        <Route path="/medicine" element={<AddMedicine />}></Route>
        <Route path="/treatment" element={<AddTreatment />}></Route>
        <Route path="/intakes" element={<PlannedIntakes />}></Route>
        <Route path="/missed" element={<MissedIntakes />}></Route>
        <Route path="/home" element={<Home />}></Route>
      </Routes>
      </Router>
    </GradientBox>
  );
}

export default App;
