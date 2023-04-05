const express = require('express')
const router = express.Router()
const Cliente = require('../models/Cliente')
// cadastro
router.get('/cadastro', (req, res) =>{
  res.render('cliente/cadastro', {erros:erros});
})
let erros = [];

router.post('/cadastro/add',(req,res)=>{
  // fazer validação de dados

  erros = []

  if(!req.body.nome || req.body.nome.length < 5){
    erros.push({texto:"Nome inválido"})
  }
  if(!req.body.senha){
    erros.push({texto:"Senha inválida"})
  }
  if(!req.body.email){
    erros.push({texto:"Email inválido"})
  }
  if(!req.body.cpf){
    erros.push({texto:"Cpf inválido"})
  }
  if(!req.body.data_nascimento){
    erros.push({texto:"Data de nascimento inválida"})
  }

  if(erros.length > 0){
    res.render("cliente/cadastro",{erros: erros})
  }
  Cliente.create({
    nome: req.body.nome,
    cpf: req.body.cpf,
    telefone: req.body.telefone,
    data_nascimento: req.body.data_nascimento,
    email:req.body.email,
    senha:req.body.senha,
  }).then(()=>{
    res.send("usuario criado com sucesso")
  }).catch((err)=>{
    res.send("Houve um erro ao criar o usuario"+err)
  })
})

//read
router.get('/update/:id', (req, res) => {
  Cliente.findOne({
    where: { id : req.params.id }
  }).then((clientes)=>{
    res.render('cliente/minhaconta', {clientes});
  }).catch((err)=>{
    res.send("Houve um erro ao fazer o cadastro")
  });
})
//update
router.post('/update/func',(req,res)=>{
  Cliente.update({
    nome: req.body.nome,
    cpf: req.body.cpf,
    telefone: req.body.telefone,
    data_nascimento: req.body.data_nascimento,
    email:req.body.email,
  },{
    where:{ id : req.body.id }
  }).then(()=>{
    res.send("usuario atualizado com sucesso")
  }).catch(()=>{
    res.send("Houve um erro ao atualizar a conta")
  })
})
//delete
router.get('/delete/:id',(req,res)=>{
  Cliente.destroy({
    where:{
      id : req.params.id
    }
  }).then(()=>{
    res.send("Conta deletada com sucesso")
  }).catch(()=>{
    res.send("Houve um erro ao deletar a conta")
  })
})

router.get('/carrinho', (req, res) => {
  res.render('cliente/carrinho.ejs');
})

router.get('/finalizar-pedido',(req,res)=>{
  res.render('cliente/finalizarpedido');
})

module.exports = router