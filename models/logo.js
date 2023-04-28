
const db = require("./db")


const Logo = db.sequelize.define('logo', {
  id: {
    type: db.Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  logo:{
    type: db.Sequelize.BLOB('long')
  },
  tipo:{
    type: db.Sequelize.BLOB('long')
  },
  fornecedor_id: {
    type: db.Sequelize.STRING,
    allowNull: true
  }
});

// Logo.sync({force:true})

module.exports = Logo