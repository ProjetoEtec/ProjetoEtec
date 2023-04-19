const express = require('express')
const router = express.Router()
const Fornecedor = require('../models/Fornecedor')
const Login = require('../models/login')
const crudProduto = require("./crudProduto")
const { format } = require('mysql2')
router.use('/produtos',crudProduto)
let erros = []

router.get('/delete/:id',(req,res)=>{
  Fornecedor.destroy({
    where:{
      id : req.params.id
    }
  }).then(()=>{
    Login.destroy({
      where:{
        id:req.params.id
      }
    }).then(()=>{
      req.flash("success_msg","Conta deletada com sucesso")
      res.redirect('/')
    }).catch(()=>{
      res.send("Houve um erro ao deletar a conta")
    })
  }).catch(()=>{
    res.send("Houve um erro ao deletar a conta")
  })
})

router.get('/update/:id', (req, res) => {
  Fornecedor.findOne({
    where:{ id:req.params.id}
  }).then((fornecedores)=>{
    res.render('fornecedor/contafornecedor.ejs',{fornecedores:fornecedores,erros:erros});
  }).catch((err)=>{
    res.send("houve um erro ao entrar na conta"+err)
  })
})

router.post('/update/func', (req,res)=>{
  erros = []
  if(!req.body.razao_social){
    erros.push({texto:"Insira a razão social"})
  }
  if(!req.body.nome_fantasia){
    erros.push({texto:"Insira o nome fantasia"})
  }
  if(!req.body.cnpj){
    erros.push({texto:"cnpj inválido"})
  }
  if(erros.length > 0){
    Fornecedor.findOne({
      where:{ id:req.body.id}
    }).then((fornecedores)=>{
      res.render('fornecedor/contafornecedor.ejs',{fornecedores:fornecedores,erros:erros});
    }).catch((err)=>{
      res.send("houve um erro ao entrar na conta")
    })
  } else {
    Fornecedor.update({
      razao_social:req.body.razao_social,
      nome_fantasia:req.body.nome_fantasia,
      cnpj:req.body.cnpj,
      telefone:req.body.telefone
    },{
      where:{ id:req.body.id }
    }).then(()=>{
      req.flash("success_msg","Conta Atualizada com sucesso")
      res.redirect('/fornecedor/update/'+req.body.id)
    }).catch((err)=>{
      res.send("houve um erro ao atualizar a conta"+err)
    })
  }
})

router.get('/pedidos',(req, res) => {
    res.render('fornecedor/pedidofornecedor.ejs');
})


module.exports = router