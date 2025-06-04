const createError = require('http-errors');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
    try {
        //#swagger.tags=['Books']
        const response = await mongodb.getDatabase().db().collection("actors").find();
        if(!response) throw createError(404, "Not Actors found");

        response.toArray().then((movies) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(movies);
        })
    } catch (err) {
        next(err);
    }
};

const getSingle = async (req, res, next) => {
    try {
        //#swagger.tags=['Books']
        const actorId = new ObjectId(req.params.id);
        
        const validID = await validateExistingID(actorId);
        if(!validID) throw createError(404, "Actors ID does not exist");

        const response = await mongodb.getDatabase().db().collection("actors").findOne({_id: actorId});
        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

const getSingleQueries = async (req, res, next) => {
    try {
        //#swagger.tags=['Books']
        const actorsName = String(req.query.name);
        const response = await mongodb.getDatabase().db().collection("actors").findOne({ name: actorsName });

        if(!response) throw createError(404, "Actors Name does not exist");
        
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

const addActors = async (req, res, next) => {
    //#swagger.tags=['Books']
    const actor = {
        name: req.body.name,
        last_name: req.body.last_name,
        birthdate: req.body.birthdate,
        height_m: req.body.height_m,
        country: req.body.country,
        movies_id: req.body.movies_id
    }
    const response = await mongodb.getDatabase().db().collection("actors").insertOne(actor);
    if (response.acknowledged) {
        return res.status(204).send();
    } else {
        res.status(500).json(response.error || "Some error occurred while adding the movie.")
    }
}

const updateActors = async (req, res, next) => {
    //#swagger.tags=['Books']
    try {
        const actorId = new ObjectId(req.params.id);
        const actor = {
            name: req.body.name,
            last_name: req.body.last_name,
            birthdate: req.body.birthdate,
            height_m: req.body.height_m,
            country: req.body.country,
            movies_id: req.body.movies_id
        }

        const validID = await validateExistingID(actorId);

        if(!validID) throw createError(404, "Actors ID does not exist");
    
        const response = await mongodb.getDatabase().db().collection("actors").replaceOne({_id: actorId}, actor);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        }
    } catch (err) {
        next(err);
    }
};

const deleteActors = async (req, res, next) => {
    try {
        //#swagger.tags=['Books']
        const actorId = new ObjectId(req.params.id);

        const validID = await validateExistingID(actorId);
        if(!validID) throw createError(404, "Actors ID does not exist");
        
        const response = await mongodb.getDatabase().db().collection("actors").deleteOne({_id: actorId});
        if (response.deletedCount > 0) {
            res.status(204).send();
        }
    } catch (err) {
        next(err);
    }


};


const validateExistingID = async (id) => {
    const actorsID = await mongodb.getDatabase().db().collection("actors").findOne({_id: id});
    return !!actorsID;
}

module.exports = {
    getAll,
    getSingle,
    getSingleQueries,
    addActors,
    updateActors,
    deleteActors
}