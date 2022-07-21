let Login = {

    init: function () {
        this.loginClose()
    },

    loginClose: function () {
        $(document).on("click", ".vtexIdUI-close", function () {
            location.href = document.referrer;
        })
    },
}

module.exports = Login