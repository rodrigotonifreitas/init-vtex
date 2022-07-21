const AmcShelf = require('../modules/amcShelf')

let Departamento = {

    init: function() {
        this.filterCategory()
        this.departamentTitle()
        this.verMaisFiltros()
        this.pagBusca()
        this.pagination();
        this.textQtd()
        const windowSize = $(window).width()
        if(windowSize < 1000){
            this.filtrosMobile()
        }
    },
    
    departamentTitle: function (){
        const bgTitle = $('.departamento-banner .box-banner img').attr('src')
        $('.departamento-title').css('background', `url('${bgTitle}') center center no-repeat`)        
    },

    textQtd: function (){
        setTimeout(function(){
            const total = $('.searchResultsTime .resultado-busca-numero .value').first().text()
            const carregado = parseInt($('.departamento .main .vitrine .pager .pages li.pgCurrent').first().text()) * 40
            const frase = `Mostrando ${parseInt(carregado) > parseInt(total) ? total : carregado} resultado(s) de ${total} produto(s)`
    
            $('.departamento .main .sub > p').remove()
            $('.departamento .main .sub').first().prepend(`<p> ${frase} </p>`)      
        },1000) 
    },
    
    pagBusca: function () {
        if($('body').hasClass('busca')){
        let termoBuscado = vtxctx.searchTerm;
        $('.conteudo-categoria .titulo-sessao').append(': ' + termoBuscado)

            const searchTerm = vtxctx.searchTerm

            $('.departamento-title h2').text(searchTerm)
            $('.bread .bread-crumb ul').append(`<li class="last"><strong><a title="${searchTerm}">${searchTerm}</a></strong></li>`)
            
            if(termoBuscado === ''){
                $('.departamento-title').hide()
            }
        }
    },

    filterCategory: function () {
        $(" .search-single-navigator h5,  .search-single-navigator h4, .search-single-navigator h3").each(function () {
            let qtdFiltros = $(this).next('ul').find('li').length;
            if (qtdFiltros < 1) {
                $(this).next('ul').remove();
                $(this).remove()
            }
        });

        $('.menu-departamento .search-single-navigator h3, .menu-departamento .search-single-navigator h4, .menu-departamento .search-single-navigator h5').click(function(e){
            e.preventDefault()

            $(this).toggleClass('active').next('ul').slideToggle()
        })
    },

    verMaisFiltros: function () {
        $('.departamento-filters .menu-departamento .search-single-navigator > ul').each(function(){
            const qtdItem = $(this).find('li').length

            if(qtdItem > 5){
                $(this).append('<li class="ver-mais"> Ver mais [+] </li>')
            }
        })

        $('.departamento-filters .menu-departamento .search-single-navigator > ul .ver-mais').click(function(){
            $(this).toggleClass('active').closest('ul').toggleClass('active')
            if($(this).hasClass('active')) {
                $(this).text('Ver menos [-]')
            } else {
                $(this).text('Ver mais [+]')
            }
        })
    },

    filtrosMobile: function () {
        $('.departamento-filters__title').click(function(){
            $(this).toggleClass('active')
            $('.departamento-filters__nav .menu-departamento').slideToggle()
        })
    },

    pagination: function(){
        const _this = this
      $(document).on('click', '.departamento .main .vitrine .pager .pages li', function(){
        $( document ).ajaxStop(function(e) {
            _this.textQtd()
            AmcShelf.isSkuVariation();
            AmcShelf.buyButton();
        })
      })
    },

}

module.exports = Departamento