const express = require('express')
const router = express.Router()
const Cliente = require('../models/cliente');
const Login = require('../models/login');
const { v4:uuidv4 } = require('uuid');
let erros = [];

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


router.get('/finalizar-pedido',(req,res)=>{
  res.render('cliente/finalizarpedido');
})

module.exports = router