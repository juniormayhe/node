const axios = require('axios');

const yargs = require('yargs');
const argv = yargs
    .options({
        address: {
            demand: true,
            alias: 'a',
            describe: 'Address to fetch weather for',
            string: true /*input is a string */
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

let encodedAddress = encodeURIComponent(argv.address);

let geocodeURL = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;
//axios request
axios.get(geocodeURL)
    .then((response) => {
        if (response.data.status === 'ZERO_RESULTS'){
            throw new Error(`Unable to find the address ${argv.address}`);
        }

        console.log(response.data.results[0].formatted_address);
        
        //now get wether for that location
        let lat = response.data.results[0].geometry.location.lat;
        let lng = response.data.results[0].geometry.location.lng;
        const forecastAPIKey = 'ae4082386c9c0d65099a483a1fe16c01';
        const forecastURL = `https://api.darksky.net/forecast/${forecastAPIKey}/${lat},${lng}`;
        return axios.get(forecastURL);
    })
    .then((forecastResponse)=>{
        let temperature = forecastResponse.data.currently.temperature;
        let apparentTemperature = forecastResponse.data.currently.apparentTemperature;
        console.log(`It's currently: ${temperature}. Feels like ${apparentTemperature}`);

    })
    .catch((error)=>{
        
        if (error.code === 'ENOTFOUND')
            console.log(`Unable to connect to API service ${error.hostname}`);
        else
            console.log(error.message);
    });