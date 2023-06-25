const db = require('./db')
const Cliente = require('./cliente')
const Produto = require('./produto')
const { Op } = require('sequelize');
const Fornecedor = require('./Fornecedor');

const Pedido = db.sequelize.define('pedido',{
  id:{
    type: db.Sequelize.STRING,
    primaryKey: true
  },
  data_pedido:{
    type: db.Sequelize.STRING
  },
  frete:{
    type: db.Sequelize.STRING
  },
  situacao_pedido:{
    type: db.Sequelize.STRING
  }
})

const detalhesDoPedido = db.sequelize.define('detalhes_do_pedido',{
  id:{
    type: db.Sequelize.STRING,
    primaryKey: true
  },
  produto_id:{
    type: db.Sequelize.STRING
  },
  quantidade:{
    type: db.Sequelize.STRING
  },
  preco:{
    type: db.Sequelize.STRING
  }
})
//relacionamento cliente com pedido
Pedido.belongsTo(Cliente, {
  foreignKey: "cliente_id",
  constraints: false
})

Cliente.hasMany(Pedido, {
  foreignKey: "cliente_id",
  constraints: false,
  scope: {
    cliente_id: {[Op.col]: 'cliente.id'}
  }
})
//relacionamento pedido com detalhes do pedido

detalhesDoPedido.belongsTo(Pedido, {
  foreignKey: "pedido_id",
  constraints: false
})
Pedido.hasMany(detalhesDoPedido, {
  foreignKey: "pedido_id",
  constraints: false
})
//pedido e fornecedor
detalhesDoPedido.hasMany(Produto,{
  foreignKey: "produto_id", 
  constraints: false
})
Produto.belongsTo(detalhesDoPedido,{
  foreignKey: "produto_id", 
  constraints: false
})
//pedido e fornecedor
Pedido.belongsTo(Fornecedor,{
  foreignKey: "fornecedor_id",
  constraints: false
})
Fornecedor.hasMany(Pedido, {
  foreignKey: "fornecedor_id",
  constraints: false,
  scope: {
    cliente_id: {[Op.col]: 'cliente.id'}
  }
})

// Pedido.sync({force:true})
// detalhesDoPedido.sync({force:true})
// Produto.sync({force:true})
// Cliente.sync({force:true})

module.exports = {Pedido:Pedido, detalhesDoPedido:detalhesDoPedido}