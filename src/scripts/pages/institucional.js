let Institucional = {

    init: function () {
        this.faleConosco()
    },

    faleConosco: function () {
        $(".enviarForm").click(function () {

            let varE = $('#fcEmail').val();
            let varM = $('#fcMsg').val();
            let varN = $('#fcNome').val();

            if(!ePlusUtils.Helpers.validate(varE)){
                alert('Preencha um e-mail válido')
                return
            } 
            
            let obj = {
                nome: varN,
                email: varE,
                mensagem: varM
            }

            ePlusUtils.Helpers.enviaDados(obj, "FC", ".formulario",
            alert('Preencha um e-mail válido'));
        });
    },
}

module.exports = Institucional