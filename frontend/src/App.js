import './App.css';
import {Switch, Route, Redirect} from "react-router-dom";
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/login" component={Login}></Route>
      </Switch>
    </div>
  );
}

export default App;
