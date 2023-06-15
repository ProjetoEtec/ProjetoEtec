const express = require('express')
const router = express.Router()
const Cliente = require('../models/cliente');
const Login = require('../models/login');
const { Pedido, detalhesDoPedido } = require('../models/pedido');
const Produto = require('../models/produto');
const { Op } = require('sequelize');
const { v4:uuidv4 } = require('uuid');
let erros = [];

//read
router.get('/update/:id', (req, res) => {
  Cliente.findOne({
    where: { id : req.params.id }
  }).then((clientes)=>{
    res.render('cliente/minhaconta', {clientes:clientes,erros:erros});
  }).catch((err)=>{
    res.send("Houve um erro ao fazer o cadastro")
  });
})
//update
router.post('/update/func',(req,res)=>{

  erros = []

  if(!req.body.nome || req.body.nome.length < 5){
    erros.push({texto:"Nome inválido"})
  }
  if(!req.body.cpf || req.body.cpf.length < 8){
    erros.push({texto:"Cpf inválido"})
  }
  if(!req.body.data_nascimento || req.body.data_nascimento.length < 8){
    erros.push({texto:"Data de nascimento inválida"})
  }
  if(!req.body.telefone || req.body.telefone.lenght < 8){
    erros.push({texto:"Telefone inválido"})
  }

  if(erros.length > 0){
    Cliente.findOne({
      where: { id : req.body.id }
    }).then((clientes)=>{
      res.render('cliente/minhaconta', {clientes:clientes,erros:erros});
    })
  } else {
    Cliente.update({
      nome: req.body.nome,
      cpf: req.body.cpf,
      telefone: req.body.telefone,
      data_nascimento: req.body.data_nascimento
    },{
      where:{ id : req.body.id }
    }).then(()=>{
      req.flash("success_msg","Conta Atualizada com sucesso")
      req.session.save(()=>{
        res.redirect('/cliente/update/'+req.body.id)
      })
    }).catch(()=>{
      res.send("Houve um erro ao atualizar a conta")
    })
  }
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
      req.session.save(()=>{
        res.redirect('/')
      })
    }).catch(()=>{
      res.send("Houve um erro ao deletar a conta")
    })
  }).catch(()=>{
    res.send("Houve um erro ao deletar a conta")
  })
})

router.get('/finalizar-pedido',(req,res)=>{
  res.render('cliente/finalizarpedido');
})

router.post('/pedido', async (req,res)=>{
  let carrinho = req.session.carrinho;
  let id = uuidv4();
  let lista = req.session.carrinho;
  let lista1 = Object.keys(lista).map(key =>lista[key].id)
  let produtos = await Produto.findAll({  
    where: {
      id:{
        [Op.in]: lista1
      }
    }
  })
  if(lista.length > 0){
    Pedido.create({
      id:id,
      data_pedido: Date.now(),
      situacao_pedido : "pendente",
      cliente_id: req.session.passport.user,
    })
  }
  for(var i = 0; i < carrinho.length; i++){
    for(var j = 0; j < carrinho.length; j++){
      if(carrinho[i].id == produtos[j].id){
        detalhesDoPedido.create({
          id: uuidv4(),
          pedido_id: id,
          produto_id: carrinho[i].id,
          quantidade: carrinho[i].qtd,
          preco: produtos[j].preco
        })
      }
    }
  }
  res.send("Teste")
})

module.exports = router