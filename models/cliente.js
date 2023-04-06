const db = require('./db')

const Cliente = db.sequelize.define("clientes", {
  id:{
    type: db.Sequelize.STRING,
    primaryKey:true
  },
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
  data_nascimento:{
    type:db.Sequelize.STRING
  },
  numero_casa:{
    type:db.Sequelize.STRING
  }
})

// login.sync()
// Cliente.sync({force:true})
// criar id automático
module.exports = Cliente;