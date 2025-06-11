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
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${positionObj.latitude}&lon=${positionObj.longitude}&appid=${apiKey}&units=metric&lang=en`;
  fetch(url)
    .then(res=>res.json())
    .then(data => {
      positionObj.temp = data.main.temp;
      positionObj.humidity = data.main.humidity;
      positionObj.wind = data.wind.speed;
      positionObj.status = data.weather[0].description;
      positionObj.city = data.name;
      positionObj.rain = data.rain?.['1h'] ?? '현재 강수 없음';
      // 날씨에 따른 배경
      const status = positionObj.status;
      const mainDiv = document.getElementById("main");

      if (status.includes("1")) {
      mainDiv.style.backgroundImage = "url('images/sunny.jpeg')";
    } else if (status.includes("clouds")) {
      mainDiv.style.backgroundImage = "url('images/cloudy.png')";
    } else if (status.includes("rain") || status.includes("shower")) {
      mainDiv.style.backgroundImage = "url('images/rainy.jpeg')";
    } else if (status.includes("snowy")) {
      mainDiv.style.backgroundImage = "url('images/snowy.jpg')";
    } else if (status.includes("clear sky")) {
      mainDiv.style.backgroundImage = "url('images/storm.jpg')";
    } else if (status.includes("mist")) {
      mainDiv.style.backgroundImage = "url('images/foggy.jpeg')";
    } else {
      mainDiv.style.backgroundImage = "url('images/sunny.jpeg')"; // 기본은 맑음
    }
      console.log(positionObj); //fetch함수가 백그라운드에서 실행되므로 console.log()가 먼저 실행되는것을 방지
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("clothesbtn");
  const todayBox = document.getElementById("today");
  const rightBox = document.getElementById("right");
  const closeBtn = document.getElementById("closeClothesBtn");

  // 열기 버튼 (옷 추천 보여주기)
  btn.addEventListener("click", function () {
    todayBox.classList.add("move-left");
    rightBox.style.visibility = "visible";
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