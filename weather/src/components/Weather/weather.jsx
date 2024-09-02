import React, { useEffect, useRef, useState } from 'react';
import clearIcon from '../../assets/images/clear.png';
import cloudIcon from '../../assets/images/cloud.png';
import drizzleIcon from '../../assets/images/drizzle.png';
import humidityIcon from '../../assets/images/humidity.png';
import rainIcon from '../../assets/images/rain.png';
import snowIcon from '../../assets/images/snow.png';
import windIcon from '../../assets/images/wind.png';
import './weather.css';

const Weather = () => {
    const [weather, setWeather] = useState({
        temperature: '',
        location: '',
        humidity: '',
        windSpeed: '',
        icon: clearIcon,
    });

    const [city, setCity] = useState('Salem');
    const inputRef = useRef(null);

    const Icons = {
        "01d": clearIcon,
        "01n": clearIcon,
        "02d": cloudIcon,
        "02n": cloudIcon,
        "03d": cloudIcon,
        "03n": cloudIcon,
        "04d": drizzleIcon,
        "04n": drizzleIcon,
        "09d": rainIcon,
        "09n": rainIcon,
        "10d": rainIcon,
        "10n": rainIcon,
        "13d": snowIcon,
        "13n": snowIcon,
    };

    const search = async (city) => {
        try {
            const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
            console.log('API Key:', apiKey);

            if (!apiKey) {
                console.error('API key is missing');
                return;
            }

            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            const icon = Icons[data.weather[0].icon] || clearIcon;

            if (data.main && data.wind) {
                setWeather({
                    temperature: Math.round(data.main.temp - 273.15),
                    location: data.name,
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    icon: icon,
                });
            } else {
                console.error('Unexpected data structure:', data);
            }
        } catch (err) {
            console.error('Error fetching weather data:', err);
        }
    };

    useEffect(() => {
        search(city);
    }, [city]);

    const handleSearch = () => {
        const newCity = inputRef.current.value;
        setCity(newCity);
    };

    return (
        <div className="weather">
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder='Search' 
                    ref={inputRef}
                    defaultValue={city}
                />
                <button className="search-btn" onClick={handleSearch}>Search</button>
            </div>
            <img src={weather.icon} alt="weather-icon" />
            <p className="temperature">{weather.temperature} °C</p>
            <p className="location">{weather.location}</p>
            <div className="weather-data">
                <div className="col">
                    <img src={humidityIcon} alt="humidity-icon" />
                    <div>
                        <p>{weather.humidity}%</p>
                        <span>Humidity</span>
                    </div>
                </div>
                <div className="col">
                    <img src={windIcon} alt="wind-icon" />
                    <div>
                        <p>{weather.windSpeed} Km/h</p>
                        <span>Wind Speed</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Weather;
