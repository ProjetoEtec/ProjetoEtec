const db = require('./db')
const Login = require('./login')
const Fornecedor = db.sequelize.define("fornecedores", {
  id:{
    type: db.Sequelize.STRING,
    primaryKey:true
  },
  razao_social:{
    type:db.Sequelize.STRING
  },
  nome_fantasia:{
    type:db.Sequelize.STRING
  },
  cnpj:{
    type:db.Sequelize.STRING
  },
  telefone:{
    type:db.Sequelize.STRING
  },
  telefone:{
    type:db.Sequelize.STRING
  }
})
// criar id automático
// Fornecedor.sync({force:true})
module.exports = Fornecedor;