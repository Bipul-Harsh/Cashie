import './App.css';
import {Switch, Route, Redirect} from "react-router-dom";
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/login" component={Login}></Route>
        <Redirect from="/" to="/login"></Redirect>
      </Switch>
    </div>
  );
}

export default App;
