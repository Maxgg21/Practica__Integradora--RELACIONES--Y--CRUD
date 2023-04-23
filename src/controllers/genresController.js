const {Genre} = require('../database/models');

const genresController = {
    list : (req, res) => {
        Genre.findAll()
        .then( (genres) => {
            //return res.send(genre),
           return res.render('genresList', {genres})
        });
    },
    
    detail : (req, res) => {
        Genre.findByPk(req.params.id, {
            include : [{association: 'movies'}]
        })
        .then(genre => {
            return res.render('genresDetail.ejs', {genre})
        });
    },
};

module.exports = genresController