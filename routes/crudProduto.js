const express = require('express')
const router = express.Router()
const {v4:uuidv4} = require('uuid')
const Produto = require('../models/produto')
const FotoProduto = require('../models/fotosDoProduto')
const fs = require("fs")

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

let erros = []
//ver todos os produtos
router.get('/', async (req, res) => {
    Produto.findAll({
      where:{fornecedor_id:req.user.id},
      include:[{
        model:FotoProduto,
        required:true
      }]
    }).then((produto)=>{
      res.render('fornecedor/meusprodutos.ejs',{produto:produto});
    })
})
//adicionar produtos
router.get('/add', (req, res) => {
  res.render('fornecedor/adicionarproduto.ejs',{erros});
})

router.post('/add/post',upload.single("foto1"),async (req,res)=>{
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
      res.render("fornecedor/adicionarProduto.ejs",{erros})
  } else {
    let idProd = uuidv4()
    const imagem = req.file.buffer
    try {
      const produto = await Produto.create({
        id: idProd,
        nome:req.body.nomedoproduto,
        preco:req.body.preco,
        estoque:req.body.estoque,
        descricao:req.body.descricao,
        fornecedor_id:req.body.id
      })
      const imagensSalvas = await FotoProduto.create({id : uuidv4(), foto : imagem, produto_id: idProd, tipo:req.file.mimetype})
      req.flash("success_msg","Produto criado com sucesso")
      res.redirect("/fornecedor/produtos")
    } catch (error) {
      res.status(500).send("erro ao salvar o produto" + error)
    }
  }
})
//ver um produto só
router.get("/:id",(req,res)=>{
  Produto.findOne({where:{id:req.params.id},include:[{
    model:FotoProduto,
    required:true
  }]}).then((produto)=>{
    res.render("fornecedor/produtoFornecedor.ejs",{produto:produto,erros:erros})
  })
})

//atualizar produto
router.post("/update", async(req,res)=>{
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
    Produto.findOne({where:{id:req.body.id},include:[{
      model:FotoProduto,
      required:true
    }]}).then((produto)=>{
      console.log(erros)
      res.render("fornecedor/produtoFornecedor.ejs",{produto:produto,erros:erros})
    })
  } else {
    try {
      await Produto.update({
        nome:req.body.nomedoproduto,
        preco:req.body.preco,
        estoque:req.body.estoque,
        descricao:req.body.descricao
      },{
        where:{ id : req.body.id }
      })
      req.flash("success_msg","Produto atualizado com sucesso")
      res.redirect("/fornecedor/produtos")
    } catch (error) {
      res.status(500).send("erro ao salvar o produto" + error)
    }
  }
})
//atualizar foto do produto
router.post("/update/foto", upload.single('foto1'), async (req, res)=>{
  const imagem = req.file.buffer
  await FotoProduto.update({foto : imagem, tipo:req.file.mimetype},{ where :{ produto_id : req.body.id }})

  res.redirect("/fornecedor/produtos/"+req.body.id)
})

router.get("/delete/:id",async(req,res)=>{
  try {
    await Produto.destroy({
      where:{
        id:req.params.id
      }
    })
    await FotoProduto.destroy({
      where:{
        produto_id:req.params.id
      }
    })
    req.flash("success_msg","Produto deletado com sucesso")
    res.redirect('/fornecedor/produtos')
  } catch (error) {
    req.flash("error_msg","Houve um erro ao deletar o produto")
    res.redirect('/fornecedor/produtos')
  }
})

module.exports = router