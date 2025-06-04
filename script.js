navigator.geolocation.getCurrentPosition(printLocation);
function printLocation(position){
  const positionObj = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    temp: '알 수 없음',
    humidity: '알 수 없음',
    wind: '알 수 없음',
    status: '알 수 없음',
    city: '알 수 없음',
    fineDust: '알 수 없음',
    rain: '알 수 없음',
  }
  const apiKey = '';
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${positionObj.latitude}&lon=${positionObj.longitude}&appid=${apiKey}&units=metric&lang=kr`;
  fetch(url)
    .then(res=>res.json())
    .then(data => {
      positionObj.temp = data.main.temp;
      positionObj.humidity = data.main.humidity;
      positionObj.wind = data.wind.speed;
      positionObj.status = data.weather[0].description;
      positionObj.city = data.name;
      positionObj.rain = data.rain?.['1h'] ?? '현재 강수 없음';
      console.log(positionObj); //fetch함수가 백그라운드에서 실행되므로 console.log()가 먼저 실행되는것을 방지
    });
}
