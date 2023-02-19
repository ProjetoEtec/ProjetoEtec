const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
  res.send('teste')
})

router.get('/cadastro', (req, res) =>{
  res.render('cliente/cadastro');
})
router.get('/login', (req, res) =>{
  res.render('cliente/login');
});
router.get('/login/update/:id', (req, res) => {
  res.render('cliente/minhaconta');
})

module.exports = router