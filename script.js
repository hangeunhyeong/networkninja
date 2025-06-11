const outfits = [
  { temp: 0, text: "🧥 패딩 + 장갑 + 털모자!" },
  { temp: 10, text: "🧣 코트 + 니트 + 청바지" },
  { temp: 20, text: "👕 긴팔 + 가디건 + 면바지" },
  { temp: 30, text: "👕 반팔 + 반바지 + 샌들" },
  { temp: 40, text: "🩳 민소매 + 얇은 바지 + 모자" }
];
let current = 2;

function updateOutfit() {
  const temp = parseInt(document.getElementById("tempSlider").value);
  document.getElementById("tempValue").textContent = temp + "℃";

  const outfit = outfits.reduce((prev, curr) =>
    Math.abs(curr.temp - temp) < Math.abs(prev.temp - temp) ? curr : prev
  );
  document.getElementById("outfit").textContent = `추천 옷차림: ${outfit.text}`;
}

function prevOutfit() {
  current = (current - 1 + outfits.length) % outfits.length;
  document.getElementById("outfit").textContent = `추천 옷차림: ${outfits[current].text}`;
}

function nextOutfit() {
  current = (current + 1) % outfits.length;
  document.getElementById("outfit").textContent = `추천 옷차림: ${outfits[current].text}`;
}

function addComment() {
  const text = document.getElementById("commentText").value;
  if (text.trim() !== "") {
    const box = document.getElementById("comments");
    const p = document.createElement("p");
    p.textContent = text;
    box.appendChild(p);
    document.getElementById("commentText").value = "";
  }
}

updateOutfit(); // 초기 설정
