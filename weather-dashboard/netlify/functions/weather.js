exports.handler = async (event) => {
    const city = event.queryStringParameters.city || 'Cape Town';
    const apiKey = process.env.WEATHER_API_KEY;
  
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
  
    const data = await response.json();
  
    if (data.cod !== 200) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data.message })
      };
    }
  
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        wind_speed: data.wind.speed
      })
    };
  };  