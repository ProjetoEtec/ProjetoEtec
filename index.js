const express = require('express');
const path = require('path');
const app = express();
const cliente = require('./routes/cliente')



//Configurações
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
app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get('/produto', (req, res) => { 
    res.render('pages/produto.ejs'); 
})

app.get('/carrinho', (req, res) => {
    res.render('pages/carrinho.ejs');
})

app.get('/fornecedor/cadastro', (req, res) => {
    res.render('pages/cadastrofornecedor.ejs');
})

app.get('/fornecedor/meus-produtos', (req, res) => {
    res.render('pages/meusprodutos.ejs');
})


const PORT = 3000;
app.listen(PORT, ()=>{
    console.log('Servidor rodando na porta '+PORT);
});