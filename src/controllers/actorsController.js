const {Actor} = require('../database/models');


const actorsController = {
    list: (req, res) => {
        Actor.findAll()
        .then((resolve) => {
//            return res.send(resolve)
            return res.render('actorMovies', {actors : resolve})
        })
    }
};

module.exports = actorsController;