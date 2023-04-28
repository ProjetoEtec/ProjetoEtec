
const db = require("./db")


const Banner = db.sequelize.define('banner', {
  id: {
    type: db.Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  banner:{
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


// Banner.sync({force:true})

module.exports = Banner