const express = require('express')
const router = express.Router()
const crudProduto = require("./crudProduto")
const Fornecedor = require('../models/Fornecedor')
const Login = require('../models/login')
const Banner = require('../models/banner')
const Cliente = require('../models/cliente')
const Logo = require('../models/logo')
const FotoProduto = require('../models/fotosDoProduto')
const {Pedido, detalhesDoPedido} = require("../models/pedido")
const Produto = require('../models/produto')
const Endereco = require('../models/endereco')
const { Op } = require('sequelize');
const sharp = require('sharp');
router.use('/produtos',crudProduto)

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

let erros = []

router.get('/delete/:id',(req,res)=>{
  Fornecedor.destroy({
    where:{
      id : req.params.id
    }
  }).then(()=>{
    Produto.destroy({where:{
      fornecedor_id:req.params.id
    }})
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

router.get('/update/:id', (req, res) => {
  Fornecedor.findOne({
    where:{ id:req.params.id},
    include:[{
      model: Endereco
    }]
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
      req.session.save(()=>{
        res.redirect('/fornecedor/update/'+req.body.id)
      })
    }).catch((err)=>{
      res.send("houve um erro ao atualizar a conta"+err)
    })
  }
})

router.get('/pedidos', async (req, res) => {
  let pedido = await Pedido.findAll({
    where:{
      fornecedor_id : req.user.id
    },
    include : [{
      model: detalhesDoPedido
    }]
  })
  let clientes
  let produtos
  
  if(pedido[0]){
    let id_clientes = pedido.map((pedidos)=>{
      return pedidos.cliente_id
    })
    clientes = await Cliente.findAll({
      where: {
        id: id_clientes
      },
      include: {
        model: Endereco
      }
    })
    let prod_id = []
    let total = []
    for(let i = 0; i < pedido.length ; i++){
      prod_id.unshift(pedido[i].detalhes_do_pedidos.map(detalhes => detalhes.produto_id)) 

      total[i] = 0

      for(let j = 0; j < pedido[i].detalhes_do_pedidos.length; j++){
        total[i] += Number(pedido[i].detalhes_do_pedidos[j].preco) * Number(pedido[i].detalhes_do_pedidos[j].quantidade)
      }
      pedido[i].total = total[i]

      produtos = await Produto.findAll({
        where: {
          id : {
            [Op.in] : prod_id
          }
        },
        include: [{
          model: FotoProduto
        }]
      })
    }
  }
  
    res.render('fornecedor/pedidofornecedor.ejs', {pedido,clientes,produtos});
})

router.post('/logo',upload.single("logo"),(req, res) => {
  let imagem = req.file.buffer
  sharp(imagem).resize({ width: 300 }).toBuffer((err,imagemRedimensionada,info)=>{
    imagem = imagemRedimensionada
    Logo.update({
      logo:imagem,
      tipo:req.file.mimetype
    },{ where: { fornecedor_id: req.body.id }}).then(()=>{
      res.redirect("/fornecedor/minha-loja")
    })
  })
})
router.post('/banner',upload.single("banner"),(req, res) => {
  let imagem = req.file.buffer
  sharp(imagem).resize({ width: 300 }).toBuffer((err,imagemRedimensionada,info)=>{
    imagem = imagemRedimensionada
    Banner.update({
      banner:imagem,
      tipo:req.file.mimetype
    },{ where: { fornecedor_id: req.body.id}}).then(()=>{
      res.redirect("/fornecedor/minha-loja")
    })
  })
})
router.post('/descricao',async (req, res) => {
  await Fornecedor.update({descricao: req.body.descricao_loja},{where: { id: req.user.id }})

  res.redirect("/fornecedor/minha-loja")
})



router.get('/minha-loja',async (req, res) => {
  const fornecedor = await Fornecedor.findOne({
    where: {id: req.user.id}, 
    include: [{
    model:Banner,
    required:true
  },
  {
    model:Logo,
    required:true
  }]})
  const produtos = await Produto.findAll({
    where: {fornecedor_id: req.user.id},
    include: [{
      model:FotoProduto,
      required:true
    }]
  })
  // console.log(fornecedor.banner)
  // res.send(fornecedor)
  res.render('fornecedor/lojaFornecedor',{fornecedor:fornecedor,produto:produtos})
})

router.get('/aceitar-pedido/:id',(req,res)=>{
  try {
    Pedido.update({
      situacao_pedido: "Em andamento"
    },{
      where: {
        id: req.params.id
      }
    })
    req.flash('success_msg','Pedido aceito')
    req.session.save(()=>{
      res.redirect('/fornecedor/pedidos')
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router