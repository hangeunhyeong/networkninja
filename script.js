class WeatherInfo {
  constructor(latitude, longitude, extra) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.temp = '알 수 없음';
    this.humidity = '알 수 없음';
    this.wind = '알 수 없음';
    this.status = '알 수 없음';
    this.area = '알 수 없음';
    this.fineDust = '알 수 없음';
    this.rain = '알 수 없음';
    this.date = getDate(extra);
    this.minTemp = '알 수 없음';
    this.maxTemp = '알 수 없음';
  }
}
let allInfo = new Array(5);
navigator.geolocation.getCurrentPosition(printLocation);
function printLocation(position){
  const apiKey = '92a4c42c2b66cc777171b90a69b4b582'; 
  const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric&lang=kr`;
  fetch(url)
    .then(res=>res.json())
    .then(data => {
      for(let i = 0; i < 5; i++){
        allInfo[i] = new WeatherInfo(position.coords.latitude, position.coords.longitude, i);
        let idx = getIdxByDate(data, allInfo[i].date);
        console.log(idx);
        allInfo[i].temp = data.list[idx].main.temp;
        allInfo[i].humidity = data.list[idx].main.humidity;
        allInfo[i].wind = data.list[idx].wind.speed;
        allInfo[i].status = statusToKorean(data.list[idx].weather[0].main);
        allInfo[i].rain = data.list[idx].rain?.['3h'] ?? '현재 강수 없음';

        let today = allInfo[i].date;
        allInfo[i].maxTemp = findMaxTemp(data, today);
        allInfo[i].minTemp = findMinTemp(data, today);
      }
      
      // 화면에 정보 표시(main)
      document.getElementById("temperature").innerHTML = allInfo[0].temp.toFixed(1) + document.getElementById("temperature").innerHTML;
      document.getElementById("humidity").innerHTML = allInfo[0].humidity + "%";
      document.getElementById("wind").innerHTML = allInfo[0].wind + "m/s";
      document.getElementById("status").innerHTML = allInfo[0].status;
      document.getElementById("weatherImg").innerHTML = getWeatherImgByStatus(allInfo[0].status);
      document.getElementById("date").innerHTML = getSimpleDate(allInfo[0].date);
      document.getElementById("min").innerHTML = Math.round(allInfo[0].minTemp) + '~' + Math.round(allInfo[0].maxTemp) + "&deg;C";
      if(allInfo[0].rain == "현재 강수 없음")
        document.getElementById("precipitation").innerHTML = allInfo[0].rain;
      else
        document.getElementById("precipitation").innerHTML = allInfo[0].rain + "mm";

      //화면에 정보 표시(sub)
      for(let i = 1; i < 5; i++){
        document.getElementById("day" + i).getElementsByClassName("date")[0].innerHTML = getSimpleDate(allInfo[i].date);
        document.getElementById("day" + i).getElementsByClassName("weatherImg")[0].innerHTML = getWeatherImgByStatus(allInfo[i].status);
        document.getElementById("day" + i).getElementsByClassName("tempRange")[0].innerHTML = Math.round(allInfo[i].minTemp) + '~' + Math.round(allInfo[i].maxTemp) + "&deg;C";
      }
      // 날씨에 따른 배경
      let status = allInfo[0].status;
      let mainDiv = document.getElementById("main");

      if (status.includes("맑음")) {
      mainDiv.style.backgroundImage = "url('images/sunny.jpeg')";
    } else if (status.includes("흐림")) {
      mainDiv.style.backgroundImage = "url('images/cloudy.jpg')";
    } else if (status.includes("소나기") || status.includes("보슬비")) {
      mainDiv.style.backgroundImage = "url('images/rainy.jpeg')";
    } else if (status.includes("눈")) {
      mainDiv.style.backgroundImage = "url('images/snowy.jpg')";
    } else if (status.includes("뇌우")) {
      mainDiv.style.backgroundImage = "url('images/storm.jpg')";
    }else {
      mainDiv.style.backgroundImage = "url('images/sunny.jpeg')"; // 기본은 맑음
    }

    document.getElementById("clothesSuggestion").innerHTML = getClothesByStatus(allInfo[0].status, allInfo[0].temp);

    })

    
      
    const GeocoderApiKey = '06e9510ec9444d10bd811abb3a9cd425';
    const GeocoderUrl = `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=${GeocoderApiKey}&language=ko`
    fetch(GeocoderUrl)
      .then(res => res.json())
      .then(data => {
        allInfo[0].area = data.results[0].components.state + " " + data.results[0].components.city;
        console.log(allInfo[0]); //fetch함수가 백그라운드에서 실행되므로 console.log()가 먼저 실행되는것을 방지
        
        // 화면에 정보 표시
        document.getElementById("area").innerHTML = allInfo[0].area;
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
function getDate(extra){
  const today = new Date();
  today.setDate(today.getDate() + extra);
  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const day = ('0' + (today.getDate())).slice(-2);

  return year + '-' + month + '-' + day;
}

// MM/dd 형식으로 출력
function getSimpleDate(date){
  return date.split("-")[1] + '/' + date.split("-")[2];
}
function getIdxByDate(data, date){
  for(i = 0; i < data.list.length; i++){
    
    if(data.list[i].dt_txt.split(" ")[0] == date){
      //오늘
      if(i == 0){
        return i;
      }
      //오늘이 아닌 경우
      else{
        if(data.list[i].dt_txt.split(" ")[1] == "15:00:00"){
          return i;
        }
      }
    }
  }
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

function getWeatherImgByStatus(status) {
  let iconName = "";

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

  return `<img src="images/${iconName}" alt="${status}" class="weather-icon">`;
} 


function getClothesByStatus(status, temp) {
  let top = "", bottom = "", etc = "";

  if (status.includes("맑음")) {
    if (temp >= 25) {
      top = "반팔";
      bottom = "반바지";
      etc = "선크림";
    } else if (temp >= 15) {
      top = "셔츠, 가디건";
      bottom = "면바지";
      etc = "겉옷";
    } else {
      top = "니트, 긴팔";
      bottom = "청바지";
      etc = "자켓";
    }
  } else if (status.includes("소나기") || status.includes("보슬비")) {
    top = "방수 재킷";
    bottom = "면바지";
    etc = "우산";
  } else if (status.includes("눈")) {
    top = "패딩";
    bottom = "기모 바지";
    etc = "장갑, 목도리";
  } else if (status.includes("뇌우")) {
    top = "비옷";
    bottom = "긴바지";
    etc = "우산, 장화";
  } else {
    if (temp >= 25) {
      top = "반팔";
      bottom = "반바지";
      etc = "선크림";
    } else if (temp >= 15) {
      top = "셔츠, 가디건";
      bottom = "면바지";
      etc = "겉옷";
    } else {
      top = "니트, 긴팔";
      bottom = "청바지";
      etc = "자켓";
    }
  }

  return `
    <div class="clothes-table">
      <div class="clothes-row"><div class="clothes-label">상의</div><div class="clothes-value">${top}</div></div>
      <div class="clothes-row"><div class="clothes-label">하의</div><div class="clothes-value">${bottom}</div></div>
      <div class="clothes-row"><div class="clothes-label">기타</div><div class="clothes-value">${etc}</div></div>
    </div>
  `;
}
