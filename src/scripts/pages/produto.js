let Produto = {
  init: function () {
    this.imgProd();
    this.parcelamento();
    this.qtdProd();
    this.buyButton();
    this.shippingField();
    this.descriçãoProd();
    this.compreJunto();
    this.selos();
    this.variacaoProd();
    this.percentualBoleto();
    this.compatilhe();
    this.similares();
  },
  imgProd: function () {
    $(".produtoTop-esquerdo__img .thumbs").slick({
      slidesToShow: 4,
      slidesToScroll: 4,
      vertical: !0,
      infinite: !1,
      responsive: [
        {
          breakpoint: 1140,
          settings: {
            vertical: false,
          },
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            vertical: !1,
          },
        },
      ],
    });

    $(window).load(function () {
      const screen = $(window).width();
      window.LoadZoom = function (pi) {
        if (screen > 1640) {
          var opcoesZomm = {
            zoomWidth: 364,
            zoomHeight: 364,
            preloadText: "",
          };
        } else {
          var opcoesZomm = {
            zoomWidth: 365,
            zoomHeight: 365,
            preloadText: "",
          };
        }

        if (screen > 769) {
          $(".image-zoom").jqzoom(opcoesZomm);
        }
      };
      LoadZoom(0);
      ImageControl($("ul.thumbs a:first"), 0);
    });

    $("#image").prepend(`
            <span class="arrow-image prev-slide"> </span>
            <span class="arrow-image next-slide"> </span>
        `);

    $(".thumbs .slick-slide").first().addClass("first");
    $(".thumbs .slick-slide").last().addClass("last");

    $(".arrow-image.prev-slide").click(function () {
      if ($(".thumbs .slick-slide a.ON").parent().hasClass("first")) {
        $(".thumbs .slick-slide.last a").trigger("click");
      } else {
        $(".thumbs .slick-slide a.ON")
          .parent()
          .prev()
          .find("a")
          .trigger("click");
      }

      setTimeout(function () {
        $(".thumbs .slick-slide a.ON").trigger("click");
      }, 500);
    });

    $(".arrow-image.next-slide").click(function () {
      if ($(".thumbs .slick-slide a.ON").parent().hasClass("last")) {
        $(".thumbs .slick-slide.first a").trigger("click");
      } else {
        $(".thumbs .slick-slide a.ON")
          .parent()
          .next()
          .find("a")
          .trigger("click");
      }

      setTimeout(function () {
        $(".thumbs .slick-slide a.ON").trigger("click");
      }, 500);
    });
  },

  parcelamento: function () {
    const qtdParc = parseInt(
      $(".valor-dividido.price-installments .skuBestInstallmentNumber")
        .text()
        .replace("x", "")
    );
    const valorParc = $(
      ".valor-dividido.price-installments .skuBestInstallmentValue"
    ).text();
    const valProd = ePlusUtils.Helpers.getMoney(
      $(
        ".produtoTop-direita__price .descricao-preco .valor-por .skuBestPrice"
      ).text()
    );

    $(".produtoMiddle-direita__parcelas .text .numParcelas").text(
      qtdParc + "x"
    );
    $(".produtoMiddle-direita__parcelas .text .valParcelas").text(valorParc);

    for (let i=1; i <= parseInt(qtdParc); i++) {
      $(".modalParcelas-list").append(
        `<li>
                     <b>${i}x</b> de <b>R$ ${ePlusUtils.Helpers.formatReal(
          Math.round(valProd / i)
        )}</b> sem juros
                 </li>`
      );
    }
  },

  qtdProd: function () {
    $(".qtyField-buttons .plus, .qtyField-buttons .minus").click(function () {
      const qtdProd = parseInt($(".qtyField-input").val());
      if ($(this).hasClass("minus")) {
        if (qtdProd > 1) {
          $(".qtyField-input").val(qtdProd - 1);
        } else {
          $(".qtyField-input").val(1);
        }
      } else {
        $(".qtyField-input").val(qtdProd + 1);
      }
    });

    $(".qtyField-input").keyup(function () {
      const qtdProd = $(this).val();
      $(this).val(qtdProd.replace(/[^\d]/g, ""));
    });

    $(".qtyField-input").blur(function () {
      const qtdProd = $(this).val();

      if (qtdProd < 1 || qtdProd === "") {
        $(this).val(1);
      }
    });
  },

  buyButton: function () {
    $(".produtoTop-direita__buy-button .buyButton").click(function () {
      let _this = $(this);
      _this.text("Comprando...");
      let idProd = $("#___rc-p-sku-ids").val();
      let qtd = $(".qtyField-input").val();
      let nomeProd = $(".productName").text();

      vtexjs.checkout.getOrderForm().then(function () {
        let item = {
          id: idProd,
          quantity: qtd,
          seller: 1,
        };
        vtexjs.checkout.addToCart([item]).done(function (orderForm) {
          ePlusUtils.Helpers.atualizaCart();
          _this.html('<i class="prateleira__btnComprar-Icon"> </i>Comprar ');
          Swal.fire({
            title: "Produto adicionado no carrinho",
            icon: "success",
          });
        });
      });
    });
  },

  shippingField: function () {
    $(".produtoTop-direita__shipping .shippingField").mask("99999-999");

    $(".produtoTop-direita__shipping .shippingField").blur(function () {
      const cep = $(this).val();

      if (cep.length < 9) {
        $(this).addClass("error");
      }
    });

    $(".produtoTop-direita__shipping .shippingField").click(function () {
      $(this).removeClass("error");
    });

    $(".produtoTop-direita__shipping button").click(function () {
      const cep = $(".produtoTop-direita__shipping .shippingField").val();

      if (cep.length < 9) {
        $(".produtoTop-direita__shipping .shippingField").addClass("error");
      } else {
        let idSku = $("#___rc-p-sku-ids").attr("value");
        let country = "BRA";
        let postalCode = cep;

        let items = [
          {
            id: idSku, // sku do item
            quantity: 1,
            seller: "1",
          },
        ];

        vtexjs.checkout
          .simulateShipping(items, postalCode, country)
          .done(function (res) {
            $(".shippingResult table .item-frete").remove();
            $(".shippingResult").fadeIn();
            res.logisticsInfo[0].slas.map(function (result) {
              let servico = result.name;
              let prazo = result.shippingEstimate.replace("bd", " dia(s)");
              let preco = ePlusUtils.Helpers.formatReal(result.price);
              $(".shippingResult table").append(
                '<tr class="item-frete">' +
                  "<td>" +
                  servico +
                  "</td>" +
                  "<td>" +
                  prazo +
                  "</td>" +
                  "<td> R$" +
                  preco +
                  "</td>" +
                  "</tr>"
              );
            });
          });
      }
    });
  },

  descriçãoProd: function () {
    const itensInclusos = $(
      ".Especificacoes .value-field.Itens-Inclusos"
    ).html();
    const compatibilidade = $(
      ".Especificacoes .value-field.Compatibilidade-do-Produto"
    ).html();
    const especificacaoTecnica = $(
      ".Especificacoes .value-field.Especificacao-Tecnica"
    ).html();

    itensInclusos?.length > 0
      ? $(".detalhesProd__itensInclusos-content").html(itensInclusos)
      : $(".detalhesProd__itensInclusos").hide();
    compatibilidade?.length > 0
      ? $(".detalhesProd__compatibilidade-content").html(compatibilidade)
      : $(".detalhesProd__compatibilidade").hide();
    especificacaoTecnica?.length > 0
      ? $(".detalhesProd__especTecnica-content").html(especificacaoTecnica)
      : $(".detalhesProd__especTecnica").hide();
  },

  variacaoProd: function () {
    $(".produtoTop-direita__variantes-sku .topic .select span label").click(
      function () {
        //ImageProduct
        $(".produtoTop-esquerdo__img .thumbs").slick("unslick");
        setTimeout(function () {
          $(".produtoTop-esquerdo__img .thumbs").slick({
            slidesToShow: 3,
            slidesToScroll: 3,
            vertical: !0,
            infinite: !1,
            responsive: [
              {
                breakpoint: 1140,
                settings: {
                  vertical: false,
                },
              },
              {
                breakpoint: 400,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2,
                  vertical: !1,
                },
              },
            ],
          });

          // installmentProduct
          const qtdParc = parseInt(
            $(".valor-dividido.price-installments .skuBestInstallmentNumber")
              .text()
              .replace("x", "")
          );
          const valorParc = $(
            ".valor-dividido.price-installments .skuBestInstallmentValue"
          ).text();
          const valProd = ePlusUtils.Helpers.getMoney(
            $(
              ".produtoTop-direita__price .descricao-preco .valor-por .skuBestPrice"
            ).text()
          );

          $(".modalParcelas-list").empty();

          $(".produtoMiddle-direita__parcelas .text .numParcelas").text(
            qtdParc + "x"
          );
          $(".produtoMiddle-direita__parcelas .text .valParcelas").text(
            valorParc
          );

          for (i = 1; i <= qtdParc; i++) {
            $(".modalParcelas-list").append(
              `<li>
                            <b>${i}x</b> de <b>R$ ${ePlusUtils.Helpers.formatReal(
                valProd
              )}</b> sem juros
                            </li>`
            );
          }
        }, 1500);
      }
    );
  },

  compreJunto: function () {
    const _this = this;
    const prodImg = $("#image-main").attr("src");
    const prodName = $(".produtoTop-direita__title .productName").text();
    if ($(".amc-compreJunto ul li").length > 0) {
      $(".compreJunto__principal").append(`
                <img src="${prodImg}" title="${prodName}" />
                <h2> ${prodName} </h2>
            `);

      $(".compreJunto__compreJunto .amc-compreJunto ul").slick({
        infinite: !1,
      });

      $(".compreJunto__compreJunto .amc-compreJunto ul").on(
        "setPosition",
        function () {
          _this.seleCompreJunto();
        }
      );

      $(".compreJunto__total .buyButton").click(function () {
        const principalIdSku = $("#___rc-p-sku-ids").val();
        const idSku = $(
          ".compreJunto__compreJunto .amc-compreJunto ul .slick-active .prateleira__lead"
        ).attr("data-idsku");

        vtexjs.checkout.getOrderForm().then(function () {
          let item = [
            {
              id: principalIdSku,
              quantity: 1,
              seller: 1,
            },
            {
              id: idSku,
              quantity: 1,
              seller: 1,
            },
          ];
          vtexjs.checkout.addToCart(item).done(function (orderForm) {
            ePlusUtils.Helpers.atualizaCart();
            Swal.fire({
              title: "Produtos adicionados no carrinho",
              icon: "success",
            });
          });
        });
      });
      _this.seleCompreJunto();
    } else {
      $(".compreJunto").hide();
    }
  },

  seleCompreJunto: function () {
    const price = ePlusUtils.Helpers.getMoney(
      $(
        ".compreJunto__compreJunto .amc-compreJunto ul .slick-active .prateleira__lead"
      ).attr("data-price")
    );
    const principalPrice = ePlusUtils.Helpers.getMoney(
      $(
        ".produtoTop-direita__price .descricao-preco .valor-por .skuBestPrice"
      ).text()
    );

    $(".compreJunto__total p")
      .last()
      .text(
        ePlusUtils.Helpers.formatReal(
          parseInt(price) + parseInt(principalPrice)
        )
      );
  },

  selos: function () {
    const valorDe = ePlusUtils.Helpers.getMoney($('.produtoTop-direita__price .descricao-preco .valor-de .skuListPrice').text());
    const valorPor = ePlusUtils.Helpers.getMoney($('.produtoTop-direita__price .descricao-preco .valor-por .skuBestPrice').text());
    const desconto = (valorDe - valorPor) / valorPor;
    desconto ? 
    $('.produtoTop-esquerdo__img .selosImg').prepend(`<span class="selosImg-seloDesconto">-${Math.round(desconto * 100)}%</span>`)
    : null

    seloPretoEsquerdo.length > 0
      ? $(".produtoTop-selos").append(
          `<span class="produtoTop-selos-seloPretoEsquerdo">${seloPretoEsquerdo}</span>`
        )
      : "";
    seloVermelhoDireito.length > 0
      ? $(".produtoTop-selos").append(
          `<span class="produtoTop-selos-seloVermelhoDireito">${seloVermelhoDireito}</span>`
        )
      : "";
    seloDestaqueTopo.length > 0
      ? $(".produtoTop-esquerdo__img .selosImg").append(
          `<span class="selosImg-seloDestaqueTopo">${seloDestaqueTopo}</span>`
        )
      : "";
    seloTrocaFacil.length == "Sem selo"
      ? $(".produtoMiddle-direita__trocaFacil").hide()
      : "";
  },

  percentualBoleto: function () {
    const porcentagem = parseFloat($("#percentualBoleto").text());
    
    const price = $(
      ".produtoTop-direita__price .descricao-preco .valor-por .skuBestPrice"
    ).text();
    const valorDescontado = price
      ? ePlusUtils.Helpers.getMoney(price) -
        Math.round((porcentagem / 100) * ePlusUtils.Helpers.getMoney(price))
      : null;

    price.length > 0
      ? $(".produtoMiddle-direita__boleto .text .valBoleto").text(
          `R$ ${ePlusUtils.Helpers.formatReal(valorDescontado)}`
        )
      : null;
  },

  compatilhe: function() {
    const urlAtual = window. location.href;
    const nameProduct = $('.produtoTop-direita__title .productName').text();
    const urlFacebook = `https://www.facebook.com/sharer/sharer.php?u=${urlAtual}`
    const urlWhatsApp = `https://api.whatsapp.com/send?text=${urlAtual}`
    const urlemail = `mailto:?subject=${nameProduct}&body=${urlAtual}`
    $('.produtoBottom-direita__compartilheItem.facebook a').attr('href', urlFacebook)
    $('.produtoBottom-direita__compartilheItem.whatsapp a').attr('href', urlWhatsApp)
    $('.produtoBottom-direita__compartilheItem.email a').attr('href', urlemail)
  },
  
  similares: function() {
    const similares = $('.amc-similares ul li').length
    similares < 1 ?  $('.produtoTop-direita__similares').hide() : null
  }
};

module.exports = Produto;
