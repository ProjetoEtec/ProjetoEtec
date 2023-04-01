const express = require('express')
const router = express.Router()
const Cliente = require('../models/cliente')
// cadastro
router.get('/cadastro', (req, res) =>{
  res.render('cliente/cadastro');
})

router.post('/cadastro/add',(req,res)=>{
  // fazer validação de dados
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