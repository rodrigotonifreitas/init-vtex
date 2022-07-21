window.ePlusUtils = {
  Helpers: {

      validateEmail: (fcEmail) => {
          var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(fcEmail);
      },

      validate: (fcEmail) => {
          if (ePlusUtils.Helpers.validateEmail(fcEmail)) {
              return true;
          } else {
              return false;
          }
      },

      formatReal: function (int) {
          var tmp = int + "";
          tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
          if (tmp.length > 6) tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
          return tmp;
      },

      getMoney: function (str) {
          return parseInt(str.replace(/[\D]+/g, ""));
      },

      getSkuData: (skuId, cb, cbParameters) => {
          let skuData = {};
          if (skuId > 0) {
              if (ListSkuData["sku" + skuId] === undefined) {
                  $.ajax({
                      type: "GET",
                      url: '/produto/sku/' + skuId,
                      dataType: 'json',
                      success: function (dataValue) {
                          var temp = "";
                          cb(dataValue, cbParameters);
                      },
                      error: function () {
                          alert("erro ao buscar objeto SKU");
                      }
                  });
                  skuData = ListSkuData["sku" + skuId];
              }
          } else {
              alert("SKU nao encontrado");
          }
      },

      enviaDados:  (obj, app, classe, html, remove) => {
          let request = $.ajax({
              accept: 'application/vnd.vtex.ds.v10+json',
              contentType: 'application/json; charset=utf-8',
              crossDomain: true,
              data: JSON.stringify(obj),
              type: 'POST',
              url: `/api/dataentities/${app}/documents`,
              success: function (data) {
                  $(classe).html(html)
                  $(remove).remove()
              },
              error: function (error) {}
          });
          return request;
      },

      atualizaCart: () => {
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
                        const id = res.id;
                        const image = res.imageUrl;
                        const name = res.name;
                        const price = res.sellingPrice ? res.sellingPrice : res.price;
                        totalQty = totalQty + res.quantity

                        const cardProduct = `
                            <div class="drawerMiniCart-center__card">
                                <img src="${image} alt="${name}" title="${name}"/>
                                <span  class="infoCard">
                                    <p class="infoCard-name">
                                    ${name}
                                    </p>
                                    <p class="infoCard-price">
                                        <b>Por: </b> R$${ePlusUtils.Helpers.formatReal(price)}
                                    </p>
                                </span>
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
  },
  UI: {
      
      slideScroll: function slideScroll(classe) {
          let posicaoSlide = $(classe).offset().top;
          $('html, body').animate({
              scrollTop: posicaoSlide
          }, 1000);
      }
  }
}