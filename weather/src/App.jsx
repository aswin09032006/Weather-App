import axios from "axios";
import React, { useState } from "react";
import { FaWind } from "react-icons/fa6";
import { FiMoon } from "react-icons/fi";
import { IoEyeOutline, IoSunnyOutline } from "react-icons/io5";
import { LuWaves } from "react-icons/lu";
import { PiThermometerHot } from "react-icons/pi";
import { WiHumidity } from "react-icons/wi";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [aqiData, setAqiData] = useState(null); // Initialize AQI state
  const [input, setInput] = useState("");

  const api_key = import.meta.env.VITE_WEATHER_API_KEY;

  const searchByCity = () => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${api_key}`
      )
      .then((response) => {
        setWeatherData(response.data);
        const { lat, lon } = response.data.coord;
        fetchForecast(lat, lon);
        fetchAqi(lat, lon); // Fetch AQI data after getting weather data
      });
  };

  const fetchForecast = (lat, lon) => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`
      )
      .then((response) => {
        setForecastData(response.data);
      });
  };

  const fetchAqi = (lat, lon) => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`
      )
      .then((response) => {
        setAqiData(response.data.list[0].main.aqi); // AQI data is inside list[0]
      });
  };

  const getAqiDescription = (aqi) => {
    switch (aqi) {
      case 1:
        return { text: "Good", color: "#74b72e" };
      case 2:
        return { text: "Fair", color: "#f9e076" };
      case 3:
        return { text: "Moderate", color: "#f9e076" };
      case 4:
        return { text: "Poor", color: "#bc544b" };
      case 5:
        return { text: "Very Poor", color: "#bc544b" };
      default:
        return { text: "Unknown", color: "gray" };
    }
  };

  const aqi = aqiData ? getAqiDescription(aqiData) : { text: "Loading", color: "gray" };

  const searchByCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`
        )
        .then((response) => {
          setWeatherData(response.data);
          fetchForecast(latitude, longitude);
          fetchAqi(latitude, longitude); // Fetch AQI for current location
        });
    });
  };

  return (
    <div className="container">
      {/* Header Section */}
      <div className="header">
        <div className="logo">
          <h1>Weather Dashboard</h1>
          <p>© Aswin</p>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search city..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={searchByCity}>Search</button>
        </div>
        <button className="current-location-btn" onClick={searchByCurrentLocation}>Current Location</button>
      </div>

      {/* Weather Cards Layout */}
      <div className="weather-cards">
        {/* Left Section: Now and 5 Days Forecast */}
        <div className="left-section">
          {weatherData && (
            <div className="now-card">
              <h2>Now</h2>
              <div className="now-content">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "100px" }}>
                  <h3>{Math.floor(weatherData.main.temp - 273)}°C</h3>
                  <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt={weatherData.weather[0].description} />
                </div>
                <p>{weatherData.weather[0].description}</p>
                <hr style={{ backgroundColor: "#333" }} />
                <p>{new Date().toLocaleDateString()}</p>
                <p>{weatherData.name}, {weatherData.sys.country}</p>
              </div>
            </div>
          )}

          {forecastData && (
            <div className="forecast-card">
              <h2>5 Days Forecast</h2>
              <div className="forecast-content">
                {forecastData.list.slice(0, 5).map((forecast, index) => (
                  <div className="forecast-item" key={index}>
                    <img src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`} alt={forecast.weather[0].description} />
                    <p>{Math.floor(forecast.main.temp_max - 273)}°C</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Today at and Highlights */}
        <div className="right-section">
          {weatherData && (
            <div className="highlights-card">
              <h2>Today's Highlights</h2>
              <div className="highlights">
                <div className="highlight-item span-2">
                  <div className="highlight-icon">
                    <FaWind style={{ fontSize: "40px" }} />
                  </div>
                  <div className="highlight-info">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap:"40px" }}>
                      <h3>Air Quality Index</h3>
                      <div className="goodOrBad" style={{ backgroundColor: aqi.color, color: "white" }}>{aqi.text}</div>
                    </div>
                    <p>{aqiData}</p>
                  </div>
                </div>

                <div className="highlight-item sun-times span-2">
                  <div className="highlight-info ">
                    <h3>Sunrise & Sunset</h3>
                    <div className="sun-details">
                      <div className="sunrise">
                        <IoSunnyOutline style={{ fontSize: "40px" }} />
                        <div>
                          <p className="sun-details-title">Sunrise</p>
                          <p>{new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <div className="sunset">
                        <FiMoon style={{ fontSize: "40px" }} />
                        <div>
                          <p className="sun-details-title">Sunset</p>
                          <p>{new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="highlight-item">
                  <div className="highlight-icon">
                    <WiHumidity style={{ fontSize: "40px" }} />
                  </div>
                  <div className="highlight-info">
                    <h3>Humidity</h3>
                    <p>{weatherData.main.humidity}%</p>
                  </div>
                </div>

                <div className="highlight-item">
                  <div className="highlight-icon">
                    <LuWaves style={{ fontSize: "40px" }} />
                  </div>
                  <div className="highlight-info">
                    <h3>Pressure</h3>
                    <p>{weatherData.main.pressure} hPa</p>
                  </div>
                </div>

                <div className="highlight-item">
                  <div className="highlight-icon">
                    <IoEyeOutline style={{ fontSize: "40px" }} />
                  </div>
                  <div className="highlight-info">
                    <h3>Visibility</h3>
                    <p>{weatherData.visibility / 1000} km</p>
                  </div>
                </div>

                <div className="highlight-item">
                  <div className="highlight-icon">
                    <PiThermometerHot style={{ fontSize: "40px" }} />
                  </div>
                  <div className="highlight-info">
                    <h3>Feels Like</h3>
                    <p>{Math.floor(weatherData.main.feels_like - 273)}°C</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {forecastData && (
            <div className="today-at-section">
              <h2>Today at</h2>
              <div className="today-at-cards">
                {forecastData.list.slice(0, 8).map((forecast, index) => (
                  <div className="today-at-item" key={index}>
                    <p>{new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <img src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`} alt={forecast.weather[0].description} />
                    <p>{Math.floor(forecast.main.temp - 273)}°C</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
