const express = require('express')
const router = express.Router()
const Cliente = require('../models/cliente')

router.get('/',(req,res)=>{
  res.send('teste')
})

router.get('/cadastro', (req, res) =>{
  res.render('cliente/cadastro');
})

router.post('/cadastro/add',(req,res)=>{
  Cliente.create({
    nome: req.body.nomeCompleto,
    cpf: req.body.cpf,
    telefone: req.body.telefone,
    data_nasc: req.body.dataNasc
  }).then(()=>{
    res.send("usuario criado com sucesso")
  }).catch((err)=>{
    res.send("Houve um erro ao criar o usuario")
  })
})

router.get('/login', (req, res) =>{
  res.render('cliente/login');
});
router.get('/update/:id', (req, res) => {
  res.render('cliente/minhaconta');
})

module.exports = router