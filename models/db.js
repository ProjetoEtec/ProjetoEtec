require('dotenv').config()
const Sequelize = require('sequelize')
const sequelize =  new Sequelize('projeto_etec','root','123456',{
  host:'localhost',
  dialect:"mysql",
  dialectModule:require('mysql2'),
  port: 3306,
  dialectOptions:{
    ssl:{
      rejectUnauthorized: false
    }
  }
})
console.log('Connected to PlanetScale!')

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

module.exports = {
  Sequelize:Sequelize,
  sequelize:sequelize
}