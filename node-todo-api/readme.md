# TodoApp

      ______          __      ___              
     /_  __/___  ____/ /___  /   |  ____  ____ 
      / / / __ \/ __  / __ \/ /| | / __ \/ __ \
     / / / /_/ / /_/ / /_/ / ___ |/ /_/ / /_/ /
    /_/  \____/\__,_/\____/_/  |_/ .___/ .___/ 
                                /_/   /_/     

## API URL

Deployed Todos API at heroku can be found with Postman by using an URL like:
https://nameless-refuge-45938.herokuapp.com/todos

or locally
http://localhost:3000/todos

## Heroku Setup

### Create a heroku app at your root folder
    heroku create

### Check if you already have heroku repo configured
    git remote -v

In case the remote heroku repo is not shown, manually add your heroku remote (after heroku create):

    heroku git:remote -a nameless-refuge-45938

In case you have a misconfigured heroku repo, remove it, then add the just created repo

    git remote remove heroku

    heroku git:remote -a nameless-refuge-45938

### Set your environment database to use your mLab (noSQL) account
    heroku config:set MONGODB_URI=mongodb://your_db_user:your_password@ds123456.mlab.com:63397/node-todo-api

Instead, you could use mLab addon from Heroku site, but you will need to provide credit card info so your identity could be verified for security reasons:

    heroku addons:create mongolab:sandbox

### Publish changes to your git and publish heroku

    git commit -am 'adding files' && git push && git push heroku master

### Check errors in heroku

    heroku logs
