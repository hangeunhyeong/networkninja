  /* ================================
       가상의 샘플 데이터 (7일치)
       실제 구현 시 API 연동으로 교체
    =================================*/
    const sample = {
      labels: ["월","화","수","목","금","토","일"],
      temperature: [21, 22, 18, 19, 23, 24, 25],        // °C
      precipitation: [2, 5, 0, 1, 3, 8, 12],            // mm
      humidity: [65, 60, 70, 68, 72, 75, 78],           // %
      pop: [10, 20, 5, 15, 30, 50, 70],                 // %
      uvi: [5, 6, 4, 5, 7, 8, 9],                       // UV Index
      pm: [30, 35, 40, 45, 25, 20, 18],                 // μg/m³
      wind: [10, 12, 8, 9, 14, 13, 11],                // m/s
      windDir: [90, 120, 110, 100, 130, 140, 85]        // degrees
    };

    /* ================================
       Chart.js 기본 세팅
    =================================*/
    const ctx = document.getElementById('metricChart').getContext('2d');

    // 초기(기온) 차트 생성
    let chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sample.labels,
        datasets: [{
          label: '기온(°C)',
          data: sample.temperature,
          fill: false,
          borderWidth: 2,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: { beginAtZero: false }
        }
      }
    });

    /* ================================
       메트릭 선택 시 차트 업데이트
    =================================*/
    function updateChart(metric) {
      const mapping = {
        temperature: {label: "기온(°C)", data: sample.temperature},
        precipitation: {label: "강수량(mm)", data: sample.precipitation},
        humidity: {label: "수증기량(%)", data: sample.humidity},
        pop: {label: "비올 확률(%)", data: sample.pop},
        uvi: {label: "자외선 지수", data: sample.uvi},
        pm: {label: "미세먼지 지수(μg/m³)", data: sample.pm},
        wind: {label: "바람 속도(m/s)", data: sample.wind},
        windDir: {label: "풍향(°)", data: sample.windDir}
      };

      chart.data.datasets[0].label = mapping[metric].label;
      chart.data.datasets[0].data = mapping[metric].data;
      chart.update();

      // 활성 버튼 표시 변경
      document.querySelectorAll('#metric-menu button').forEach(btn => btn.classList.remove('active'));
      document.querySelector(`#metric-menu button[data-metric="${metric}"]`).classList.add('active');
    }

    // 버튼 클릭 이벤트 바인딩
    document.querySelectorAll('#metric-menu button').forEach(btn => {
      btn.addEventListener('click', () => updateChart(btn.dataset.metric));
    });

    // 첫 화면은 기온 데이터 표시
    updateChart('temperature');