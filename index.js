const express = require('express');
const path = require('path');
const app = express();
const cliente = require('./routes/cliente')

//Configurações
    //Template engine
    app.set('view engine', 'ejs');
    //Public
    app.use(express.static(path.join(__dirname, 'public')));

// rotas
app.use('/cliente',cliente)
app.get('/', (req, res) => {
    res.render('index.ejs');
})


const PORT = 3000;
app.listen(PORT, ()=>{
    console.log('Servidor rodando na porta '+PORT);
});