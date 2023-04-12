// fazer a authenticação e login

const localStrategy = require("passport-local").Strategy
const sequelize = require("sequelize")

// Model de usuário
require("../models/login")
const Login = require('../models/login')

module.exports = async function(passport){
   passport.use("login",new localStrategy({
    usernameField:'email',
    passwordField:'senha'},
    async (email,senha,done)=>{
       let result = await Login.findOne({ where:{ email: email } }, function (err, result) {
        if (err) { return done(err); }
      });
      console.log(result)
      if (!result) { return done(null, false); }
      if (result.senha != senha) { return done(null, false); }
      return done(null, result);
  }))

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(async function(id, done) {
    let result = await Login.findByPk(id)
    done(null,result)
  });
}