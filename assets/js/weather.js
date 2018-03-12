//import 'babel-polyfill';

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const template_crag_boilerplate = require("./templates/crag_boilerplate.hbs");
const template_weather_observations = require("./templates/weather-observations.hbs");
const template_weather_forecasts = require("./templates/weather-forecasts.hbs");

const crags_json = '[{"number": 1, "name": "The Greenbelt", "station": "KATT", "office": "EWX/153,89", "coordinates": [-97.801,30.244]},' +
  '{"number": 2, "name": "Continental Ranch", "station": "KDRT", "office": "EWX/14,74", "coordinates": [-101.44,29.803]},' +
  '{"number": 3, "name": "Reimer\'s Ranch", "station": "KRYW", "office": "EWX/141,93", "coordinates": [-98.122,30.334]},' +
  '{"number": 4, "name": "Cochise Stronghold", "station": "KFHU", "office": "TWC/125,31", "coordinates": [-109.987,31.921]},' +
  '{"number": 5, "name": "Enchanted Rock", "station": "KT82", "office": "EWX/114,101", "coordinates": [-98.821,30.503]},' +
  '{"number": 6, "name": "Horseshoe Canyon Ranch", "station": "KHRO", "office": "LZK/44,127", "coordinates": [-93.292,36.012]},' +
  '{"number": 7, "name": "Last Chance Canyon", "station": "KGDP", "office": "MAF/16,149", "coordinates": [-104.754,32.234]},' +
  '{"number": 8, "name": "McKinney Falls", "station": "KAUS", "office": "EWX/156,86", "coordinates": [-97.722,30.181]},' +
  '{"number": 9, "name": "Georgetown", "station": "KGTU", "office": "EWX/157,106", "coordinates": [-97.69,30.627]}]';

const crags = JSON.parse(crags_json);

for (let c in crags) {
  // create crag boilerplate
  document.getElementById("weather").innerHTML += template_crag_boilerplate(crags[c]);

  axios.get('https://api.weather.gov/stations/' + crags[c].station + '/observations')
    .then(function (response) {
      populateObservations(crags[c].number, crags[c].name, crags[c].coordinates , response.data.features);
    })
    .catch(function (error) {
      console.log(error);
    });

  axios.get('https://api.weather.gov/gridpoints/' + crags[c].office + '/forecast')
    .then(function (response) {
      populateForecasts(crags[c].number, crags[c].name, crags[c].coordinates , response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

function getDistanceFromLatLonInMi(lat1,lon1,lat2,lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c * 0.621371; // Distance in miles
  return d;
}

//TODO change to 3 letter abbreviation
function calcPoint(input) {
  const j = input % 8;
  input = (input / 8)|0 % 4;
  const cardinal = ['north', 'east', 'south', 'west'];
  const pointDesc = ['1', '1 by 2', '1-C', 'C by 1', 'C', 'C by 2', '2-C', '2 by 1'];

  const str1 = cardinal[input];
  const str2 = cardinal[(input + 1) % 4];
  const strC = (str1 == cardinal[0] | str1 == cardinal[2]) ? str1 + str2 : str2 + str1;

  return pointDesc[j].r(1, str1).r(2, str2).r('C', strC);
}

function degreeToDirection(degree) {
  let s = String;
  s.prototype.r = s.prototype.replace;

  let input = degree / 11.25;
  input = input+.5|0;

  let direction = calcPoint(input);
  direction = direction[0].toUpperCase() + direction.slice(1);

  return direction;
}

function iconToSVG(time, icon) {
  switch(icon) {
    case "skc":
      return time + "_clear";
    case "fog":
      return time + "_fog";
    case "few":
    case "wind_few":
    case "sct":
    case "bkn":
    case "wind_sct":
      return time + "_cloudy";
    case "wind_bkn":
    case "wind_bkn":
      return time + "_overcast";
    case "rain":
    case "rain_showers":
      return time + "_rain";
    case "tsra":
    case "tsra_sct":
    case "tsra_hi":
      return time + "_thunderstorms";
    case "snow":
      return time + "_snow";
    default:
      return time + "_na";
  }
}

function populateForecasts(crag_index, crag_name, crag_location, forecasts_data = []) {
  let forecasts = [];
  let half_day = false;
  let clear_forecast = true;
  const precipitation = ["rain","snow","thunderstorms"];

  forecasts.name = crag_name;
  forecasts.crag_index = crag_index;
  forecasts.updated = moment(forecasts_data.properties.updated).format('MM/DD hh:mm a');
  forecasts.distance = getDistanceFromLatLonInMi(crag_location[1], crag_location[0], forecasts_data.geometry.geometries[0].coordinates[1], forecasts_data.geometry.geometries[0].coordinates[0]).toFixed(2);
  forecasts.periods = forecasts_data.properties.periods
    .reduce(function(a, b, i) {
      let day_icons = [];
      let night_icons = b.icon.substring(35,b.icon.length-12).split("/");
      if (i === 1) {
        day_icons = a.icon.substring(35,a.icon.length-12).split("/");
        let arr = [];
        // The first period is a half day
        if(days.indexOf(b.name.toLowerCase()) >= 0) {
          half_day = true;
          arr.push(b);
          return arr;
        } else {
          a.name = "Today";
          a.night_temperature = b.temperature;
          a.night_shortForecast = b.shortForecast;
          a.icon_split = (day_icons.length-1 > 1) ? true: false;
          a.icon_left = iconToSVG(day_icons[0], day_icons[1].split(",")[0]);
          a.icon_left_text = (day_icons[1].split(",")[1]) ? day_icons[1].split(",")[1]+'%' : '';
          a.icon_right = (day_icons.length-1 > 1) ? iconToSVG(day_icons[0],day_icons[2].split(",")[0]) :  null;
          a.icon_right_text = (a.icon_right && day_icons[2].split(",")[1]) ? day_icons[2].split(",")[1]+'%' : '';
          a.night_icon_split = (night_icons.length-1 > 1) ? true: false;
          a.night_icon_left = iconToSVG(night_icons[0], night_icons[1].split(",")[0]);
          a.night_icon_left_text = (night_icons[1].split(",")[1]) ? night_icons[1].split(",")[1]+'%' : '';
          a.night_icon_right = (night_icons.length-1 > 1) ? iconToSVG(night_icons[0],night_icons[2].split(",")[0]) :  null;
          a.night_icon_right_text = (a.night_icon_right && night_icons[2].split(",")[1]) ? night_icons[2].split(",")[1]+'%' : '';
          a.icon_text = (a.night_icon_left_text || a.night_icon_right_text) ? a.icon_left_text + " &rarr; " + a.icon_right_text : '&nbsp;';
          a.night_icon_text = (a.night_icon_left_text || a.night_icon_right_text) ?  a.night_icon_left_text + " &rarr; " + a.night_icon_right_text : '&nbsp;';
          // two icons, but they are the same
          a.icon_split = (a.icon_left === a.icon_right) ? false : a.icon_split;
          a.night_icon_split = (a.night_icon_left === a.night_icon_right) ? false : a.night_icon_split;
          delete a.number;
          delete a.startTime;
          delete a.endTime;
          delete a.isDaytime;
          delete a.temperatureUnit;
          delete a.temperatureTrend;
          if(new RegExp(precipitation.join("|")).test(a.icon_left) || new RegExp(precipitation.join("|")).test(a.night_icon_left)) {
            clear_forecast = false;
          }
          arr.push(a);
          return arr;
        }
      } else {
        day_icons = a[a.length-1].icon.substring(35,a[a.length-1].icon.length-12).split("/");
        if((!half_day && i % 2 === 0) || (half_day && i % 2 != 0)) {
          if(half_day && i === forecasts_data.properties.periods.length-1) {
            b.night_temperature = null;
            b.night_shortForecast = null;
            b.icon_split = (day_icons.length-1 > 1) ? true: false;
            b.icon_left = iconToSVG(day_icons[0], day_icons[1].split(",")[0]);
            b.icon_left_text = (day_icons[1].split(",")[1]) ? day_icons[1].split(",")[1]+'%' : '';
            b.icon_right = (day_icons.length-1 > 1) ? iconToSVG(day_icons[0],day_icons[2].split(",")[0]) :  null;
            b.icon_right_text = (b.icon_right && day_icons[2].split(",")[1]) ? day_icons[2].split(",")[1]+'%' : '';
            b.night_icon_split = (night_icons.length-1 > 1) ? true: false;
            b.night_icon_left = iconToSVG(night_icons[0], night_icons[1].split(",")[0]);
            b.night_icon_left_text = (night_icons[1].split(",")[1]) ? night_icons[1].split(",")[1]+'%' : '';
            b.night_icon_right = (night_icons.length-1 > 1) ? iconToSVG(night_icons[0],night_icons[2].split(",")[0]) :  null;
            b.night_icon_right_text = (b.night_icon_right && night_icons[2].split(",")[1]) ? night_icons[2].split(",")[1]+'%' : '';
            b.icon_text = (b.icon_left_text || b.icon_right_text) ? b.icon_left_text + " &rarr; " + b.icon_right_text : '&nbsp;';
            b.night_icon_text = (b.night_icon_left_text || b.night_icon_right_text) ? b.night_icon_left_text + " &rarr; " + b.night_icon_right_text : '&nbsp;';
            // two icons, but they are the same
            b.icon_split = (b.icon_left === b.icon_right) ? false : b.icon_split;
            b.night_icon_split = (b.night_icon_left === b.night_icon_right) ? false : b.night_icon_split;
            delete b.number;
            delete b.startTime;
            delete b.endTime;
            delete b.isDaytime;
            delete b.temperatureUnit;
            delete b.temperatureTrend;
            if(new RegExp(precipitation.join("|")).test(b.icon_left) || new RegExp(precipitation.join("|")).test(b.night_icon_left)) {
              clear_forecast = false;
            }
            a.push(b);
          } else {
            a.push(b);
          }
          return a;
        } else {
          a[a.length-1].night_temperature = b.temperature;
          a[a.length-1].night_shortForecast = b.shortForecast;
          a[a.length-1].icon_split = (day_icons.length-1 > 1) ? true: false;
          a[a.length-1].icon_left = iconToSVG(day_icons[0], day_icons[1].split(",")[0]);
          a[a.length-1].icon_left_text = (day_icons[1].split(",")[1]) ? day_icons[1].split(",")[1]+'%' : '';
          a[a.length-1].icon_right = (day_icons.length-1 > 1) ? iconToSVG(day_icons[0],day_icons[2].split(",")[0]) :  null;
          a[a.length-1].icon_right_text = (a.icon_right && day_icons[2].split(",")[1]) ? day_icons[2].split(",")[1]+'%' : '';
          a[a.length-1].night_icon_split = (night_icons.length-1 > 1) ? true: false;
          a[a.length-1].night_icon_left = iconToSVG(night_icons[0], night_icons[1].split(",")[0]);
          a[a.length-1].night_icon_left_text = (night_icons[1].split(",")[1]) ? night_icons[1].split(",")[1]+'%' : '';
          a[a.length-1].night_icon_right = (night_icons.length-1 > 1) ? iconToSVG(night_icons[0],night_icons[2].split(",")[0]) :  null;
          a[a.length-1].night_icon_right_text = (a[a.length-1].night_icon_right && night_icons[2].split(",")[1]) ? night_icons[2].split(",")[1]+'%' : '';
          a[a.length-1].icon_text = (a[a.length-1].icon_left_text || a[a.length-1].icon_right_text) ? a[a.length-1].icon_left_text+' &rarr; '+a[a.length-1].icon_right_text : '&nbsp;';
          a[a.length-1].night_icon_text = (a[a.length-1].night_icon_left_text || a[a.length-1].night_icon_right_text) ? a[a.length-1].night_icon_left_text+' &rarr; '+a[a.length-1].night_icon_right_text : '&nbsp;';
          // two icons, but they are the same
          a[a.length-1].icon_split = (a[a.length-1].icon_left === a[a.length-1].icon_right) ? false : a[a.length-1].icon_split;
          a[a.length-1].night_icon_split = (a[a.length-1].night_icon_left === a[a.length-1].night_icon_right) ? false : a[a.length-1].night_icon_split;
          delete a[a.length-1].number;
          delete a[a.length-1].startTime;
          delete a[a.length-1].endTime;
          delete a[a.length-1].isDaytime;
          delete a[a.length-1].temperatureUnit;
          delete a[a.length-1].temperatureTrend;
          if(new RegExp(precipitation.join("|")).test(a[a.length-1].icon_left) || new RegExp(precipitation.join("|")).test(a[a.length-1].night_icon_left)) {
            clear_forecast = false;
          }
          return a;
        }
      }
    });
  forecasts.color = (clear_forecast) ? 'green' : 'yellow';

  document.getElementById("last-forecast-"+crag_index).innerHTML = forecasts.updated;
  document.getElementById("office-"+crag_index).innerHTML = forecasts.distance + " miles";
  document.getElementById("forecast-"+crag_index).classList.add("b--" + forecasts.color);
  document.getElementById("forecast-"+crag_index).innerHTML = template_weather_forecasts(forecasts);
}

function populateObservations(crag_index, crag_name, crag_location, observations_data = []) {
  let observations = [];

  observations.name = crag_name;
  observations.crag_index = crag_index;
  observations.distance = getDistanceFromLatLonInMi(crag_location[1], crag_location[0], observations_data[0].geometry.coordinates[1], observations_data[0].geometry.coordinates[0]).toFixed(2);
  observations.curr_timestamp = moment(observations_data[0].properties.timestamp).format('MM/DD hh:mm a');
  observations.curr_temp = (observations_data[0].properties.temperature.value*(9/5)+32).toFixed(0);
  observations.curr_heat_index = (observations_data[0].properties.heatIndex.value && observations.curr_temp != (observations_data[0].properties.heatIndex.value*(9/5)+32).toFixed(0)) ? (observations_data[0].properties.heatIndex.value*(9/5)+32).toFixed(0) : null;
  observations.curr_wind = (observations_data[0].properties.windSpeed.value) ? (observations_data[0].properties.windSpeed.value * 2.23694).toFixed(0) + "mph " + degreeToDirection(observations_data[0].properties.windDirection.value) : null;
  observations.curr_wind_chill = (observations_data[0].properties.windChill.value) ? (observations_data[0].properties.windChill.value*(9/5)+32).toFixed(0) : null;
  observations.curr_humidity = (observations_data[0].properties.relativeHumidity.value) ? observations_data[0].properties.relativeHumidity.value.toFixed(0) : null;

  let total_inches = 0;

  const precips = observations_data.slice(0, 48)
  .map(i => {
    total_inches += +i.properties.precipitationLastHour.value;
    return {
      'precip': +i.properties.precipitationLastHour.value,
      'date': moment(i.properties.timestamp).format('YY-MM-DD HH:mm')
    };
  });

  if(observations_data[0].properties.precipitationLastHour.value > 0) {
    observations.color = 'light-red';
  } else if(total_inches > 0) {
    observations.color = 'yellow';
  } else {
    observations.color = 'green';
  }

  document.getElementById("crag-"+crag_index).classList.add("b--" + observations.color);
  document.getElementById("observation-"+crag_index).innerHTML += template_weather_observations(observations);
  graph_precip(crag_index, precips);
}

function graph_precip(crag_index, data) {
  const svg = d3.select("#precip-"+crag_index);
  const margin = {top: 20, right: 15, bottom: 20, left: 15};
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;
  let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const parseTime = d3.timeParse("%y-%m-%d %H:%M");

  const x = d3.scaleTime()
    .rangeRound([0, width]);

  const y = d3.scaleLinear()
    .rangeRound([height, 0]);

  const line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.precip); });

  data = data
    .map(i => {
      i.date = parseTime(i.date);
      return i;
    });

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.precip; }));

  g.append("g")
    .attr("class", "precip-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5))
    .select(".domain")
    .remove();

  g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "#555555")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);
}
