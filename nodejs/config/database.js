module.exports = {

  development: {
    mysql: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'madebyais',
      database: 'wealthincomeus'
    }
  },

  staging: {},

  production: {
    mysql: {
      host: 'localhost:3306',
      user: 'root',
      password: 'madebyais',
      database: 'wealthincomeus'
    }
  }

}
