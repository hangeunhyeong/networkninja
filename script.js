navigator.geolocation.getCurrentPosition(printLocation);
function printLocation(position){
  const positionObj = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    temp: '알 수 없음',
    humidity: '알 수 없음',
    wind: '알 수 없음',
    status: '알 수 없음',
    area: '알 수 없음',
    fineDust: '알 수 없음', 
    rain: '알 수 없음',
    today: getDate(),
    minTemp : '알 수 없음',
    maxTemp : '알 수 없음'
  }
  const apiKey = '92a4c42c2b66cc777171b90a69b4b582'; 
  const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${positionObj.latitude}&lon=${positionObj.longitude}&appid=${apiKey}&units=metric&lang=kr`;
  fetch(url)
    .then(res=>res.json())
    .then(data => {
      positionObj.temp = data.list[0].main.temp;
      positionObj.humidity = data.list[0].main.humidity;
      positionObj.wind = data.list[0].wind.speed;
      positionObj.status = statusToKorean(data.list[0].weather[0].main);
      positionObj.rain = data.list[0].rain?.['3h'] ?? '현재 강수 없음';

      const today = positionObj.today;
      positionObj.maxTemp = findMaxTemp(data, today);
      positionObj.minTemp = findMinTemp(data, today);

      // 화면에 정보 표시
      document.getElementById("temperature").innerHTML = positionObj.temp + "&deg;C";
      document.getElementById("humidity").innerHTML = positionObj.humidity + "%";
      document.getElementById("wind").innerHTML = positionObj.wind + "m/s";
      document.getElementById("status").innerHTML = positionObj.status;
      document.getElementById("date").innerHTML = getSimpleDate();
      document.getElementById("min").innerHTML = Math.round(positionObj.minTemp) + '~' + Math.round(positionObj.maxTemp) + "&deg;C";
      if(positionObj.rain == "현재 강수 없음")
        document.getElementById("precipitation").innerHTML = positionObj.rain;
      else
        document.getElementById("precipitation").innerHTML = positionObj.rain + "mm";

      // 날씨에 따른 배경 + 날씨 이미지 변경
      const status = positionObj.status;
      const mainDiv = document.getElementById("main");
      const weatherImg = document.getElementById("weatherImg");
      let iconName = "";

      // 날씨 이미지 변경경
      if (status.includes("맑음")) {
        iconName = "today_sunny.png";
      } else if (status.includes("흐림")) {
        iconName = "today_cloud.png";
      } else if (status.includes("소나기") || status.includes("보슬비")) {
        iconName = "today_rainy.png";
      } else if (status.includes("눈")) {
        iconName = "today_snow.png";
      } else if (status.includes("뇌우")) {
        iconName = "today_storm.png";
      } else {
        iconName = "today_sunny.png"; // 기본 아이콘
      }

      // 아이콘 이미지를 weatherImg div에 삽입
      weatherImg.innerHTML = `<img src="images/${iconName}" alt="${status}" class="weather-icon">`;

      //배경 변경경
      if (status.includes("맑음")) {
      mainDiv.style.backgroundImage = "url('images/sunny.jpeg')";
    } else if (status.includes("흐림")) {
      mainDiv.style.backgroundImage = "url('images/cloudy.png')";
    } else if (status.includes("소나기") || status.includes("보슬비")) {
      mainDiv.style.backgroundImage = "url('images/rainy.jpeg')";
    } else if (status.includes("눈")) {
      mainDiv.style.backgroundImage = "url('images/snowy.jpg')";
    } else if (status.includes("뇌우")) {
      mainDiv.style.backgroundImage = "url('images/storm.jpg')";
    }else {
      mainDiv.style.backgroundImage = "url('images/sunny.jpeg')"; // 기본은 맑음
    }
    })
      
    const GeocoderApiKey = '06e9510ec9444d10bd811abb3a9cd425';
    const GeocoderUrl = `https://api.opencagedata.com/geocode/v1/json?q=${positionObj.latitude}+${positionObj.longitude}&key=${GeocoderApiKey}&language=ko`
    fetch(GeocoderUrl)
      .then(res => res.json())
      .then(data => {
        positionObj.area = data.results[0].components.state + " " + data.results[0].components.city;
        console.log(positionObj); //fetch함수가 백그라운드에서 실행되므로 console.log()가 먼저 실행되는것을 방지
        
        // 화면에 정보 표시
        document.getElementById("area").innerHTML = positionObj.area;
      });
}
function statusToKorean(status){
  switch(status){
    case "Thunderstorm":  return "뇌우";  
    case "Drizzle":  return "보슬비";  
    case "Rain":  return "소나기";  
    case "Snow":  return "눈";  
    case "Clear":  return "맑음";  
    case "Clouds":  return "흐림";  
  }
  return status;
}

// yyyy-MM-dd 형식으로 출력
function getDate(){
  const today = new Date();
  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const day = ('0' + (today.getDate())).slice(-2);

  return year + '-' + month + '-' + day;
}

// MM/dd 형식으로 출력
function getSimpleDate(){
  const today = new Date();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const day = ('0' + (today.getDate())).slice(-2);

  return month + '/' + day;
}

function findMaxTemp(data, date){
  let max = -1000;
  for(i = 0; i < data.list.length; i++){
    if(data.list[i].dt_txt.split(" ")[0] == date){
      if(max < data.list[i].main.temp_max){
        max = data.list[i].main.temp_max;
      }
    }
  }
  return max;
}

function findMinTemp(data, date){
  let min = 1000;
  for(i = 0; i < data.list.length; i++){
    if(data.list[i].dt_txt.split(" ")[0] == date){
      if(min > data.list[i].main.temp_min){
        min = data.list[i].main.temp_min;
      }
    }
  }
  return min;
}

document.addEventListener("DOMContentLoaded",function(){
        const btn = document.getElementById("clothesbtn");
        const todayBox = document.getElementById("today");
        const rightBox = document.getElementById("right");
        const closeBtn = document.getElementById("closeClothesBtn");

        btn.addEventListener("click", function(){
          todayBox.classList.add("move-left");//today 박스 왼쪽으로 이동
          rightBox.style.visibility = "visible";//옷 추천 박스 보이기
        });
        // X 버튼 (닫기)
  closeBtn.addEventListener("click", function () {
    // 1. 옷 추천 박스를 '즉시' 안보이게 + 애니메이션 안 보이게 위치도 고정
    rightBox.style.visibility = "hidden";
    rightBox.style.transition = "none"; // 트랜지션 끄기
    rightBox.style.position = "absolute"; // layout 겹침 방지
    rightBox.style.right = "-9999px";     // 화면 바깥으로 보내기

    // 2. 약간 텀 두고 todayBox 복귀 (겹치는 시각 효과 제거)
    requestAnimationFrame(() => {
      todayBox.classList.remove("move-left");

      // 3. 다시 위치/스타일 초기화 (다음 번 보여줄 준비)
      setTimeout(() => {
        rightBox.style.transition = "";    // 트랜지션 복구
        rightBox.style.position = "";
        rightBox.style.right = "";
      }, 300); // 애니메이션 끝난 후 복원 (0.3초 정도면 충분)
    });
  });
});


