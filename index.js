const express = require('express')
const path = require('path')
const app = express()
const cliente = require('./routes/cliente')
const fornecedor = require('./routes/fornecedor')
const cadastroUser = require('./routes/cadastroUsuario')
const Fornecedor = require('./models/Fornecedor')
const Logo = require('./models/logo')
const Banner = require('./models/banner')
const { sequelize, Sequelize } = require('./models/db')
const Login = require('./models/login')
const Produto = require('./models/produto')
const session = require('express-session')
var SequelizeStore = require('connect-session-sequelize')(session.Store)
const flash = require('connect-flash')
const passport = require('passport')
const FotoProduto = require('./models/fotosDoProduto')
const extendDefaultFields = require('./models/session')
// cuidado !! isso é somente para atualizar todas as tabelas do banco de dados!!
// // require('./models/updatedb')

require('./config/auth')(passport)

//Configurações
//sessão
app.use(
  session({
    secret: 'wqeopiwqe',
    resave: false,
    store: new SequelizeStore({
      db: sequelize
    }),
    saveUninitialized: false,
    cookie: { maxAge: 90 * 60 * 1000 } // 90 minutos
  }))
  app.use(passport.session());
  app.use(passport.initialize())
  app.use(flash())
//middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = req.user || null
  if(!req.session.carrinho){
    req.session.carrinho=[]
  } 
  next()
})
//middleware
function isClienteAutheticated(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.type_user == 'cliente') return next()
  }
  req.session.save(()=>{
    res.redirect('/login')
  })
}
function isFornecedorAutheticated(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.type_user == 'fornecedor') return next()
  }
  req.flash('error_msg', 'Logue na sua conta como fornecedor')
  req.session.save(()=>{
    res.redirect('/login')
  })
}
function isNotFornecedor(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.type_user != 'fornecedor') return next()
    res.redirect('/fornecedor/minha-loja')
  } else {
    return next()
  }
}
//Template engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//Public
app.use(express.static(path.join(__dirname, 'public')))
//body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// rotas
app.use('/cliente', isClienteAutheticated, cliente)
app.use('/fornecedor', isFornecedorAutheticated, fornecedor)
app.use('/', cadastroUser)
app.post('/carrinho/add',(req, res) => {  
  req.session.carrinho.push({id:req.body.id,qtd:Number(req.body.qtd)})

  req.flash('success_msg','produto add com sucesso')
  req.session.save(()=>{
    res.redirect('back')
  })
})
app.get('/', isNotFornecedor ,async (req, res) => {
 
  const fornecedores = await Fornecedor.findAll({
    include: {model: Logo}
  })
  const produtos = await Produto.findAll({
    include: {
        model: FotoProduto,
        required: true
      },
    order: Sequelize.literal('rand()'),
    limit: 20
  })
  try {
    res.render('index.ejs', {
      fornecedores: fornecedores,
      produtos: produtos
    })
  } catch (err) {
    res.send(err.message)
  }
})

app.get('/produto', (req, res) => {
  res.render('pages/produto.ejs')
})

app.get('/loja-unica/:id', async (req, res) => {
  let fornecedor = await Fornecedor.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: Logo,
        required: true
      },
      {
        model: Banner,
        required: true
      }
    ]
  })
  let produtos = await Produto.findAll({
    where: { fornecedor_id: req.params.id },
    include: {
        model: FotoProduto,
        required: true
      }
  })
  res.render('pages/loja.ejs', { fornecedor: fornecedor, produtos: produtos })
})

app.get('/login', (req, res) => {
  if(req.query.fail){
    res.render('pages/login',{messages: "Usuario e/ou senha incorretos!"})
  } else {
    res.render('pages/login',messages = "")
  }
})

app.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/login?fail=true'}))

app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err)
    }
    req.flash('success_msg', 'Deslogado com sucesso')
    req.session.save(()=>{
      res.redirect('/')
    })
  })
})

app.get('/update/senha/:id', (req, res) => {
  erros = []

  Login.findOne({
    where: {
      id: req.params.id
    }
  }).then(login => {
    res.render('pages/alterarsenha', {
      login: login,
      erros: erros
    })
  })
})

app.post('/update/senha/func', (req, res) => {
  erros = []
  if (!req.body.senha_antiga || !req.body.senha_nova) {
    erros.push({ texto: 'Senha inválida' })
  }
  if (erros.length > 0) {
    res.redirect('back')
  } else {
    Login.findOne({
      where: {
        id: req.body.id
      }
    }).then(login => {
      if (login.senha != req.body.senha_antiga) {
        erros.push({ texto: 'Senha errada' })
      }
      if (!req.body.senha_antiga) {
        erros.push({ texto: 'Digite uma nova senha' })
      }
      if (erros.length > 0) {
        res.render('pages/alterarsenha', {
          login: login,
          erros: erros
        })
      } else {
        Login.update(
          {
            senha: req.body.senha_nova
          },
          {
            where: {
              id: req.body.id
            }
          }
        )
        req.flash('success_msg', 'Senha alterada com sucesso!')
        req.session.save(()=>{
          res.redirect('/')
        })
      }
      erros = []
    })
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT)
})
