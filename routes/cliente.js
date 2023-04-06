const express = require('express')
const router = express.Router()
const Cliente = require('../models/cliente');
const Login = require('../models/login');
const { v4:uuidv4 } = require('uuid');
// cadastro
let erros = [];
router.get('/cadastro', (req, res) =>{
  res.render('cliente/cadastro', {erros:erros});
})

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
  if(req.body.email != req.body.confirmacao_email){
    erros.push({texto:"Os emails não correspondem"})
  }
  if(req.body.senha != req.body.confirmacao_senha){
    erros.push({texto:"As senhas não correspondem"})
  }

  if(erros.length > 0){
    res.render("cliente/cadastro",{erros: erros})
  } else {
    let id = uuidv4()
    Login.findOne({
      where: {
        email:req.body.email
      }
    }).then((login)=>{
      if(login){
        req.flash("error_msg","Email já cadastrado")
        res.redirect('/cliente/cadastro')
      } else {
      Cliente.create({
        id:id,
        nome: req.body.nome,
        cpf: req.body.cpf,
        telefone: req.body.telefone,
        data_nascimento: req.body.data_nascimento
      }).then(()=>{
        Login.create({
          id:id,
          email:req.body.email,
          senha:req.body.senha
        }).then(()=>{
          req.flash("success_msg","Conta criada com sucesso")
          res.redirect('/cliente/update/'+id)
        }).catch((err)=>{
          res.send("Houve um erro ao criar o usuario"+err)
        })
      }).catch((err)=>{
        res.send("Houve um erro ao criar o usuario"+err)
      })
    }})
  }
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
    data_nascimento: req.body.data_nascimento
  },{
    where:{ id : req.body.id }
  }).then(()=>{
    req.flash("success_msg","Conta Atualizada com sucesso")
    res.redirect('/cliente/update/'+req.body.id)
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

router.get('/carrinho', (req, res) => {
  res.render('cliente/carrinho.ejs');
})

router.get('/finalizar-pedido',(req,res)=>{
  res.render('cliente/finalizarpedido');
})

module.exports = router