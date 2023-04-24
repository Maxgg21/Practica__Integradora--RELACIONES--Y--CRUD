const { Movie, Sequelize , Genre, Actor} = require('../database/models');
const {validationResult} = require('express-validator')

const moviesController = {
    list : (req, res) => {
        Movie.findAll()
        .then(movies => {
            //return res.send(movies)
            return res.render('moviesList', {movies})
        })
    },
    detail : (req, res) => {
        Movie.findByPk(req.params.id, {
            include: [{association: 'actors'}, {association: 'genre'}]
        }).then(movie => {
            //return res.send(movie)
            return res.render('moviesDetail', {movie})
        })
    },
    new : (req, res) => {
        Movie.findAll({
            order : [
                ['release_date', 'DESC'],
            ],
            limit: 5,
        }, 
        {
            include : [{association: 'genre'}, ] 
        })
        .then(movies => {
            return res.render('newestMovies', {movies});
        })
    },
    recomended : (req, res) => {
        Movie.findAll({
            where: {
                rating : {[Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ],
        }, {
            include : [{association: 'genre'}] 
        })
        .then(movies => {
            return res.render('recommendedMovies', {movies})
        });
    },
    add: function (req, res) {
        // TODO 
        Genre.findAll().then(genres => {
            return res.render('moviesAdd', {
                genres
            })
        }).catch(error => console.log(error));
    },
    create: function (req, res) {
        // TODO
        const errors = validationResult(req);
        if(errors.isEmpty()){
            const {
                title,
                awards,
                release_date,
                length,
                rating,
                genre_id
            } = req.body;

            Movie.create({
                title,
                awards,
                release_date,
                length,
                rating,
                genre_id
            })
            .then((response) => {
                if(response){
                    return res.redirect("/movies")
                }else{
                    throw new Error(
                        "mensaje de error"
                    )
                }
            })
        }else{
            Genre.findAll().then(genres => {
                return res.render('moviesAdd', {
                    genres,
                    errors: errors.mapped(),
                    old: req.body,
                })
            }).catch(error => console.log(error));
        }
    },
    edit: function(req, res) {
        // TODO
        const MOVIE_ID = req.params.id;
        const MOVIE_PROMISE = Movie.findByPk(MOVIE_ID);
        const GENRE_PROMISE = Genre.findAll();
        
        Promise.all([MOVIE_PROMISE, GENRE_PROMISE])

        .then(([Movie, genres]) =>{
            return res.render('moviesEdit',{
                Movie,
                genres
            })
        }).catch(error => console.log(error))
    },
    update: function (req,res) {
        // TODO
        const errors = validationResult(req);
        const MOVIE_ID = req.params.id;

        if(errors.isEmpty()){
            const {
               title,
               awards,
               release_date,
               length,
               rating,
               genre_id 
            } = req.body;

            Movie.update({
                title,
                awards,
                release_date,
                length,
                rating,
                genre_id 
            }, {
                where:{
                    id : MOVIE_ID,
                }
            }).then((response)=>{
                if(response){
                    
                    return res.redirect('/movies');
                }else{
                    throw new Error('ERROR')
                }
            })
        }else{
            const MOVIE_ID = req.params.id;
            const MOVIE_PROMISE = Movie.findByPk(MOVIE_ID);
            const GENRE_PROMISE = Genre.findAll();
        
            Promise.all([MOVIE_PROMISE, GENRE_PROMISE])

            .then(([Movie, genres]) =>{
                return res.render('moviesEdit',{
                    Movie,
                    genres,
                    errors: errors.mapped(),
            })
        }).catch(error => console.log(error))
        }
    },
    delete: function (req, res) {
        // TODO
        const MOVIE_ID = req.params.id;
        Movie.findByPk(MOVIE_ID)
        .then(movieToDelete => {
            return res.render("moviesDelete", 
            {Movie: movieToDelete}
            )
        })
        .catch(error => console.log(error))
    },
    destroy: async function (req, res) {
        // TODO
        const {id : MOVIE_ID} = req.params;
       
        const ACTOR_DELETE = await Actor.update( {favorite_movie_id : null }, {
            where : {
                favorite_movie_id : MOVIE_ID
            }
        })
        if (!ACTOR_DELETE) {
            throw new Error('ERORRRRRRRRRRRRRRRR AQUI')
        }else {
            Movie.destroy({
                where: {
                    id : MOVIE_ID
                }, 
            }).then(()=> {
                return res.redirect('/movies')
            })
            .catch(error => console.log(error))
        }        
    }
};

module.exports = moviesController;