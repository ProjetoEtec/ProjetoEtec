const express = require('express')
const router = express.Router()
const Fornecedor = require('../models/Fornecedor')

router.get('/cadastro', (req, res) => {
  res.render('fornecedor/cadastrofornecedor.ejs');
})

router.get('/meus-produtos', (req, res) => {
  res.render('fornecedor/meusprodutos.ejs');
})

router.get('/adicionar-produto', (req, res) => {
res.render('fornecedor/adicionarproduto.ejs');
})

router.get('/minha-conta', (req, res) => {
    res.render('fornecedor/contafornecedor.ejs');
})

router.get('/pedidos',(req, res) => {
    res.render('fornecedor/pedidofornecedor.ejs');
})
module.exports = router