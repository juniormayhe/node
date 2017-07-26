const request = require('request');

var getWeather = (lat, lng, callback)=> {
    const forecastAPIKey = 'ae4082386c9c0d65099a483a1fe16c01';
    const forecastURL = `https://api.darksky.net/forecast/${forecastAPIKey}/${lat},${lng}`;
    
    request({url: forecastURL, json: true}, 
        (error, response, body)=> {
            if (!error && response.statusCode ===200){
                
            }
            else {
                callback('Unable to fetch weather');
            }   
        }
    );
}

module.exports.getWeather = getWeather;