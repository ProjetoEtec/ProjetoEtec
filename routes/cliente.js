const express = require('express')
const router = express.Router()
//const Cliente = require('../models/cliente')

router.get('/',(req,res)=>{
  res.send('teste')
})

router.get('/cadastro', (req, res) =>{
  res.render('cliente/cadastro');
})

router.post('/cadastro/add',(req,res)=>{
  // fazer validação de dados
  Cliente.create({
    nome: req.body.nomeCompleto,
    cpf: req.body.cpf,
    telefone: req.body.telefone,
    nascimento: req.body.nascimento,
    email:req.body.email,
    senha:req.body.senha,
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