const Default = require('./general/default')
const Home = require('./pages/home')
const BuscaAvancada = require('./modules/buscaAvancada')
const AmcShelf = require('./modules/amcShelf')
const AmcInstafeed = require('./modules/amcInstafeed')
const AmcNewsletter = require('./modules/amcNewsletter')
const Departamento = require('./pages/departamento')
const Institucional = require('./pages/institucional')
const Produto = require('./pages/produto')
const Login = require('./pages/login')

Default.init()
AmcShelf.init()
AmcNewsletter.init()

if($('body').hasClass('home')){
    Home.init()
    BuscaAvancada.init()
    AmcInstafeed.init()
}

if($('body').hasClass('departamento') ||$('body').hasClass('categoria') || $('body').hasClass('busca') || $('body').hasClass('marca')){
    Departamento.init()
}

if($('body').hasClass('institucional')){
    Institucional.init()
}

if($('body').hasClass('produto')){
    Produto.init()
}

if($('body').hasClass('login')){
    Login.init()
}
