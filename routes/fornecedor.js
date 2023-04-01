const express = require('express')
const router = express.Router()
const Fornecedor = require('../models/Fornecedor')

router.get('/cadastro', (req, res) => {
  res.render('fornecedor/cadastrofornecedor.ejs');
})

router.post('/cadastro/add',(req,res)=>{
  Fornecedor.create({
    razao_social:req.body.razao_social,
    nome_fantasia:req.body.nome_fantasia,
    cnpj:req.body.cnpj,
    telefone:req.body.telefone,
    email:req.body.email,
    senha:req.body.senha
  }).then(()=>{
    res.send("Fornecedor criado com sucesso")
  }).catch(()=>{
    res.send("Houve um erro ao criar a conta de fornecedor")
  })
})

router.get('/delete/:id',(req,res)=>{
  Fornecedor.destroy({
    where:{
      id : req.params.id
    }
  }).then(()=>{
    res.send("Conta deletada com sucesso")
  }).catch(()=>{
    res.send("Houve um erro ao deletar a conta")
  })
})
router.get('/meus-produtos', (req, res) => {
  res.render('fornecedor/meusprodutos.ejs');
})

router.get('/adicionar-produto', (req, res) => {
res.render('fornecedor/adicionarproduto.ejs');
})

router.get('/update/:id', (req, res) => {
  Fornecedor.findOne({
    where:{ id:req.params.id}
  }).then((fornecedores)=>{
    res.render('fornecedor/contafornecedor.ejs',{fornecedores});
  }).catch((err)=>{
    res.send("houve um erro ao entrar na conta")
  })
})

router.post('/update/func', (req,res)=>{
  Fornecedor.update({
    razao_social:req.body.razao_social,
    nome_fantasia:req.body.nome_fantasia,
    cnpj:req.body.cnpj,
    telefone:req.body.telefone,
    email:req.body.email,
    senha:req.body.senha
  },{
    where:{ id:req.body.id }
  }).then(()=>{
    res.send("Conta atualizada com sucesso")
  }).catch((err)=>{
    res.send("houve um erro ao atualizar a conta"+err)
  })
})

router.get('/pedidos',(req, res) => {
    res.render('fornecedor/pedidofornecedor.ejs');
})
module.exports = router