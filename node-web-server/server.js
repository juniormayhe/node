
//load express
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//get OS environment variable PORT for heroku or set 3000 if null
const port = process.env.PORT || 3000;

var app = express();

//tell express what is our view engine: handlebars
app.set('view engine', 'hbs');

//register views folder
app.set('views', __dirname + '/views');

//support to partial views
hbs.registerPartials(__dirname + '/views/partials');


//add middleware functions for help.html
app.use((request, response, next)=>{
    let now = new Date().toString();
    var log = `${now}: ${request.method} ${request.url}`;
    console.log(__dirname + '/server.log');
    fs.appendFile('server.log', log +'\n',  (error)=> {
        if (error)
            console.log('Unable to append to server.log');
    });
    next();
});
//app.use((request, response, next)=> {
    //response.render('maintenance.hbs');
    //we did not call next and we interrupt the script
//});
app.use(express.static(__dirname + '/public' ));

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

//create a new route for projects
app.get('/projects', (request, response)=>{
    response.render('projects.hbs', {
        pageTitle: 'Projects page',
		portfolioMessage: 'My portfolio'
        
    });
});

//create a new route
app.get('/bad', (request, response)=>{
    response.send({ error: 'Unable to fulfill this request'});
});

//bind app to a port in our server
app.listen(port, ()=>{
    console.log(`Server is up on port ${port}`);
});
