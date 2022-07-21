let Home = {

    init: function () {
        this.slickPrincipalBanner()
        this.slickBrands()
        this.newsLetter()
        const windowSize = $(window).width()
        if(windowSize < 1000){
            this.seoText()
        }
    },

    slickPrincipalBanner: function () {
        $('.slide-principal, .slide-principalMobile').slick({
            autoplay: true,
            autoplaySpeed: 5000,
            arrow: !0,
            dots: !0,
            infinite: !0,
        });
    },


    slickBrands: function () {
        $('.marcas__carousel-slide').slick({
            autoplay: true,
            autoplaySpeed: 5000,
            infinite: !0,
            slidesToShow: 5,
            slidesToScroll: 5,
            arrows: true,
            dots: !1,
            responsive: [
                {
                  breakpoint: 1200,
                  settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    infinite: true,
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
                }
            ]
        })
    },

    newsLetter: function () {
        $('.newsletter').keypress(function (e) {
            if (e.which == 13) {
                $(".newsletter__btn").trigger('click');
            }
        });

        $(".newsletter__btn").click(function () {
            if(!ePlusUtils.Helpers.validate($('#fcEmail').val())){
                alert('Formulário não enviado, por favor tente novamente')
                return
            } 

            let obj = {
                nome: $('#fcName').val(),
                email: $('#fcEmail').val()
            }
            
            ePlusUtils.Helpers.enviaDados(obj, "NL", ".newsletter",
              "<div class='newsletter__message-wrapper'><p class='newsletter__message'>Você foi cadastrado na nossa newsletter, obrigado!</p></div>");
        });
    },
    
    seoText: function () {
        const text = $('.textSEO__text').text()

        $('.textSEO__text').html(`<p>${text.slice(0, 180)}...`)
        $('.textSEO__title').text('Conheça mais sobre nós')
    }
}

module.exports = Home