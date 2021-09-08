import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./styles.css";

import UnitCategory from "./pages/UnitCategory";
import Graph from "./pages/Graph";
import Model from "./pages/Model";

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/unit">Unit</Link>
            </li>
            <li>
              <Link to="/graph">Graph</Link>
            </li>
            <li>
              <Link to="/model">Model</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/" exact>
            <UnitCategory />
            <Graph />
          </Route>
          <Route path="/unit" exact>
            <UnitCategory />
          </Route>
          <Route path="/graph" exact>
            <Graph />
          </Route>
          <Route path="/model" exact>
            <Model />
          </Route>
          <Route path="/toy" exact>
            <Model />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
