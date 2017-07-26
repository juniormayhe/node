const yargs = require('yargs');

const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

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

geocode.geocodeAddress(argv.address, (errorMessage, results)=> {
    if (errorMessage)
        console.log(errorMessage);
    else{
        console.log(JSON.stringify(results, undefined, 2));
        //ae4082386c9c0d65099a483a1fe16c01
        
        weather.getWeather(results.latitude,results.longitude, (errorMessage, result)=>{
            console.log(JSON.stringify(result, undefined, 2));
        });
        
    }
});

//https://api.darksky.net/forecast/[key]/[latitude],[longitude]