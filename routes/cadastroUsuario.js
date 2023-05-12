const express = require('express')
const router = express.Router()
const Fornecedor = require('../models/Fornecedor')
const Cliente = require('../models/cliente')
const Login = require('../models/login')
const Banner = require('../models/banner')
const Logo = require('../models/logo')
const {v4:uuidv4} = require('uuid')
let erros = []
//cadastro fornecedor
router.get('/for/cadastro', (req, res) => {
  erros = []
  res.render('fornecedor/cadastrofornecedor.ejs',{erros});
})

/** 
 * Melhorias:
 * funcoes assincronas para colocar os dados no banco de dados
 * em vez de aninhar tudo 
 * */ 

// AQUI NESSA PARTE, OS DADOS VÃO SER GUARDADOS NUM OBJETO, E DEEEPOIS DE TODOS OS PASSOS, VÃO PARA O BANCO DE DADOS
router.post('/for/cadastro/add',(req,res)=>{
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
        res.redirect('/for/cadastro')
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
            senha:req.body.senha,
            type_user: "fornecedor"
          }).then(()=>{
            Banner.create({
              id:uuidv4(),
              fornecedor_id:id
            })
            Logo.create({
              id:uuidv4(),
              fornecedor_id:id
            })
            req.flash("success_msg","Adicione um endereço para sua loja")
            res.redirect('/for/endereco')
          }).catch((err)=>{
            res.send("Houve um erro ao criar o usuario"+err)
          })
        }).catch(()=>{
          res.send("Houve um erro ao criar a conta de fornecedor")
        })
      }
    })
  }
})

router.get("/for/endereco",(req, res)=>{
  res.render("pages/endereco")
})
router.post("/for/endereco",(req, res)=>{

})

//cadastro cliente
router.get('/cli/cadastro', (req, res) =>{
  res.render('cliente/cadastro', {erros:erros});
})

router.post('/cli/cadastro/add',(req,res)=>{
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
  if(!req.body.data_nascimento || req.body.data_nascimento.lenght < 8){
    erros.push("Data de nascimento inválida")
  }
  if(!req.body.telefone || req.body.telefone.lenght < 8){
    erros.push("Telefone inválido")
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
        res.redirect('/cli/cadastro')
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
          senha:req.body.senha,
          type_user: "cliente"
        }).then(()=>{
          req.flash("success_msg","Conta criada com sucesso, logue para ter acesso")
          res.redirect('/')
        }).catch((err)=>{
          res.send("Houve um erro ao criar o usuario"+err)
        })
      }).catch((err)=>{
        res.send("Houve um erro ao criar o usuario"+err)
      })
    }})
  }
})

router.get('/carrinho', (req, res) => {
  res.render('cliente/carrinho.ejs');
})

module.exports = router