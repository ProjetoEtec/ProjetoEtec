const express = require('express');
const path = require('path');
const app = express();
const cliente = require('./routes/cliente')



//Configurações
    //Template engine
    app.set('view engine', 'ejs');
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


const PORT = 3000;
app.listen(PORT, ()=>{
    console.log('Servidor rodando na porta '+PORT);
});