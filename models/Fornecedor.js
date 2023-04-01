const db = require('./db')

const Fornecedor = db.sequelize.define("fornecedores", {
  nome:{
    type:db.Sequelize.STRING
  }
})
// criar id automático
//Fornecedor.sync({force:true})
module.exports = Fornecedor;