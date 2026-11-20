const statusLine = document.querySelector("#weather");
const endpoint = "https://api.open-meteo.com/v1/forecast?latitude=38.593&longitude=-78.3804&elevation=1120&current=temperature_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timeformat=unixtime";
const conditions = {0:"Clear",1:"Mostly clear",2:"Partly cloudy",3:"Overcast",45:"Fog",48:"Freezing fog",51:"Light drizzle",53:"Drizzle",55:"Heavy drizzle",56:"Freezing drizzle",57:"Freezing drizzle",61:"Light rain",63:"Rain",65:"Heavy rain",66:"Freezing rain",67:"Freezing rain",71:"Light snow",73:"Snow",75:"Heavy snow",77:"Snow grains",80:"Light showers",81:"Showers",82:"Heavy showers",85:"Snow showers",86:"Heavy snow showers",95:"Thunderstorms",96:"Thunderstorms with hail",99:"Thunderstorms with hail"};
async function showWeather() {
  try {
    const response = await fetch(endpoint, {signal: AbortSignal.timeout(12000)});
    if (!response.ok) throw Error();
    const {current} = await response.json();
    const {temperature_2m, wind_speed_10m, weather_code, time} = current;
    if (![temperature_2m, wind_speed_10m, time].every(Number.isFinite) || Math.abs(Date.now() - time*1000) > 7200000) throw Error();
    const stamp = new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",month:"short",day:"numeric",hour:"numeric",minute:"2-digit",timeZoneName:"short"}).format(time*1000);
    statusLine.textContent = [conditions[weather_code], Math.round(temperature_2m)+" °F", "wind "+Math.round(wind_speed_10m)+" mph"].filter(Boolean).join(" · ") + ". Ridge estimate for " + stamp + ".";
  } catch {
    statusLine.textContent = "Current conditions are unavailable. Open the local forecast below.";
  }
}
showWeather();
setInterval(showWeather, 15 * 60 * 1000);
