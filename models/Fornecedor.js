const db = require('./db')
const Login = require('./login')
const Logo = require('./logo')
const Banner = require('./banner')
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
  descricao:{
    type:db.Sequelize.STRING
  }
})
// criar id automático
// Fornecedor.sync({force:true})
// Banner.sync({force:true})
// Logo.sync({force:true})

Banner.belongsTo(Fornecedor,{
  foreignKey:"fornecedor_id",
  constraints:false
})
Fornecedor.hasOne(Banner,{
  foreignKey:"fornecedor_id",
  constraints:false
})
Logo.belongsTo(Fornecedor,{
  foreignKey:"fornecedor_id",
  constraints:false
})
Fornecedor.hasOne(Logo,{
  foreignKey:"fornecedor_id",
  constraints:false
})



module.exports = Fornecedor;