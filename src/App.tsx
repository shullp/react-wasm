import React from 'react';
import './App.css';
import ImageFilter from './pages/ImageFilter';
import Home from './pages/Home';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Sidebar from './components/Sidebar/Sidebar';
import SciChart3d from './pages/SciChart3d';
import SciChart2d from './pages/SciChart2d';

function App() {
  return (
    <Router>
      <Sidebar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/image-filters">
          <ImageFilter />
        </Route>
        <Route path="/scichart3d">
          <SciChart3d />
        </Route>
        <Route path="/scichart2d">
          <SciChart2d />
        </Route>
      </Switch>
  </Router>
  );
}

export default App;
