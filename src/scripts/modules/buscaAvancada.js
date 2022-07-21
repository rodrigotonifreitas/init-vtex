let BuscaAvancada = {

    init: function () {
        this.marcas()        
        this.listSelect()
        this.btnBuscar()
    },

    marcas: function () {   
            let settings = {
                "url": "/api/dataentities/BA/search?_where=marca_inicial is not null&_fields=marca_inicial",
                "type": "GET",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json; charset=utf-8",
                    "Accept": "application/vnd.vtex.ds.v10+json",
                    "crossDomain": true,
                    "REST-Range": "resources=0-999"
                },
                "processData": false,
                "mimeType": "application/json",
                "contentType": false
            };
        
            $.ajax(settings).done(function (response) {
                let marcas= []

                response.map((marca, i)=>{
                    marcas.push(marca.marca_inicial)
                })

                let marcasFiltradas = marcas.filter(function(este, i) {
                    return marcas.indexOf(este) === i;
                });

                marcasFiltradas.sort().map((marca)=>{
                    $('.montadora .buscaAvancada-list').append(`
                        <li class="buscaAvancada-list__item"> ${marca.replace(/_/g, ' ')} </li>
                    `)
                })
            });
    },

    modelos: function (marca) {   
        let settings = {
            "url": `/api/dataentities/BA/search?_where=marca=${marca}&_fields=modelo`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json; charset=utf-8",
                "Accept": "application/vnd.vtex.ds.v10+json",
                "crossDomain": true,
                "REST-Range": "resources=0-999"
            },
            "processData": false,
            "mimeType": "application/json",
            "contentType": false
        };
    
        $.ajax(settings).done(function (response) {
            let modelos= []

            response.map((modelo)=>{
                modelos.push(modelo.modelo)
            })

            let modelosFiltradas = modelos.filter(function(este, i) {
                return modelos.indexOf(este) === i;
            });

            modelosFiltradas.sort().map((modelo)=>{
                $('.modelo .buscaAvancada-select__title, .buscaAvancada-btnBuscar').removeClass('disable')
                $('.modelo .buscaAvancada-list').append(`
                    <li class="buscaAvancada-list__item"> ${modelo.replace(/_/g, ' ')} </li>
                `)
            })
        });
    },

    anos: function (modelo) {   

        let settings = {
            "url": `/api/dataentities/BA/search?_where=modelo=${modelo}&_fields=ano`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json; charset=utf-8",
                "Accept": "application/vnd.vtex.ds.v10+json",
                "crossDomain": true,
                "REST-Range": "resources=0-999"
            },
            "processData": false,
            "mimeType": "application/json",
            "contentType": false
        };
    
        $.ajax(settings).done(function (response) {
            let anos= []

            response.map((ano)=>{
                anos.push(ano.ano)
            })

            let anosFiltradas = anos.filter(function(este, i) {
                return anos.indexOf(este) === i;
            });

            let anosOrdenados = anosFiltradas.sort();

            anosOrdenados.map((ano)=>{
                $('.ano .buscaAvancada-select__title').removeClass('disable')
                $('.ano .buscaAvancada-list').append(`
                    <li class="buscaAvancada-list__item"> ${ano.replace(/_/g, ' ')} </li>
                `)
            })
        });
    },
    
    listSelect: function () {
        const _this = this
        $('.buscaAvancada-select__title').click(function(){
            $(this).next('.buscaAvancada-list').fadeToggle()
        })

        $(document).on('click', '.buscaAvancada-list__item', function(){
            const valueSelect = $(this).text()
            const list = $(this).closest('.buscaAvancada-list')
            list.fadeToggle().prev('.buscaAvancada-select__title').attr('data-value', valueSelect).find('p').text(valueSelect)
            
            if($(this).closest('.buscaAvancada-select').hasClass('montadora')){

                //Reseta os campos
                $('.modelo .buscaAvancada-list, .ano .buscaAvancada-list').empty()
                $('.modelo .buscaAvancada-select__title').attr('data-value','').find('p').text('Selecione o Modelo')
                $('.modelo .buscaAvancada-select__title').addClass('disable')
                $('.ano .buscaAvancada-select__title').attr('data-value','').find('p').text('Selecione o Ano')
                $('.ano .buscaAvancada-select__title').addClass('disable')
                $('.buscaAvancada-btnBuscar').addClass('disable')

                //Chama func modelos
                _this.modelos(valueSelect.trim().replace(/ /g, '_'))

            } else if($(this).closest('.buscaAvancada-select').hasClass('modelo')){

                //Reseta os campos
                $('.ano .buscaAvancada-list').empty()
                $('.ano .buscaAvancada-select__title').attr('data-value','').find('p').text('Selecione o Ano')

                //Chama func anos
                _this.anos(valueSelect.trim().replace(/ /g, '_'))

            } else if($(this).closest('.buscaAvancada-select').hasClass('ano')){
                $('.buscaAvancada-btnBuscar').removeClass('disable')
            }   
        })
    },

    btnBuscar: function () {
        $('.buscaAvancada-btnBuscar').click(function(e){
            e.preventDefault()

            const montadora = $('.montadora .buscaAvancada-select__title').attr('data-value').trim()
            const modelo = $('.modelo .buscaAvancada-select__title').attr('data-value').trim()
            const ano = $('.ano .buscaAvancada-select__title').attr('data-value').trim()
           
            if(!$(this).hasClass("disable")){
                const link = `/${montadora}/${modelo}/${ano}?map=specificationFilter_18,specificationFilter_19,specificationFilter_20`
                window.location.href = link;
            }
        })
    },
}



module.exports = BuscaAvancada