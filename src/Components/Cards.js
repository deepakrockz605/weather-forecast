import React, { PureComponent } from "react";
import apiConfig from "../apiKeys";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

class Cards extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoader: false,
    };
  }

  componentWillReceiveProps = (prevState, nextState) => {
    const prevStat = this.props.state.spliValue;
    this.setState({
      hourDataval: prevStat,
    });
  };

  handleHourlyForecast = (index) => (e) => {
    this.setState({
      isLoader: true,
    });
    const dataURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${index.lat}&lon=${index.lon}&
      exclude=hourly,daily&appid=${apiConfig.key}`;
    fetch(dataURL)
      .then((res) => res.json())
      .then((hourData) => {
        for (let i = 0; i < Object.keys(hourData.hourly).length; i++) {
          hourData.hourly[i].weatherIcon = hourData.hourly[i].weather[0].main;
          hourData.hourly[i].weatherDesc =
            hourData.hourly[i].weather[0].description;
            
            
          hourData.hourly[i].dt = new Date(
            hourData.hourly[i].dt * 1000
          )

          hourData.hourly[i].hourdates = hourData.hourly[i].dt.toLocaleString().split(',')[1]
          hourData.hourly[i].hourda = hourData.hourly[i].dt.toLocaleString().split(',')[0]
          console.log(hourData.hourly[i].dt)  
        }

        
        
        this.setState({
          hourDataval: true,
          hourData,
          isLoader: false,
        });
        this.forceUpdate();
      });
  };

  render() {
    const data = this.props.alldata;

    return (
      <div className="cards">
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
        <ul className="topcards">
          {this.props.dailyData.map((card, index) => {
            return (
              <li
                key={index}
                onClick={this.handleHourlyForecast(data.city.coord)}
              >
                <p className="text-center">
                  <span>{card.day}</span>
                </p>
                <div className="text-center">
                  <img
                    src={require(`../asset/${card.weatherIcon}.svg`)}
                    alt={card.weatherIcon}
                    title={card.weatherIcon}
                  />
                </div>
                <p className="text-center">
                  <span>{card.weatherDesc}</span>
                </p>
                <p className="">
                  Max Temp : <span>{card.main.temp_max}&#8451;</span>
                </p>
                <p className="">
                  Min Temp : <span>{card.main.temp_min}&#8451;</span>
                </p>
                <p className="">
                  Lattitude : <span>{data.city.coord.lat}</span>
                </p>
                <p className="">
                  Longitude : <span>{data.city.coord.lon}</span>
                </p>
                <p className="">
                  Humidity : <span>{card.main.humidity}</span>
                </p>
                <p className="">
                  Sunrise : <span>{this.props.state.sunriseTime}</span>
                </p>
                <p className="">
                  Sunset : <span>{this.props.state.sunsetTime}</span>
                </p>
              </li>
            );
          })}
        </ul>

        {this.state.hourDataval ? (
          <div className="splitData">
            <ul>
              {this.state.hourData.hourly.map((hours, index) => {
                return (
                  <li key={index}>
                    <p>{hours.hourdates}</p>
                    <div className="text-center">
                      <img
                        src={require(`../asset/${hours.weatherIcon}.svg`)}
                        alt={hours.weatherIcon}
                        title={hours.weatherIcon}
                      />
                    </div>
                    <p>{hours.weatherIcon}</p>
                    <p>{hours.weatherDesc}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Cards;
