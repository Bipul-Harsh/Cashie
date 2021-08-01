import './App.css';
import {Switch, Route, Redirect} from "react-router-dom";
import Login from './Screens/Login';
import Dashboard from "./Screens/Dashboard";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/login" component={Login}></Route>
        <Route path="/dashboard" component={Dashboard}></Route>
        <Redirect from="/" to="/login"></Redirect>
      </Switch>
    </div>
  );
}

export default App;
