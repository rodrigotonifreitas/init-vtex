let AmcNewsletter = {

    init: function () {
        this.register();           
    },

    register: function () {
        $('.newsletter__form-btnEnviar').click(function(){
            
            const nome = $('.newsletter__form-nome').val()
            const carro = $('.newsletter__form-carro').val()
            const email = $('.newsletter__form-email').val()

            if(nome.length < 2){
                Swal.fire({
                    title: 'Insira seu nome',
                    icon: 'warning',
                })
            } else if(email.length < 2){
                Swal.fire({
                    title: 'Insira seu e-mail',
                    icon: 'warning',
                })
            } else if(!/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i.test(email)){
                Swal.fire({
                    title: 'Insira um e-mail válido',
                    icon: 'warning',
                })
            } else{
    
                let settings = {
                    "url": "/api/dataentities/NL/documents",
                    "type": "POST",
                    "headers": {
                        "Content-Type": "application/json",
                        "Accept": "application/vnd.vtex.ds.v10+json"
                    },
                    "data": JSON.stringify({
                        "nome" : nome,
                        "carro" : carro,
                        "email" : email,
                    })
                };
                    
                $.ajax(settings).done(function () {
                    Swal.fire({
                        title: 'Registro concuido com sucesso',
                        icon: 'success',
                    })
                    $('.newsletter__form-nome, .newsletter__form-carro, .newsletter__form-email').val('')
                });
            }
    
        })
    }
}

module.exports = AmcNewsletter