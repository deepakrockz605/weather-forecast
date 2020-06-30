import React, { PureComponent, Fragment } from "react";
import Cards from "./Cards";
import apiConfig from "../apiKeys";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

class WeatherContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      city: "",
      days: [],
      spliValue: false,
      isLoader: false,
    };
  }

  handleCity = (e) => {
    this.setState({
      city: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      isLoader: true,
    });
    const weatherURL =
      `http://api.openweathermap.org/data/2.5/forecast?q=${this.state.city}&appid=` +
      apiConfig.key;
    fetch(weatherURL)
      .then((res) => res.json())
      .then((data) => {
        const alldata = data;
        console.log(alldata)
        let sunrise = data.city.sunrise;
        let sunriseTime = new Date(sunrise * 1000).toLocaleTimeString();
        let sunset = data.city.sunset;
        let sunsetTime = new Date(sunset * 1000).toLocaleTimeString();
        let dailyData = data.list.filter((reading) =>
          reading.dt_txt.includes("18:00:00")
        );
        
        for (let i = 0; i < Object.keys(dailyData).length; i++) {
          dailyData[i].weatherIcon = dailyData[i].weather[0].main;
          dailyData[i].weatherDesc = dailyData[i].weather[0].description;
          dailyData[i].dt_txt = dailyData[i].dt_txt.replace("18:00:00", "");
          dailyData[i].main.temp_max = (
            dailyData[i].main.temp_max - 273.15
          ).toFixed(2);
          dailyData[i].main.temp_min = (
            dailyData[i].main.temp_min - 273.15
          ).toFixed(2);
          dailyData[i].day = new Date(dailyData[i].dt_txt);
          const curentYear = new Intl.DateTimeFormat("en", {
            year: "numeric",
          }).format(dailyData[i].day);
          const currentMonth = new Intl.DateTimeFormat("en", {
            month: "short",
          }).format(dailyData[i].day);
          const currentDate = new Intl.DateTimeFormat("en", {
            day: "2-digit",
          }).format(dailyData[i].day);
          dailyData[i].day = `${currentDate} ${currentMonth} ${curentYear}`;
        }

        this.setState({
          days: dailyData,
          alldata,
          sunriseTime,
          sunsetTime,
          spliValue: false,
          err: "",
          isLoader: false,
        });
      })
      .catch((err) => this.setState({ err, isLoader: false }));
  };

  render() {
    return (
      <Fragment>
        {this.state.isLoader ? (
          <>
            <div className="loader"></div>
            <Loader
              className="innerSpinner"
              type="Bars"
              color="#00BFFF"
              height={100}
              width={100}
            />
          </>
        ) : null}
        <div className="seach-box text-center">
          <h5>Enter City Name</h5>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              value={this.state.city}
              onChange={this.handleCity}
            />
            <button type="submit">Search</button>
          </form>
        </div>
        {this.state.err ? (
          <h4 className="text-center">No Such City Exists</h4>
        ) : (
          <Cards
            alldata={this.state.alldata}
            dailyData={this.state.days}
            state={this.state}
          />
        )}
      </Fragment>
    );
  }
}

export default WeatherContainer;
