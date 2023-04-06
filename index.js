const express = require('express');
const path = require('path');
const app = express();
const cliente = require('./routes/cliente')
const fornecedor = require('./routes/fornecedor')
const Login = require('./models/login');
const session = require('express-session')
const flash = require("connect-flash")


//Configurações
    //sessão
    app.use(session({
        secret: 'wqeopiwqe',
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())
    //middleware
    app.use((req, res, next) =>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })
    //Template engine
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname,'views'))

    //Public
    app.use(express.static(path.join(__dirname, 'public')));
    //body parser
    app.use(express.urlencoded({extended:false}))
    app.use(express.json())

// rotas
app.use('/cliente',cliente)
app.use('/fornecedor',fornecedor)
app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get('/produto', (req, res) => { 
    res.render('pages/produto.ejs'); 
})

app.get('/loja-unica/:id',(req, res) => {
    res.render('pages/lojaUnica.ejs');
})
app.get('/login', (req, res) =>{
  res.render('pages/login');
});

app.get('/update/senha/:id',(req,res)=>{
  erros = []

  Login.findOne({
    where:{
      id: req.params.id
    }
  }).then((login)=>{
    res.render('pages/alterarsenha', {
      login:login,
      erros:erros
    })
  })
})

app.post('/update/senha/func',(req,res)=>{
  erros = []
  if(!req.body.senha_antiga || !req.body.senha_nova){
    erros.push({texto:"Senha inválida"})
  }
  if(erros.length > 0 ){
    res.send("AA")
  } else {
    Login.findOne({
      where:{
        id: req.body.id
      }
    }).then((login)=>{
      console.log(login.senha + "  " + req.body.senha_antiga)
      if(login.senha != req.body.senha_antiga){
        erros.push({texto:"Senha errada"})
      }
      if(!req.body.senha_antiga){
        erros.push({texto:"Digite uma nova senha"})
      }
      if(erros.length > 0){
        res.render('pages/alterarsenha', {
          login:login,
          erros:erros
        })
      } else{
        Login.update({
          senha:req.body.senha_nova
        }, {
          where:{
            id:req.body.id
          }
        })
        req.flash("success_msg","Senha alterada com sucesso!")
        res.redirect('/cliente/update/'+login.id)
      }
      erros =[]
    })
  }
})

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log('Servidor rodando na porta '+PORT);
});