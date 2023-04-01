const db = require('./db')

const Fornecedor = db.sequelize.define("fornecedores", {
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
  },
  data_nascimento:{
    type:db.Sequelize.STRING
  },
  email:{
    type:db.Sequelize.STRING
  },
  senha:{
    type:db.Sequelize.STRING
  },
})
// criar id automático
//Fornecedor.sync({force:true})
module.exports = Fornecedor;