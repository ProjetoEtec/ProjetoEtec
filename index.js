const express = require('express');
const path = require('path');
const app = express();
const cliente = require('./routes/cliente')
const fornecedor = require('./routes/fornecedor')
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
        res.locals.success_msg = req.flash("success_msg ")
        res.locals.error_msg = req.flash("error_msg ")
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
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log('Servidor rodando na porta '+PORT);
});