require('dotenv').config()
const Sequelize = require('sequelize')
const sequelize =  new Sequelize('bd_projeto_etec',process.env.DATABASE_USERNAME,process.env.DATABASE_PASSWORD,{
  host:process.env.DATABASE_HOST,
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

// const sequelize =  new Sequelize('projeto_etec','root','jose2582',{
//   host:'localhost',
//   dialect:"mysql",
//   dialectModule:require('mysql2'),
//   port: 3306
// })
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