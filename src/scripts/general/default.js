let Default = {

    init: function () {
        this.removeHelperComplement();
        this.busca();
        this.checkLogged();
        this.miniCart();
        this.productDeleteMinicart();
        this.toggleFooterMobile();
        this.btnWhats();
        
        const windowSize = $(window).width()
        if(windowSize > 1000){
            this.apiMenuDesk();
            this.scrollHeader();
        } else{
            this.apiMenuMobile();
            this.topbarMobile();
            this.miniCartMobile();
        }
        this.categoryMap();


        // $('.header-carrinho__text, .header-carrinho__iconCart').click(function (e) {
        //     $('.header-carrinho, .header-carrinho__text, .header-carrinho__iconCart, .header-carrinho__iconQtd').toggleClass('active')
        //     $('.drawerMiniCart').fadeToggle()
        // })

        // $('.maskCart').click(function(e){
        //     e.stopPropagation()
        //     $('.header-carrinho, .header-carrinho__text, .header-carrinho__iconCart, .header-carrinho__iconQtd').removeClass('active')
        //     $('.drawerMiniCart').fadeOut()
        // })

        // $('.drawerMiniCart-footer__back').click(function(){
            // $('.header-carrinho, .header-carrinho__text, .header-carrinho__iconCart, .header-carrinho__iconQtd').toggleClass('active')
        //     $('.drawerMiniCart').fadeToggle()
        // })

        $('.navMenuMobile, .menuMobile-close').click(function(){
            $('.menuMobile .containerCenter, body').toggleClass('active')
        })
    },

    removeHelperComplement: function () {
        $('.helperComplement').remove();
    },

    busca: function () {
        $('.header-busca .busca .fulltext-search-box').focus(function(){
            $('.header-busca .busca').addClass('active')
        })
        $('.header-busca .busca .fulltext-search-box').focusout(function(){
            $('.header-busca .busca').removeClass('active')
        })
    },

    checkLogged: function () {
        vtexjs.checkout.getOrderForm().done(function (orderForm) {
            const logado = orderForm.loggedIn
            const windowSize = $(window).width()
            if(windowSize > 1000){
                if (logado) {

                    const name = orderForm.clientProfileData.firstName === null ? orderForm.clientProfileData.email : orderForm.clientProfileData.firstName
                    $('.header-saudacao__text').html(
                        `<a class="account">Olá <span class="mail">${name}</span></a>`
                    );
                } else {
                    $('.header-saudacao__text').html('<a href="/login"><u>Entre</u> ou <br/><u>Cadastre-se</u></a>')
                }
            } else{
                if (logado) {

                    const name = orderForm.clientProfileData.firstName === null ? orderForm.clientProfileData.email : orderForm.clientProfileData.firstName
                    $('.menuMobile-saudacao__text').html(
                        `<a class="account">Olá <span class="mail">${name}</span></a>
                        <i class="menuMobile-saudacao__textArrow"> </i>`
                    ).addClass('logado');
                    $('.header-saudacao').click(() => {
                        $('.header-saudacao__drawer').fadeToggle();
                    });
                    $('.menuMobile-saudacao__text.logado').click(function(){
                        $('.menuMobile-saudacao__drawer').slideToggle()
                    })
                } else {
                    $('.menuMobile-saudacao__text').html('<a href="/login"><u>Entre</u> ou <u>Cadastre-se</u></a>')
                }
            }
        });
    },

    topbarMobile: function () {
        $('.TopbarMobile .informativos-leftList').slick({
            infinite: !0,
            slidesToShow: 2,
            slidesToScroll: 2,
            arrows: !0,
            dots: !1
        })
    },

    miniCart: function () {
        vtexjs.checkout.getOrderForm().done(function (orderForm) {
            const qtyProd = orderForm.items.length;
            const windowSize = $(window).width()
            if(windowSize > 1000){
                $('.header-carrinho__iconQtd').text(qtyProd)

                if (qtyProd > 0) {
                    const totalPrice = ePlusUtils.Helpers.formatReal(orderForm.value);
                    let totalQty = 0;

                    $('.drawerMiniCart-center').empty()

                    orderForm.items.map((res, i) => {
                        const url = res.detailUrl;
                        const id = res.id;
                        const image = res.imageUrl;
                        const name = res.name;
                        const price = res.sellingPrice ? res.sellingPrice : res.price;
                        totalQty = totalQty + res.quantity

                        const cardProduct = `
                            <div class="drawerMiniCart-center__card">
                                <a href="${url}">
                                <img src="${image} alt="${name}" title="${name}"/>
                                <span  class="infoCard">
                                    <p class="infoCard-name">
                                    ${name}
                                    </p>
                                    <p class="infoCard-price">
                                        <b>Por: </b> R$${ePlusUtils.Helpers.formatReal(price)}
                                    </p>
                                </span>
                                </a>
                                <span class="trash" data-index="${i}" data-id="${id}"></span>
                            </div>
                        `
                        $('.drawerMiniCart-center').append(cardProduct)
                    })


                    $('.drawerMiniCart-footer__summary .right-qtd').text(totalQty)
                    $('.drawerMiniCart-footer__summary .right-total').text(`R$${totalPrice}`)
                    $('.drawerMiniCart-footer').fadeIn().css('display', 'flex');

                } else {
                    $('.drawerMiniCart-center').html(`
                        <p class="drawerMiniCart-center__empty">
                            Não há produtos em seu carrinho =/
                        </p>
                    `)
                    $('.drawerMiniCart-footer').fadeOut()
                }
            } else{
                $('.menuMobile-carrinho__text').text(`Meu carrinho (${qtyProd}) ${qtyProd > 1 ? 'itens' : 'item'}`)
            }
        })
    },

    miniCartMobile: function () {
        vtexjs.checkout.getOrderForm().done(function (orderForm) {
            const qtyProd = orderForm.items.length;
            $('.headerMobile-carrinho__iconQtd').text(qtyProd)
        })
    },

    apiMenuDesk: function () {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "/api/catalog_system/pub/category/tree/3/",
            "method": "GET"
        }

        $.ajax(settings).done(function (dataMenu) {

            localStorage.setItem('dataMenu', JSON.stringify(dataMenu));
            dataMenu.map(function (field) {
                const idsMenu = [100, 3 ,9, 21, 27, 22, 23, 19, 32, 30, 26];
                if(idsMenu.indexOf(field.id) > 0){
                    $('.menuDesktop-list').append(`
                        <li class="menuDesktop-list__item" id="cat${field.id}">  
                            <a href="${field.url}"> 
                                <i class="menuDesktop-list__itemIcon"></i>
                                <p class="menuDesktop-list__itemText"> ${field.name} </p>
                            </a> 

                        </li>
                    `)

                    if (field.children) {

                        $(`#cat${field.id}`).append(`
                            <ul class="menuDesktop-sub">

                            </ul>
                        `)
                        field.children.map(function (fieldChildren) {
                            $(`#cat${field.id} > .menuDesktop-sub`).append(`
                                <li class="menuDesktop-sub__item sub-${fieldChildren.id}">  
                                    <a href="${fieldChildren.url}">
                                    <p class="menuDesktop-sub__itemText"> ${fieldChildren.name} </p>
                                    </a>
                                </li>`
                            )

                            if (fieldChildren.children) {

                                $(`.sub-${fieldChildren.id}`).append(`
                                    <ul class="menuDesktop-sub-sub">
        
                                    </ul>
                                `)

                                fieldChildren.children.map(function (fieldGrandParents) {
                                    $(`.sub-${fieldChildren.id} > .menuDesktop-sub-sub`).append(`
                                        <li class="menuDesktop-sub-sub__item sub-${fieldGrandParents.id}">  
                                            <a href="${fieldGrandParents.url}">
                                            <p class="menuDesktop-sub__itemText"> ${fieldGrandParents.name} </p>
                                            </a>
                                        </li>`
                                    )
                                }) 

                            }
                        })  
                    }
                } 

                //Departamentos

                $('.departamentos > .menuDesktop-list__sub').append(`
                    <li class="menuDesktop-list__subItem" id="cat${field.id}">  
                        <a href="${field.url}"> 
                            <p class="menuDesktop-list__subItemText"> ${field.name} </p>
                            <i class="menuDesktop-list__subItemIcon"></i>
                        </a> 

                    </li>
                `)

                if (field.children) {

                    $(`.departamentos > .menuDesktop-list__sub .menuDesktop-list__subItem#cat${field.id}`).append(`
                        <div class="wrapper">
                            <ul class="menuDesktop-list__subItem__sub"> </ul>
                        </div>
                    `)
                    field.children.map(function (fieldChildren) {
                        $(`.departamentos > .menuDesktop-list__sub .menuDesktop-list__subItem#cat${field.id} .menuDesktop-list__subItem__sub`).append(`
                            <li class="menuDesktop-list__subItem__subItem" id="cat${fieldChildren.id}">  
                                <a href="${fieldChildren.url}">
                                <p class="menuDesktop-list__subItem__subItem"> <b>${fieldChildren.name}</b> </p>
                                </a>
                            </li>`
                        )

                        if (fieldChildren.children) {
                            $(`.menuDesktop-list__subItem__subItem#cat${fieldChildren.id}`).append(`
                                <ul class="menuDesktop-list__subItem__subItem__sub"> </ul>
                            `)

                            fieldChildren.children.map(function (fieldGrandParents) {
                                $(`.menuDesktop-list__subItem__subItem#cat${fieldChildren.id} > .menuDesktop-list__subItem__subItem__sub`).append(`
                                    <li class="menuDesktop-list__subItem__subItem__subItem">  
                                        <a href="${fieldGrandParents.url}">
                                        <p class="menuDesktop-list__subItem__subItem__subItemText"> ${fieldGrandParents.name} </p>
                                        </a>
                                    </li>`
                                )
                            })  
                        }
                    })  
                }
            })
        }).done(function () {
            $('.menuDesktop-list__item.departamentos').removeClass('load').find('.menuDesktop-list__itemText').text('Departamentos')
            
            $('#cat3 .menuDesktop-sub').append(` 
                ${$('.imagesSubMenu .imagesSubMenu-um').html()}
            `)
            $('#cat9 .menuDesktop-sub').append(` 
                ${$('.imagesSubMenu .imagesSubMenu-dois').html()}
            `)
            $('#cat22 .menuDesktop-sub').append(` 
                ${$('.imagesSubMenu .imagesSubMenu-tres').html()}
            `)
            $('#cat23 .menuDesktop-sub').append(` 
                ${$('.imagesSubMenu .imagesSubMenu-quatro').html()}
            `)
            $('#cat26 .menuDesktop-sub').append(` 
                ${$('.imagesSubMenu .imagesSubMenu-cinco').html()}
            `)
            $('#cat27 .menuDesktop-sub').append(` 
                ${$('.imagesSubMenu .imagesSubMenu-seis').html()}
            `)
            $('#cat30 .menuDesktop-sub').append(` 
                ${$('.imagesSubMenu .imagesSubMenu-sete').html()}
            `)
            $('#cat19 .menuDesktop-sub').append(` 
                ${$('.imagesSubMenu .imagesSubMenu-oito').html()}
            `)
            $('#cat32 .menuDesktop-sub').append(` 
                ${$('.imagesSubMenu .imagesSubMenu-nove').html()}
            `)
            $('#cat21 .menuDesktop-sub').append(` 
                ${$('.imagesSubMenu .imagesSubMenu-dez').html()}
            `)

            $('.menuDesktop-list__item.departamentos').append(` 
                ${$('.imagesSubMenu .MenuImagemDestaque').html()}
            `)

            $('.menuDesktop-list__item').last().after(`
                <li class="menuDesktop-list__item" id="outlet">  
                    <a href="/outlet"> 
                        <i class="menuDesktop-list__itemIcon"></i>
                        <p class="menuDesktop-list__itemText"> Outlet </p>
                    </a> 
                </li>
            `)
        })
    },

    apiMenuMobile: function () {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "/api/catalog_system/pub/category/tree/3/",
            "method": "GET"
        }

        $.ajax(settings).done(function (dataMenu) {
            localStorage.setItem('dataMenu', JSON.stringify(dataMenu));
            dataMenu.map(function (field) {
                const idsMenu = [100, 3,9,21,27,22,23,19,32,30,26];
                if(idsMenu.indexOf(field.id) > 0){
                    const linkMenu = `href="${field.url}`
                    
                    $('.todos_departamentos').before(`
                        <li class="menuMobile-menuList__item" id="cat${field.id}">  
                            <a ${!field.children ? linkMenu : ''}> 
                                <p class="menuMobile-menuList__itemText"> ${field.name} </p>
                                <i class="menuMobile-menuList__itemIcon"></i>
                                ${field.children ? '<i class="menuMobile-menuList__itemArrow"></i>' : ''}
                            </a> 
                        </li>
                    `)

                    if (field.children) {
                        $(`.menuMobile-menuList__item#cat${field.id}`).append(`
                            <ul class="menuMobile-menuSub"></ul>
                        `)
                        field.children.map(function (fieldChildren) {
                            $(`.menuMobile-menuList__item#cat${field.id} > .menuMobile-menuSub`).append(`
                                <li class="menuMobile-menuSub__item sub-${fieldChildren.id}">  
                                    <a href="${fieldChildren.url}">
                                        <p class="menuDesktop-sub__itemText"> ${fieldChildren.name} </p>
                                    </a>
                                </li>`
                            )

                            if (fieldChildren.children) {
                                
                                fieldChildren.children.map(function (fieldGrandParents) {                           
                                    $(`.menuMobile-menuList__item#cat${field.id} > .menuMobile-menuSub`).append(`
                                        <li class="menuMobile-menuSub__item sub-${fieldGrandParents.id}">  
                                            <a href="${fieldGrandParents.url}">
                                                <p class="menuDesktop-sub__itemText"> ${fieldGrandParents.name} </p>
                                            </a>
                                        </li>`
                                    )
                                })
                                
                            }
                        }) 
                        $(`#cat${field.id} > .menuMobile-menuSub`).append(`
                            <li class="menuMobile-menuSub__item ver-todos">  
                                <a href="${field.url}">
                                    <p class="menuDesktop-sub__itemText"> Ver todos em ${field.name} </p>
                                </a>
                            </li>`
                        )
                    }
                } 

                $('.todos_departamentos > .menuMobile-menuSub').append(`
                    <li class="menuMobile-menuList__item" id="cat${field.id}">  
                        <a ${!field.children ? linkMenu : ''}> 
                            <p class="menuMobile-menuList__itemText"> ${field.name} </p>
                            ${field.children ? '<i class="menuMobile-menuList__itemArrow"></i>' : ''}
                        </a> 
                    </li>
                `)

                if (field.children) {
                    $(`.todos_departamentos #cat${field.id}`).append(`
                    <ul class="menuMobile-menuSub"></ul>
                    `)
                    field.children.map(function (fieldChildren) {
                        $(`.todos_departamentos #cat${field.id} > .menuMobile-menuSub`).append(`
                            <li class="menuMobile-menuSub__item sub-${fieldChildren.id}">  
                                <a href="${fieldChildren.url}">
                                    <p class="menuDesktop-sub__itemText"> ${fieldChildren.name} </p>
                                </a>
                            </li>`
                        )

                        if (fieldChildren.children) {
                            fieldChildren.children.map(function (fieldGrandParents) {                           
                                $(`.todos_departamentos #cat${field.id} > .menuMobile-menuSub`).append(`
                                <li class="menuMobile-menuSub__item sub-${fieldGrandParents.id}">  
                                    <a href="${fieldGrandParents.url}">
                                        <p class="menuDesktop-sub__itemText"> ${fieldGrandParents.name} </p>
                                    </a>
                                </li>`)
                            })
                            
                        }
                    }) 
                    $(`.todos_departamentos #cat${field.id} > .menuMobile-menuSub`).append(`
                        <li class="menuMobile-menuSub__item ver-todos">  
                            <a href="${field.url}">
                                <p class="menuDesktop-sub__itemText"> Ver todos em ${field.name} </p>
                            </a>
                        </li>`
                    )
                }
                
            })
        }).done(function(){
            $('.menuMobile-menuList__item a').click(function(){
                $(this).parent().toggleClass('active').find('.menuMobile-menuSub').first().slideToggle()
            })

            $('.menuMobile-menuList > .menuMobile-menuList__item').last().before(`
                <li class="menuMobile-menuList__item" id="outlet">  
                    <a href="/outlet"> 
                        <p class="menuMobile-menuList__itemText"> Outlet </p>
                        <i class="menuMobile-menuList__itemIcon"></i>
                    </a> 
                </li>
            `)
        })
    },

    productDeleteMinicart: function () {
        const _this = this;

        $(document).on('click', '.drawerMiniCart-center__card .trash', function () {
            const itemIndex = $(this).attr('data-index');

            $(this).closest('.drawerMiniCart-center__card').addClass('removing')

            vtexjs.checkout.getOrderForm().then(function (orderForm) {
                const itemsToRemove = [
                    {
                        "index": itemIndex,
                        "quantity": 0,
                    }
                ]
                return vtexjs.checkout.removeItems(itemsToRemove);
            })
                .done(function (orderForm) {

                    _this.miniCart();
                });
        })
    },

    toggleFooterMobile: function () {
        let screen = $(window).width();
        if (screen < 1000) {
            $('.footer__column h4').click(function(){
                $(this).next('.footer__column-list').slideToggle()
            })
        }
    },

    categoryMap: function () {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "/api/catalog_system/pub/category/tree/3/",
            "method": "GET"
        }

        $.ajax(settings).done(function (dataMenu) {
            dataMenu.map(function (field) {
            
                $('.categoryMap-list').append(`
                    <li class="categoryMap-list__item" id="cat${field.id}">  
                        <a href="${field.url}"> 
                            ${field.name}
                        </a> 
                    </li>
                `)

                if (field.children) {
                    $(`.categoryMap-list__item#cat${field.id}`).append(`
                        <ul class="categoryMap-list__itemSub"></ul>
                    `)
                    field.children.map(function (fieldChildren) {
                        $(`#cat${field.id} > .categoryMap-list__itemSub`).append(`
                            <li class="categoryMap-list__itemSub__item sub-${fieldChildren.id}">  
                                <a href="${fieldChildren.url}">
                                    <p class="menuDesktop-sub__itemText"> ${fieldChildren.name} </p>
                                </a>
                            </li>`
                        )

                        if (fieldChildren.children) {
                            fieldChildren.children.map(function (fieldGrandParents) {
                                $(`#cat${field.id} > .categoryMap-list__itemSub`).append(`
                                    <li class="categoryMap-list__itemSub__item sub-${fieldGrandParents.id}">   
                                        <a href="${fieldGrandParents.url}">
                                            <p class="menuDesktop-sub__itemText"> ${fieldGrandParents.name} </p>
                                        </a>
                                    </li>`
                                )
                            })  
                        }
                    })
                }
            })
        })
    },

    btnWhats: function(){
        $('.btnWhatsApp__close').click(function(e){
            e.preventDefault()
            $('.btnWhatsApp').fadeOut()
        })
    },

    scrollHeader: function(){
        $(window).scroll(function(){
            const scrollTop = $(this).scrollTop()

            if(scrollTop > 150){
                $('body').addClass('headerFixed') 
                $('.menuDesktop').fadeOut() 
            } else{
                $('body').removeClass('headerFixed') 
                $('.menuDesktop').show() 
            }  

            scrollTop > 400 ? $('body > header').css('top', '0') : $('body > header').css('top', '-100%') 
        })

        $('.header-departamentos').click(function(){
            $('.menuDesktop').fadeToggle()
        })

        $(document).on('click', '.headerFixed header .header-saudacao__icon', function(){
            window.location.href = "/account";
        })
    }
}

module.exports = Default