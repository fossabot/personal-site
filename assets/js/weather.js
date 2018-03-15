//import 'babel-polyfill';

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const precipitation = ["rain","snow","thunderstorms"];

const template_crag_boilerplate = require("./templates/crag_boilerplate.hbs");
const template_weather_observations = require("./templates/weather-observations.hbs");
const template_weather_forecasts = require("./templates/weather-forecasts.hbs");
const template_weather_hourly = require("./templates/weather-hourly.hbs");

const crags_json = '[{"number": 1, "name": "The Greenbelt", "station": "KATT", "office": "EWX/153,89", "coordinates": [-97.801,30.244]},' +
  '{"number": 2, "name": "Continental Ranch", "station": "KDRT", "office": "EWX/14,74", "coordinates": [-101.44,29.803]},' +
  '{"number": 3, "name": "Reimer\'s Ranch", "station": "KRYW", "office": "EWX/141,93", "coordinates": [-98.122,30.334]},' +
  '{"number": 4, "name": "Cochise Stronghold", "station": "KFHU", "office": "TWC/125,31", "coordinates": [-109.987,31.921]},' +
  '{"number": 5, "name": "Enchanted Rock", "station": "KT82", "office": "EWX/114,101", "coordinates": [-98.821,30.503]},' +
  '{"number": 6, "name": "Horseshoe Canyon Ranch", "station": "KHRO", "office": "LZK/44,127", "coordinates": [-93.292,36.012]},' +
  '{"number": 7, "name": "Last Chance Canyon", "station": "KGDP", "office": "MAF/16,149", "coordinates": [-104.754,32.234]},' +
  '{"number": 8, "name": "Georgetown", "station": "KGTU", "office": "EWX/157,106", "coordinates": [-97.69,30.627]},' +
  '{"number": 9, "name": "McKinney Falls", "station": "KAUS", "office": "EWX/156,86", "coordinates": [-97.722,30.181]}]';

const crags = JSON.parse(crags_json);

for (let c in crags) {
  // create crag boilerplate
  document.getElementById("weather").innerHTML += template_crag_boilerplate(crags[c]);

  axios.get('https://api.weather.gov/stations/' + crags[c].station + '/observations')
    .then(function (response) {
      populateObservations(crags[c], response.data.features);
    })
    .catch(function (error) {
      console.log(error);
    });

  axios.get('https://api.weather.gov/gridpoints/' + crags[c].office + '/forecast')
    .then(function (response) {
      populateForecasts(crags[c], response.data);
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
    case "wind_sct":
      return time + "_cloudy";
    case "bkn":
    case "wind_bkn":
    case "wind_bkn":
    case "ovc":
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

function populateForecasts(crag, data = []) {
  let forecasts = [];
  let half_day = false;
  let clear_forecast = true;

  forecasts.name = crag.name;
  forecasts.crag_index = crag.number;
  forecasts.updated = moment(data.properties.updated).format('MM/DD hh:mm a');
  forecasts.distance = getDistanceFromLatLonInMi(crag.coordinates[1], crag.coordinates[0], data.geometry.geometries[0].coordinates[1], data.geometry.geometries[0].coordinates[0]).toFixed(2);
  forecasts.periods = data.properties.periods
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
          if(half_day && i === data.properties.periods.length-1) {
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

  document.getElementById("last-forecast-"+crag.number).innerHTML = forecasts.updated;
  document.getElementById("office-"+crag.number).innerHTML = forecasts.distance + " miles";
  document.getElementById("forecast-"+crag.number).innerHTML = template_weather_forecasts(forecasts);

  axios.get('https://api.weather.gov/gridpoints/' + crag.office + '/forecast/hourly')
  .then(function (response) {
    populateHourlyForecasts(crag.number, forecasts.periods[0].startTime, response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
}

function populateHourlyForecasts(crag_index, week_start_time, data) {
  let hourly = [];
  //TODO make pretty
  let arr = [];
      arr[0] = [];
      arr[1] = [];
      arr[2] = [];
      arr[3] = [];
      arr[4] = [];
      arr[5] = [];
      arr[6] = [];

  hourly.days = data.properties.periods
    .reduce(function(a, b, i) {
      let left_icons = [];
      let right_icons = b.icon.substring(35,b.icon.length-11).split("/");
      if (i === 1) {
        left_icons = a.icon.substring(35,a.icon.length-11).split("/");
        delete a.number;
        delete a.detailedForecast;
        delete a.name;
        delete a.endTime;
        delete a.temperatureTrend;
        a.hour = moment(a.startTime).format('HH');
        a.svg = iconToSVG(left_icons[0], left_icons[1].split(",")[0]);
        a.color = (new RegExp(precipitation.join("|")).test(a.svg)) ? 'yellow' : 'green';
        if(moment(a.startTime).isSameOrAfter(moment(week_start_time), 'day')) {
          arr[days.indexOf(moment(a.startTime).format('dddd').toLowerCase())].push(a);
        }
        delete b.number;
        delete b.detailedForecast;
        delete b.name;
        delete b.endTime;
        delete b.temperatureTrend;
        b.hour = moment(b.startTime).format('HH');
        b.svg = iconToSVG(right_icons[0], right_icons[1].split(",")[0]);
        b.color = (new RegExp(precipitation.join("|")).test(b.svg)) ? 'yellow' : 'green';
        if(moment(b.startTime).isSameOrAfter(moment(week_start_time), 'day')) {
          arr[days.indexOf(moment(b.startTime).format('dddd').toLowerCase())].push(b);
        }
        return arr;
      } else {
        delete b.number;
        delete b.detailedForecast;
        delete b.name;
        delete b.endTime;
        delete b.temperatureTrend;
        b.hour = moment(b.startTime).format('HH');
        b.svg = iconToSVG(right_icons[0], right_icons[1].split(",")[0]);
        b.color = (new RegExp(precipitation.join("|")).test(b.svg)) ? 'yellow' : 'green';
        if(moment(b.startTime).isSameOrAfter(moment(week_start_time), 'day')) {
          a[days.indexOf(moment(b.startTime).format('dddd').toLowerCase())].push(b);
        }
        return a;
      }
    });

  // if less than 24, fill in the blanks with na.svg and delete the one that don't matter
  for (const [i, value] of hourly.days.entries()) {
    if(value.length < 24) {
      value.sort(function(a, b) { return +a.hour - +b.hour; });
      const last_hour = +value[value.length-1].hour;
      for (let i=last_hour+1; i < 24; i++) {
        let isDaytime = (i < 6 || i > 17) ? false : true;
        let svg = (i < 6 || i > 17) ? 'night_na' : 'day_na';
        value.push({
          'hour': i.toString().padStart(2, 0),
          'svg': svg,
          'isDaytime': isDaytime,
          'shortForecast': 'Not Available',
          'temperature': null,
          'color': 'light-gray'
        });
      }
    }
  }

  localStorage.setItem(crag_index, JSON.stringify(hourly.days));
}

function populateObservations(crag, data = []) {
  let observations = [];

  observations.name = crag.name;
  observations.crag_index = crag.number;
  observations.distance = getDistanceFromLatLonInMi(crag.coordinates[1], crag.coordinates[0], data[0].geometry.coordinates[1], data[0].geometry.coordinates[0]).toFixed(2);
  observations.curr_timestamp = moment(data[0].properties.timestamp).format('MM/DD hh:mm a');
  observations.curr_temp = (data[0].properties.temperature.value*(9/5)+32).toFixed(0);
  observations.curr_heat_index = (data[0].properties.heatIndex.value && observations.curr_temp != (data[0].properties.heatIndex.value*(9/5)+32).toFixed(0)) ? (data[0].properties.heatIndex.value*(9/5)+32).toFixed(0) : null;
  observations.curr_wind = (data[0].properties.windSpeed.value) ? (data[0].properties.windSpeed.value * 2.23694).toFixed(0) + "mph " + degreeToDirection(data[0].properties.windDirection.value) : null;
  observations.curr_wind_chill = (data[0].properties.windChill.value) ? (data[0].properties.windChill.value*(9/5)+32).toFixed(0) : null;
  observations.curr_humidity = (data[0].properties.relativeHumidity.value) ? data[0].properties.relativeHumidity.value.toFixed(0) : null;

  let total_inches = 0;

  const precips = data.slice(0, 48)
  .map(i => {
    total_inches += +i.properties.precipitationLastHour.value;
    return {
      'precip': +i.properties.precipitationLastHour.value,
      'date': moment(i.properties.timestamp).format('YY-MM-DD HH:mm')
    };
  });

  if(data[0].properties.precipitationLastHour.value > 0) {
    observations.color = 'light-red';
  } else if(total_inches > 0) {
    observations.color = 'yellow';
  } else {
    observations.color = 'green';
  }

  document.getElementById("crag-"+crag.number).classList.add("b--" + observations.color);
  document.getElementById("observation-"+crag.number).innerHTML += template_weather_observations(observations);
  graph_precip(crag.number, precips);
}

//TODO make responsive
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

$(document).on( "click", '.forecast-day', function() {
  const crag_index = $(this)[0].dataset.crag;
  const day_index = $(this)[0].dataset.day;
  const is_active = ($(this)[0].dataset.active == 'true');

  let hourly_forecast = (window.outerWidth > 480) ? document.getElementById('hourly-forecast-'+crag_index) : document.getElementById('hourly-forecast-'+crag_index+'-'+day_index);
  let daytime = document.getElementById(crag_index+'-daytime-'+day_index);
  let nighttime = document.getElementById(crag_index+'-nighttime-'+day_index);
  if(is_active) {
    hourly_forecast.classList.remove('flex');
    hourly_forecast.classList.add('dn');
    $(this).removeClass('bg-light-gray');
    $(this)[0].dataset.active = false;
    daytime.classList.add('bg-white');
    daytime.classList.remove('bg-near-white');
    nighttime.classList.add('bg-mid-gray');
    nighttime.classList.remove('bg-gray');
  } else {
    $('#forecast-'+crag_index+' .forecast-day').each(function(i, obj) {
      $(this)[0].dataset.active = false;
      $(this).removeClass('bg-light-gray');
    });
    $(this).addClass('bg-light-gray');
    $(this)[0].dataset.active = true;
    hourly_forecast.classList.remove('dn');
    hourly_forecast.classList.add('flex');
    $('#forecast-'+crag_index+' .daytime').each(function(i, obj) {
      $(this).removeClass('bg-near-white');
      $(this).addClass('bg-white');
    });
    daytime.classList.remove('bg-white');
    daytime.classList.add('bg-near-white');
    $('#forecast-'+crag_index+' .nighttime').each(function(i, obj) {
      $(this).removeClass('bg-gray');
      $(this).addClass('bg-mid-gray');
    });
    nighttime.classList.remove('bg-mid-gray');
    nighttime.classList.add('bg-gray');
  }

  const hourly = JSON.parse(localStorage.getItem(crag_index));

  hourly_forecast.innerHTML = template_weather_hourly(hourly[days.indexOf($(this).text().toLowerCase())]);
});

//TODO unset all hourly settings on all crags on window resize

/*
//TODO remove localStrage on tab closure
window.onbeforeunload = function() {
  for (let crag in crags) {
    localStorage.removeItem(crag.number);
  }
  return '';
};
*/
