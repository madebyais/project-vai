INEQUALITY CALCULATOR
----------------------

### How-To

There are several requirements, as below:

1. Make sure that you have install NodeJS, since this application is build using NodeJS `v6.11.3`
2. Please make sure that you have install MySQL
3. Clone this project and execute this command: `npm install`
4. Open database configuration under config folder, `config/database.js` file, according to your database config.
5. Then change the environment in `env.js` to `development` if you are developing, or `production` if you are using it for production.
6. Once, all have been setup, please run the application using `npm start`.
7. Open your browser and access `http://localhost:9000/`, it will render a page and you can use it to call all the API.

Enjoy!

### Features

POST /api/upload
GET  /api/top-10
GET  /api/bottom-50
GET  /api/wealth-inequality
GET  /api/income-inequality
POST /api/saving-capacity
POST /api/predict-wealth
POST /api/predict-income
