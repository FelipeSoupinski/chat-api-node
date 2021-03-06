const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');

const ProdutosController = require('../controllers/produtos-controller');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);     // implementar lógica pra não sobrescrever nome da imagem
    }
});
 
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10MB tamanho máximo de imagem 
    },
    fileFilter: fileFilter
}); 

router.get('/', ProdutosController.getProdutos);
router.post('/', login.obrigatorio, upload.single('imagem_produto'), ProdutosController.postProdutos);
router.get('/:id', ProdutosController.getProduto);
router.patch('/', login.obrigatorio, upload.single('imagem_produto'), ProdutosController.updateProduto);
router.delete('/', login.obrigatorio, ProdutosController.deleteProdutos);

router.post('/:id_produto/imagem', login.obrigatorio, upload.single('imagem_produto'), ProdutosController.postImagem)
router.get('/:id_produto/imagens', ProdutosController.getImagens);
router.delete('/:id_produto/imagens', login.obrigatorio, ProdutosController.deleteImagemProdutos);

module.exports = router;
