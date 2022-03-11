# Periodic Tables

This app can be used to keep a record of existing reservations for a restaurant. The app will display all reservations for today and you have the option to look ahead at future dates and their reservations. It has a simple user interface for creating and editing reservations and creating new tables. Users can also search all reservations (current and past) by mobile phone on the search screen. 

The live site can be found at this [link](https://blooming-mountain-client.herokuapp.com/dashboard).

The tables below describe the API endpoints and their responses:

### /reservations
Body attributes with a (\*)asterisk are required for a good request.
|        Route         | Request |     Body                |  Query params   |  Response     |
|:-------------------- |:------- |:-----------------------:| ---------------:| -------------:| 
| `/`                  | GET     |    | reservation_date, mobile_number | returns all reservations if no query is provided, returns matching ones if one is |
| `/`    |  POST  |  \*first_name, \*last_name, \*mobile_number, \*reservation_date, \*reservation_time, \*people, status |  | returns the newly created reservation |   
| `/:reservation_id`   | GET     |                         |                 | returns the data for the requested reservation     |
| `/:reservation_id`   | PUT     | \*first_name, \*last_name, \*mobile_number, \*reservation_date, \*reservation_time, \*people, status | | returns the updated reservation |
| `/:reservation_id/status` | PUT | \*status | | returns the updated reservation |
| `/:reservation_id/edit` | PUT | \*first_name, \*last_name, \*mobile_number, \*reservation_date, \*reservation_time, \*people, status | | returns the updated reservation | 

### /tables
Body attributes with a (\*)asterisk are required for a good request.
|        Route         | Request |     Body                |  Query params   |  Response     |
|:-------------------- |:------- |:-----------------------:| ---------------:| -------------:|
| `/`                  | GET     |                         |                 | returns all tables |
| `/`                  | POST    | \*table_name, \*capacity |                | returns the newly created table |
| `/:table_id/seat`    | PUT     | \*reservation_id        |                 | returns the updated table |
| `/:table_id/seat`    | DELETE  |                         |                 | returns the table which had its reservation_id data deleted |

## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your database instances.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5000`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode if you wish to make changes.
1. When pushing to your deployed app be sure to make use of the git subtree push --prefix <file> console command. This is important because this respository is a monorepo containing both front and back end.
1. After deploying with your chosen host be sure to set your `env` files up in your back-end and front-end.  

  
I recommend that you use [Heroku](https://devcenter.heroku.com/articles/deploying-nodejs) to deploy this project.
If you have trouble getting the server to run I'd be happy to try and help you set things up.

## Screenshots


## Technology Stack
  
* HTML
* CSS
* React
* Javascript
* Node.js
* Express
* Knex  
* Postgres  
