const db = require('./db')
const Fornecedor = require('./Fornecedor')
const Cliente = require('./cliente')

const Endereco = db.sequelize.define('endereco', {
  id:{
    type: db.Sequelize.STRING,
    primaryKey:true
  },
  endereco: {
    type: db.Sequelize.STRING
  },
  cep:{
    type: db.Sequelize.STRING
  },
  cidade:{
    type: db.Sequelize.STRING
  },
  uf: {
    type: db.Sequelize.STRING
  },
  pais: {
    type: db.Sequelize.STRING
  }
})
/**
 * ATUALIZAR AS TABELAS DE ENDERECO CLIENTE E FORNECEDOR
 * COLOCAR ROTA POST DE ENDERECO TANTO CLIENTE E TANTO FORNECEDOR
 * 
 * 
 */
//relacionamento endereco 
Endereco.belongsTo(Fornecedor,{
  foreignKey:"fornecedor_id",
  constraints:false
})
Fornecedor.hasOne(Endereco,{
  foreignKey:"fornecedor_id",
  constraints:false
})

//relacionamento
Endereco.belongsTo(Cliente,{
  foreignKey:"cliente_id",
  constraints:false
})
Cliente.hasOne(Endereco,{
  foreignKey:"cliente_id",
  constraints:false
})

// Endereco.sync()

module.exports = Endereco
