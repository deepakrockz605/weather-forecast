import React from "react";
import "./App.scss";
import WeatherContainer from "./Components/WeatherContainer";

function App() {
  return (
    <div className="App">
      <div className="container">
        <WeatherContainer />
      </div>
    </div>
  );
}

export default App;
