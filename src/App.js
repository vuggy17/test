import logo from "./logo.svg";
import "./App.css";
import { axios } from "./module/http/interceptor";
import LoginForm from "./module/ui/login-form";
import { useState } from "react";
import { BASE_URL } from "./constants";

function App() {
  const [places, setplaces] = useState([]);
  const getPlace = async () => {
    const data = await axios.get(BASE_URL + "don_vi/all");
    setplaces(data);
  };

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <p> press button to get places</p>
      <button onClick={getPlace}>get places</button>
      <p>{JSON.stringify(places.data)}</p>
      <br></br>
      <LoginForm></LoginForm>
    </div>
  );
}

export default App;
