const createError = require('http-errors');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const authorLookup = {
    $lookup: {
        from: "Authors",
        localField: "books.authorId",
        foreignField: "_id",
        as: "authors"
    }
}

const booksLookup = {
    $lookup: {
        from: "Books",
        localField: "booksOnStockIDs",
        foreignField: "_id",
        as: "books"
    }
}

const aggregateSetting = {
    $project: {
        name: 1,
        address: 1,
        phone: 1,
        books: {
        $map: {
            input: "$books",
            as: "book",
            in: {
            title: "$$book.title",
            releaseDate: "$$book.releaseDate",
            author: {
                $first: {
                $map: {
                    input: {
                    $filter: {
                        input: "$authors",
                        as: "author",
                        cond: { $eq: ["$$author._id", "$$book.authorId"] }
                    }
                    },
                    as: "matchedAuthor",
                    in: {
                    name: "$$matchedAuthor.name",
                    lastname: "$$matchedAuthor.lastname"
                    }
                }
                }
            }
            }
        }
        }
    }
}


const getAll = async (req, res, next) => {
    try {
        //#swagger.tags=['Locals']
        const response = await mongodb
                                    .getDatabase()
                                    .db()
                                    .collection("Locals")
                                    .aggregate([
                                        booksLookup,
                                        authorLookup,
                                        aggregateSetting
                                    ]);
        
        if(!response) throw createError(404, "Not Actors found");

        response.toArray().then((local) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(local);
        })
    } catch (err) {
        next(err);
    }
};

const getSingleById = async (req, res, next) => {
    try {
        //#swagger.tags=['Locals']
        const localId = new ObjectId(req.params.id);
        
        const validID = await validateExistingID(localId);
        if(!validID) throw createError(404, "Actors ID does not exist");

        const response = await mongodb
                                    .getDatabase()
                                    .db()
                                    .collection("Locals")
                                    .aggregate([
                                        { $match: {_id: localId} },
                                        booksLookup,
                                        authorLookup,
                                        aggregateSetting
                                    ]).toArray();
        
        res.status(200).json(response[0]);
    } catch (err) {
        next(err);
    }
}

const getByQueries = async (req, res, next) => {
    try {
        //#swagger.tags=['Locals']
        const localName = String(req.query.name);
        const response = await mongodb
                                    .getDatabase()
                                    .db()
                                    .collection("Locals")
                                    .aggregate([
                                        {
                                            $match: { 
                                                name: { $regex: localName, $options: 'i' }
                                            }
                                        },
                                        booksLookup,
                                        authorLookup,
                                        aggregateSetting
                                    ]).toArray();

        if(!response) throw createError(404, "Actors Name does not exist");
        
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

const addLocals = async (req, res, next) => {
    //#swagger.tags=['Locals']
    const local = {
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    booksOnStockIDs: req.body.books?.map(bookId => (
        new ObjectId(bookId)
    ))  ?? []
    }
    const response = await mongodb.getDatabase().db().collection("Locals").insertOne(local);
    if (response.acknowledged) {
        return res.status(204).send();
    } else {
        res.status(500).json(response.error || "Some error occurred while adding the local.")
    }
}

const updateLocals = async (req, res, next) => {
    //#swagger.tags=['Locals']
    try {
        const localId = new ObjectId(req.params.id);
        const local = {
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            booksOnStockIDs: req.body.books?.map(bookId => (
                new ObjectId(bookId)
            ))  ?? []
        }

        const validID = await validateExistingID(localId);

        if(!validID) throw createError(404, "Locals ID does not exist");
    
        const response = await mongodb.getDatabase().db().collection("Locals").replaceOne({_id: localId}, local);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        }
    } catch (err) {
        next(err);
    }
};

const deleteLocals = async (req, res, next) => {
    try {
        //#swagger.tags=['Locals']
        const localId = new ObjectId(req.params.id);

        const validID = await validateExistingID(localId);
        if(!validID) throw createError(404, "Locals ID does not exist");
        
        const response = await mongodb.getDatabase().db().collection("Locals").deleteOne({_id: localId});
        if (response.deletedCount > 0) {
            res.status(204).send();
        }
    } catch (err) {
        next(err);
    }


};


const validateExistingID = async (id) => {
    const localsID = await mongodb.getDatabase().db().collection("Locals").findOne({_id: id});
    return !!localsID;
}

module.exports = {
    getAll,
    getSingleById,
    getByQueries,
    addLocals,
    updateLocals,
    deleteLocals
}