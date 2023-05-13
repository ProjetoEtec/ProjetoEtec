const db = require('./db')
const Fornecedor = require('./Fornecedor')

const Endereco = db.sequelize.define('endereco', {
  id:{
    type: db.Sequelize.STRING,
    primaryKey:true
  },
  endereco: {
    type: db.Sequelize.STRING
  },
  uf: {
    type: db.Sequelize.STRING
  },
  cep:{
    type: db.Sequelize.STRING
  },
  complemento:{
    type: db.Sequelize.STRING
  },  cep:{
    type: db.Sequelize.STRING
  }
})
// Fornecedor.sync({force:true})
// Cliente.sync({force:true})
// Login.sync({force:true})

module.exports = Login
