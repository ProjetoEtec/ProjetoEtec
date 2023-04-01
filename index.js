const express = require('express');
const path = require('path');
const app = express();
const cliente = require('./routes/cliente')
const fornecedor = require('./routes/fornecedor')


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

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log('Servidor rodando na porta '+PORT);
});