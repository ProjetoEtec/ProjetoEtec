const db = require("./db")

const session = db.sequelize.define("Session", {
  sid: {
    type: db.Sequelize.STRING,
    primaryKey: true,
  },
  userId: db.Sequelize.STRING,
  expires: db.Sequelize.DATE,
  data: db.Sequelize.TEXT,
});

function extendDefaultFields(defaults, session) {
  return {
    data: defaults.data,
    expires: defaults.expires,
    userId: session.userId,
  };
}

// session.sync()

module.exports = extendDefaultFields