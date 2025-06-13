const createError = require('http-errors');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const lookup = {
    $lookup: {
        from: "Books",
        localField: "books",
        foreignField: "_id",
        as: "books"
    }
}

const aggregateSetting = {
    $project: {
        name: 1,
        lastname: 1,
        dateOfBirth: 1,
        country: 1,
        "books.title": 1,
        "books.releaseDate": 1,
        gender: 1,
        biography: 1,
        alive: 1
    }
}

const getAll = async (req, res, next) => {
    try {
        //#swagger.tags=['Authors']
        const response = await mongodb
                                    .getDatabase()
                                    .db()
                                    .collection("Authors")
                                    .aggregate([lookup,aggregateSetting]);
        
        if(!response.length) throw createError(404, "Not Authors found");

        response.toArray().then((author) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(author);
        })
    } catch (err) {
        next(err);
    }
};

const getSingleById = async (req, res, next) => {
    try {
        //#swagger.tags=['Authors']
        const authorId = new ObjectId(req.params.id);
        
        const validID = await validateExistingID(authorId);
        if(!validID) throw createError(404, "Authors ID does not exist");

        const response = await mongodb
                                    .getDatabase()
                                    .db()
                                    .collection("Authors")
                                    .aggregate([
                                        { $match: {_id: authorId} },
                                        lookup,
                                        aggregateSetting
                                    ]).toArray();

        if(!response.length) throw createError(404, "Not Authors found");
        
        res.status(200).json(response[0]);
    } catch (err) {
        next(err);
    }
}

const getByQueries = async (req, res, next) => {
    try {
        //#swagger.tags=['Authors']
        const actorsName = String(req.query.name);
        const actorsLastName = String(req.query.last_name || "");
        const response = await mongodb
                                    .getDatabase()
                                    .db()
                                    .collection("Authors")
                                    .aggregate([
                                        {
                                            $match: { 
                                                name: { $regex: actorsName, $options: 'i' },
                                                lastname: { $regex: actorsLastName, $options: 'i' }
                                            }
                                        },
                                        lookup,
                                        aggregateSetting
                                    ]).toArray();

        if(!response.length) throw createError(404, "Not Authors found");
        
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

const addAuthors = async (req, res, next) => {
    //#swagger.tags=['Authors']
    const author = {
        name: req.body.name,
        lastname: req.body.lastname,
        dateOfBirth: req.body.dateOfBirth,
        country: req.body.country,
        books: req.body.books?.map(bookId => (
            new ObjectId(bookId)
        )) ?? [],
        gender: req.body.gender,
        biography: req.body.biography,
        alive: req.body.alive
    }
    const response = await mongodb.getDatabase().db().collection("Authors").insertOne(author);
    if (response.acknowledged) {
        return res.status(204).send();
    } else {
        res.status(500).json(response.error || "Some error occurred while adding the movie.")
    }
}

const updateAuthors = async (req, res, next) => {
    //#swagger.tags=['Authors']
    try {
        const authorId = new ObjectId(req.params.id);
        const author = {
            name: req.body.name,
            lastname: req.body.lastname,
            dateOfBirth: req.body.dateOfBirth,
            country: req.body.country,
            books: req.body.books?.map(bookId => (
                new ObjectId(bookId)
            )) ?? [],
            gender: req.body.gender,
            biography: req.body.biography,
            alive: req.body.alive
        }

        const validID = await validateExistingID(authorId);

        if(!validID) throw createError(404, "Authors ID does not exist");
    
        const response = await mongodb.getDatabase().db().collection("Authors").replaceOne({_id: authorId}, author);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        }
    } catch (err) {
        next(err);
    }
};

const deleteAuthors = async (req, res, next) => {
    try {
        //#swagger.tags=['Authors']
        const authorsId = new ObjectId(req.params.id);

        const validID = await validateExistingID(authorsId);
        if(!validID) throw createError(404, "Authors ID does not exist");
        
        const response = await mongodb.getDatabase().db().collection("Authors").deleteOne({_id: authorsId});
        if (response.deletedCount > 0) {
            res.status(204).send();
        }
    } catch (err) {
        next(err);
    }


};


const validateExistingID = async (id) => {
    const authorsID = await mongodb.getDatabase().db().collection("Authors").findOne({_id: id});
    return !!authorsID;
}

module.exports = {
    getAll,
    getSingleById,
    getByQueries,
    addAuthors,
    updateAuthors,
    deleteAuthors
}