const express = require('express')
const router = express.Router()
const Fornecedor = require('../models/Fornecedor')
const Login = require('../models/login')
const {v4:uuidv4} = require('uuid')
let erros = []
router.get('/cadastro', (req, res) => {
  erros = []
  res.render('fornecedor/cadastrofornecedor.ejs',{erros});
})



router.post('/cadastro/add',(req,res)=>{
  erros = []
  if(!req.body.razao_social){
    erros.push({texto:"Insira a razão social"})
  }
  if(!req.body.nome_fantasia){
    erros.push({texto:"Insira o nome fantasia"})
  }
  if(!req.body.senha || req.body.senha.lenght > 8){
    erros.push({texto:"Senha muito curta, insira pelo menos 8 caracteres"})
  }
  if(!req.body.email){
    erros.push({texto:"Email inválido"})
  }
  if(!req.body.cnpj){
    erros.push({texto:"cnpj inválido"})
  }
  if(req.body.email != req.body.confirmacao_email){
    erros.push({texto:"Os emails não correspondem"})
  }
  if(req.body.senha != req.body.confirmacao_senha){
    erros.push({texto:"As senhas não correspondem"})
  }
  if(erros.length > 0){
    res.render("fornecedor/cadastrofornecedor.ejs",{erros: erros})
  } else {
    let id = uuidv4()
    Login.findOne({
      where: {
        email:req.body.email
      }
    }).then((login)=>{
      if(login){
        req.flash("error_msg","Email já cadastrado")
        res.redirect('/fornecedor/cadastro')
      } else {
        Fornecedor.create({
          id:id,
          razao_social:req.body.razao_social,
          nome_fantasia:req.body.nome_fantasia,
          cnpj:req.body.cnpj,
          telefone:req.body.telefone
        }).then(()=>{
          Login.create({
            id:id,
            email:req.body.email,
            senha:req.body.senha
          }).then(()=>{
            req.flash("success_msg","Conta criada com sucesso")
            res.redirect('/fornecedor/update/'+id)
          }).catch((err)=>{
            res.send("Houve um erro ao criar o usuario"+err)
          })
        }).catch(()=>{
          res.send("Houve um erro ao criar a conta de   fornecedor")
        })
      }
    })
  }
})

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
    telefone:req.body.telefone
  },{
    where:{ id:req.body.id }
  }).then(()=>{
    req.flash("success_msg","Conta Atualizada com sucesso")
    res.redirect('/fornecedor/update/'+req.body.id)
  }).catch((err)=>{
    res.send("houve um erro ao atualizar a conta"+err)
  })
})



router.get('/pedidos',(req, res) => {
    res.render('fornecedor/pedidofornecedor.ejs');
})
module.exports = router