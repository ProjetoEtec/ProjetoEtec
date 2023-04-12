// MODEL DE USUARIOS, LOGIN, COM RELACIONAMENTO
// PRECISA MUDAR O JEITO DE FAZER OS OUTROS DOIS MODELS
const db = require('./db')
const Cliente = require('./cliente')
const Fornecedor = require('./Fornecedor')

const Login = db.sequelize.define('login', {
  id:{
    type: db.Sequelize.STRING,
    primaryKey:true
  },
  email: {
    type: db.Sequelize.STRING
  },
  senha: {
    type: db.Sequelize.STRING
  },
  type_user:{
    type: db.Sequelize.STRING
  }
})
// Fornecedor.sync({force:true})
// Cliente.sync({force:true})
// Login.sync({force:true})

module.exports = Login
