import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { BrowserRouter,Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks"



export const config = {
   endpoint: `https://qkart-frontend-by-kalpesha.herokuapp.com/api/v1`,
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
        <Route exact path="/">
            <Products />
          </Route>
          <Route path="/Register">
            <Register />
          </Route>
          <Route path="/Login">
            <Login />
          </Route>
          
          <Route path="/checkout">
          <Checkout />
        </Route>
        <Route path="/thanks">
          <Thanks />
        </Route>
          
          
        </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
