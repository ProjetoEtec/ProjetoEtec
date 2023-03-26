const db = require('./db')

const Cliente = db.sequelize.define("clientes", {
  nome:{
    type:db.Sequelize.STRING
  },
  cpf:{
    type:db.Sequelize.STRING
  },
  telefone:{
    type:db.Sequelize.STRING
  },
  complemento:{
    type:db.Sequelize.STRING
  },
  numero_casa:{
    type:db.Sequelize.STRING
  },email:{
    type:db.Sequelize.STRING
  },senha:{
    type:db.Sequelize.STRING
  }
})

//Cliente.sync({force:true})
module.exports = Cliente;