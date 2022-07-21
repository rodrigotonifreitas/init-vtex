let AmcShelf = {

    init: function () {
        this.isSkuVariation();  
        this.soldOut()      
        this.slickShelf('.amcPrateleira-shelve__template', '.amc-preateleira');   
        this.clusterShelf()     
        this.buyButton();  
    },

    slickShelf: function (shelfParentClass, shelfClass) {
        $(shelfParentClass).each(function () {
            let slide = $(this).find(shelfClass).length
            if (slide > 0) {
                $(this).find(shelfClass + ' > ul').slick({
                    infinite: !0,
                    slidesToShow: 5,
                    slidesToScroll: 5,
                    arrows: true,
                    dots: true,
                    responsive: [
                        {
                          breakpoint: 1200,
                          settings: {
                            slidesToShow: 4,
                            slidesToScroll: 4,
                            infinite: true,
                            dots: true
                          }
                        },{
                          breakpoint: 1024,
                          settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3
                          }
                        },{
                            breakpoint: 900,
                            settings: {
                              slidesToShow: 2,
                              slidesToScroll: 2
                            }
                        },{
                            breakpoint: 600,
                            settings: {
                              slidesToShow: 1,
                              slidesToScroll: 1
                            }
                          }
                    ]
                })
            } else {
                $(this).closest('.amcPrateleira').hide()
            }
            
            const qty = $(this).find('.slick-dots li').last().text()

            $(this).parent().find('.amcPrateleira-title__indice').prepend(`
                <p><span>1</span>/${qty}</p>
            `)

            $(this).find(`${shelfClass} > ul`).on('setPosition', function(){
                const position = $(this).find('.slick-dots .slick-active').text()
                $(this).closest('.containerCenter').find('.amcPrateleira-title__indice span').text(position)
            });
        })
    },

    isSkuVariation: function () {
        $('.amc-preateleira ul li').each(function(){
            const idProd = $(this).find('.prateleira__data').attr('data-id')
            const _this = $(this)
            
            if(idProd !== undefined) {
                vtexjs.catalog.getProductWithVariations(idProd).done(function(product){
                    const qtyVariation = product.skus.length
    
                    if(qtyVariation > 1){
                        _this.find('.prateleira__price-bestPrice b').first().text('A partir de: ')
                    }
                });
            }


            const desconto = Math.round(parseFloat($(this).find('.flag__desconto').text()))
            $(this).find('.flag__desconto').text(`-${desconto}%`)

            const seloDestaqueTopo = $(this).find('.flag__seloDestaqueTopo .product-field ul li').text()
            const seloPretoEsquerdo = $(this).find('.flag__seloPretoEsquerdo .product-field ul li').text()
            const seloVermelhoDireito = $(this).find('.flag__seloVermelhoDireito .product-field ul li').text()

            !seloDestaqueTopo ? $(this).find('.prateleira__productFlagsTopLeft .flag__seloDestaqueTopo').hide() : null
            !seloPretoEsquerdo ? $(this).find('.prateleira__productFlagsBottomLeft .flag__seloPretoEsquerdo').hide() : null
            !seloVermelhoDireito ? $(this).find('.prateleira__productFlagsBottomRight .flag__seloVermelhoDireito').hide() : null

            const porcentagem = parseFloat($('#percentualBoleto').text())
            const price = $(this).find('.prateleira__price-bestPrice .price').text()
            const valorDescontado = price ? ePlusUtils.Helpers.getMoney(price) - (Math.round(porcentagem / 100 * ePlusUtils.Helpers.getMoney(price))) : null;

            if(price){
                $(this).find('.prateleira__price-boleto').remove()
                $(this).find('.prateleira__price-link').append(`
                    <p class="prateleira__price-boleto"> À vista no boleto <b>R$ ${ePlusUtils.Helpers.formatReal(valorDescontado)}</b> </p>
                `) 
            }
            else null;
        })
    },

    soldOut:function(){
        $('.amc-preateleira ul li').each(function(){
            if($(this).find('.prateleira__outOfStock').length){
                $(this).addClass('flagOff')
            }
        })
    },

    clusterShelf: function () {

        $('.clusterShelf-clusters').each(function(){
            $(this).find('.clusterShelf-clusters__listShelf .amc-preateleira').each(function(i){
                const title = $(this).find('h2').text()

                $(this).parent().prev('.clusterShelf-clusters__list').find(`.clusterShelf-clusters__listItem[data-position=${i + 1}]`).text(title)
            })
        })

        $('.clusterShelf-clusters__listItem').click(function(){
            const position = $(this).attr('data-position')
            $(this).parent().find('.clusterShelf-clusters__listItem').removeClass('active')
            $(this).addClass('active')
            $(this).parent().next().find(`.amc-preateleira`).hide()
            $(this).parent().next().find(`.amc-preateleira:nth-of-type(${position})`).fadeIn()

        })
    },

    buyButton: function () {
        $('.prateleira__btnComprar').click(function(){
            let _this = $(this)
            _this.text('Comprando...')
            let idProd =  _this.attr('data-id')

            vtexjs.checkout.getOrderForm().then(function () {
                let item = {
                    id: idProd,
                    quantity: 1,
                    seller: 1
                }
                vtexjs.checkout.addToCart([item]).done(function () {
                    ePlusUtils.Helpers.atualizaCart()
                    _this.html('<i class="prateleira__btnComprar-Icon"> </i>Comprar ')
                    Swal.fire({
                        title: 'Produto adicionado no carrinho',
                        icon: 'success',
                    })
                })
            })
        })
    }
}

module.exports = AmcShelf