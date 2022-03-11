# Periodic Tables

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
1. Update the `./back-end/.env` file with the connection URL to your database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5000`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.

If you have trouble getting the server to run, reach out for assistance.

#### Screenshots

To help you better understand what might be happening during the end-to-end tests, screenshots are taken at various points in the test.

The screenshots are saved in `front-end/.screenshots` and you can review them after running the end-to-end tests.

You can use the screenshots to debug your code by rendering additional information on the screen.

## Product Backlog

The Product Manager has already created the user stories for _Periodic Tables_. Each of the user stories is listed below, and your Product Manager wants them to be implemented in the order in which they are listed. Another developer has already written the tests for each of the user stories so that you don't have to.

Although the user stories do not say anything about deployment, you should consider deploying early and often. You may even decide to deploy before adding any features. We recommend that you use [Heroku](https://devcenter.heroku.com/articles/deploying-nodejs) to deploy this project.

