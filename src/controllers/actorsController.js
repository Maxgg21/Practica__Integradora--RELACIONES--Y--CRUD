const {Actor} = require('../database/models');


const actorsController = {
    list: (req, res) => {
        Actor.findAll()
        .then((resolve) => {
//            return res.send(resolve)
            return res.render('actorMovies', {actors : resolve})
        })
    },
    relatedMovie : async (req, res) => {
        
       Actor.findByPk(req.params.id)
        .then(actor => {
            return res.render('actorDetail', {actor})
        }).catch(error => console.log(error))
      
    }
};

module.exports = actorsController;