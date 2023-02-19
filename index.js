const express = require('express');
const path = require('path');
const app = express();

//Configurações
    //Template engine
    app.set('view engine', 'ejs');
    //Public
    app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index.ejs');
})
app.get('/cadastro', (req, res) =>{
    res.render('pages/cliente/cadastro');
})
app.get('/login', (req, res) =>{
    res.render('pages/cliente/login');
});
app.get('/login/update/:id', (req, res) => {
    res.render('pages/cliente/minhaconta');
})

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log('Servidor rodando na porta '+PORT);
});