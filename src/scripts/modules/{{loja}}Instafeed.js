let AmcInstafeed = {

    init: function () {
        this.getPosts();      
    },

    getPosts: function () {
        const limit = $(window).width() > 1000 ? 5 : 1;
        const position = $(window).width() > 1000 ? 3 : 1;
        const tokenInsta = $('#tokenInsta').text()

        let feed = new Instafeed({
            accessToken: tokenInsta,
            limit: limit,
            template: '<a href="{{link}}" target="_blank"><img title="{{caption}}" src="{{image}}" /></a>',
            
        });
        feed.run();

        setTimeout(function(){
            $(`.instafeed__post a:nth-of-type(${position})`).after(
                `
                    <a>
                        <img src="/arquivos/instagram.png" alt="instagram" />
                    </a>
                `
            )
        },2000)
    }
}

module.exports = AmcInstafeed