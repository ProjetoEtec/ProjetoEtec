const db = require("./db")
const { Op } = require('sequelize');

const Produto = require("./produto")

const FotoProduto = db.sequelize.define('fotoProduto', {
  id: {
    type: db.Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  foto:{
    type: db.Sequelize.BLOB('long')
  },
  tipo:{
    type:db.Sequelize.STRING,
    allowNull:false
  },
  produto_id: {
    type: db.Sequelize.STRING,
    allowNull: true
  }
});

// Definindo o relacionamento entre produto e fotos do produto
Produto.hasMany(FotoProduto, {
  foreignKey: "produto_id",
  constraints: false,
  scope: {
    produto_id: {[Op.col]: 'produto.id'}
  }
});
FotoProduto.belongsTo(Produto, {
  foreignKey: "produto_id",
  constraints: false,
  targetKey: 'id'
});
// Produto.sync({force:true})
// FotoProduto.sync({force:true})

module.exports = FotoProduto