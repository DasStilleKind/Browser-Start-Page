const WEATHER_API_KEY = "1f17a1106802f64bcffd99f82c85e610"; // Deinen Key hier einsetzen
const CITY = "Delligsen,DE";

// Uhr & Datum
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  document.getElementById("clock").textContent = time;
  document.getElementById("date").textContent = date;
}
setInterval(updateClock, 1000);
updateClock();

// Shortcuts öffnen
document.querySelectorAll(".shortcut").forEach(btn => {
  btn.addEventListener("click", () => window.open(btn.dataset.url, "_blank"));
});

// Suchvorschläge (Google Suggest)
const searchInput = document.getElementById("search");
const suggestions = document.getElementById("suggestions");

searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();
  if (!query) {
    suggestions.style.display = "none";
    return;
  }

  const res = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`);
  const data = await res.json();
  const results = data[1];

  suggestions.innerHTML = "";
  results.forEach(r => {
    const li = document.createElement("li");
    li.textContent = r;
    li.onclick = () => {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(r)}`, "_blank");
    };
    suggestions.appendChild(li);
  });
  suggestions.style.display = "block";
});

document.addEventListener("click", e => {
  if (!searchInput.contains(e.target)) suggestions.style.display = "none";
});

// Google News
async function loadNews() {
  const url = "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://news.google.com/rss?hl=de&gl=DE&ceid=DE:de");
  const res = await fetch(url);
  const text = await res.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "text/xml");
  const items = xml.querySelectorAll("item");
  const newsDiv = document.getElementById("news");
  newsDiv.innerHTML = "";

  items.forEach((item, i) => {
    if (i > 5) return;
    const a = document.createElement("a");
    a.href = item.querySelector("link").textContent;
    a.textContent = item.querySelector("title").textContent;
    a.target = "_blank";
    newsDiv.appendChild(a);
  });
}
loadNews();

// Wetter
async function loadWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API_KEY}&units=metric&lang=de`;
  const res = await fetch(url);
  const data = await res.json();

  const weatherDiv = document.getElementById("weather");
  if (data.cod !== 200) {
    weatherDiv.textContent = "Fehler beim Laden des Wetters.";
    return;
  }

  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherDiv.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;">
      <img src="${icon}" alt="${data.weather[0].description}" />
      <div>
        <div><strong>${data.name}</strong></div>
        <div>${data.main.temp.toFixed(1)}°C – ${data.weather[0].description}</div>
      </div>
    </div>
  `;
}
loadWeather();
