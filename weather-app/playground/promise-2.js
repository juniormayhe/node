
const request = require('request');

var geocodeAddress = (address)=> {
    return new Promise((resolve, reject) =>{
        let encodedAddress = encodeURIComponent(address);

            request({
                url: `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
                json: true
            }, (error, response, body)=> {
                
                if (error)
                {
                    reject('Unable to connect to Google');
                }
                else if (body.status==='ZERO_RESULTS'){
                    reject(`Unable to find address ${address}`);
                }
                else if (body.status ==='OK'){
                    resolve({ 
                        address: body.results[0].formatted_address,
                        latitude: body.results[0].geometry.location.lat,
                        longitude: body.results[0].geometry.location.lng,
                    });
                }
            });//request


    });//promise
};

geocodeAddress('22040-001, Copacabana')
    .then((location) => {
        console.log(JSON.stringify(location, undefined, 2));
    })
    .catch((errorMessage)=> console.log(errorMessage));