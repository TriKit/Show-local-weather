$(document).ready(function(){

var APPID = '36d7fb01c0c77b29b8334f5a99dec53d';
var tempFarenheit;
var tempCelsius;
var loc;
var icon;
var humidity;
var wind;
var direction;

function updateByZip(zip) {
	var url = "http://api.openweathermap.org/data/2.5/weather?" + "zip=" + zip + "&APPID=" + APPID;
	sendRequest(url);
}

function updateByGeo(lat, lon) {
	var url = "http://api.openweathermap.org/data/2.5/weather?" + "lat=" + lat + "&lon=" + lon + "&APPID=" + APPID;
	sendRequest(url); 
}

function sendRequest(url) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
			var data = JSON.parse(xmlhttp.responseText);
			var weather = {};
			weather.icon = data.weather[0].icon;
			weather.humidity = data.main.humidity;
			weather.wind = data.wind.speed;
			weather.direction = degreesToDirection(data.wind.deg);
			weather.loc = data.name;
			weather.tempFarenheit = K2F(data.main.temp);
			weather.tempCelsius = K2C(data.main.temp);
			update(weather);
		} 
	};

	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function degreesToDirection(degrees) {
	var range = 360/16;
	var low = 360 - range/2;
	var high = (low + range)%360;
	var angles = ["N", "NNE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
	for (i in angles) {

		if( degrees >= low && degrees < high ) {
			return angles[i];
		}

		low = (low + range)% 360;
		high = (high + range)% 360;
	}
	return "N";
}

$('#pushme').click(function() { 
	if ($(this).text() == "FAREHNHEIT") {
		 $(this).text("CELSIUS");
		 $('#temperatureCelsius').show();
		 $('#temperatureFarenheit').hide();
	} else { 
		 $(this).text("FAREHNHEIT");
			$('#temperatureCelsius').hide();
		 $('#temperatureFarenheit').show();
	}; 
});

function K2F(k) {
	return Math.round(k*(9/5) - 459.67);
}

function K2C(k) {
	return Math.round(k - 273.15);
}

function update(weather) {
	tempCelsius.innerHTML = weather.tempCelsius;
	tempFarenheit.innerHTML = weather.tempFarenheit;
	loc.innerHTML = weather.loc;
	icon.src = "http://openweathermap.org/img/w/" + weather.icon + ".png";
	wind.innerHTML = weather.wind;
	direction.innerHTML = weather.direction;
	humidity.innerHTML = weather.humidity;
}

function showPosition(position) {
	updateByGeo(position.coords.latitude, position.coords.longitude);
}

window.onload = function() {
	tempCelsius = document.getElementById("temperatureCelsius");
	tempFarenheit = document.getElementById("temperatureFarenheit");
	loc = document.getElementById("location");
	icon = document.getElementById("icon");
	wind = document.getElementById("wind");
	humidity = document.getElementById("humidity");
	direction = document.getElementById("direction");

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		var zip = window.prompt("Could not discower your geolocation. What is your zip code?");
		updateByZip(zip);
	}
}
	
});