
//load express
const express = require('express');
const hbs = require('hbs');

var app = express();

//tell express what is our view engine: handlebars
app.set('view engine', 'hbs');
//support to partial views
hbs.registerPartials(__dirname + '/views/partials');

//add middleware functions for help.html
app.use(express.static(__dirname + '/public' ));
app.use((request, response, next)=>{
    console.log('1');
    next();
});

//register helper functions used by handlebars template engine
hbs.registerHelper('getCurrentYear', ()=>{
    return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text)=>{
    return text.toUpperCase();
});

//set http handlers
//root route
app.get('/', (request, response)=>{
    response.render('home.hbs', {
        pageTitle: 'Home page',
        welcomeMessage: 'Welcome to some website',
        
    });
    //response.send({ name: 'Junior', likes: ['Madrid', 'Barcelona']});
})

//create a new route
app.get('/about', (request, response)=>{
    response.render('about.hbs', {
        pageTitle: 'About page',
        
    });
});

//create a new route
app.get('/bad', (request, response)=>{
    response.send({ error: 'Unable to fulfill this request'});
});

//bind app to a port in our server
app.listen(3000, ()=>{
    console.log('Server is up on port 3000');
});