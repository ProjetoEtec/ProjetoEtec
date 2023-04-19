const express = require('express')
const router = express.Router()
const Produto = require('../models/produto')
const {v4:uuidv4} = require('uuid')
const FotoProduto = require('../models/fotosDoProduto')

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

let erros = []
router.get('/', (req, res) => {
  Produto.findAll({where:{fornecedor_id:req.user.id}}).then((produto)=>{
    res.render('fornecedor/meusprodutos.ejs',{produto:produto});
  })
})
router.get('/add', (req, res) => {
  res.render('fornecedor/adicionarproduto.ejs',{erros});
})

router.post('/add/post',(req,res)=>{
  erros = []
  
  if(!req.body.nomedoproduto || req.body.nomedoproduto.lenght < 4) {
    erros.push({texto: "Insira um nome para o produto"})
  }
  if(!req.body.preco){ 
    erros.push({texto: "Insira um preço para o produto"})
  }
  if(!req.body.estoque){ 
    erros.push({texto: "Insira um número de estoque"})
  }
  if(erros.length > 0 ){
    res.render('fornecedor/adicionarproduto.ejs',{erros:erros})
  } else {
    let idProd = uuidv4()
    Produto.create({
      id: idProd,
      nome:req.body.nomedoproduto,
      preco:req.body.preco,
      estoque:req.body.estoque,
      descricao:req.body.descricao,
      fornecedor_id:req.body.id
    }).then(()=>{
      // multer? sharp?
      res.redirect("/fornecedor/produtos")
    })
  }
})

router.get("/:id",(req,res)=>{
  Produto.findOne({where:{id:req.params.id}}).then((produto)=>{
    console.log(produto)
    res.render("fornecedor/produtoFornecedor.ejs",{produto:produto})
  })
})

module.exports = router