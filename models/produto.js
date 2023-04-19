const db = require("./db")
const { Op } = require('sequelize');

const Fornecedor = require("./Fornecedor")

const Produto = db.sequelize.define('produto', {
  id: {
    type: db.Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  nome: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  preco: {
    type: db.Sequelize.FLOAT,
    allowNull: false
  },
  estoque: {
    type: db.Sequelize.INTEGER,
    allowNull: true
  },
  descricao: {
    type: db.Sequelize.STRING,
    allowNull: true
  },
  fornecedor_id: {
    type: db.Sequelize.STRING,
    allowNull: true
  }
});

// Definindo o relacionamento entre Fornecedor e Produto
Fornecedor.hasMany(Produto, {
  foreignKey: "fornecedor_id",
  constraints: false,
  scope: {
    fornecedor_id: {[Op.col]: 'fornecedor.id'}
  }
});
Produto.belongsTo(Fornecedor, {
  foreignKey: "fornecedor_id",
  constraints: false,
  targetKey: 'id'
});
// Fornecedor.sync({force:true})
// Produto.sync({force:true})

module.exports = Produto