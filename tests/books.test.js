const request = require("supertest");
const { app } = require('../server');
const database = require('../data/database')
const { ObjectId } = require('mongodb');

describe('POST /books', () => {
    let testDb;
    const bookData = {
        title: 'Dias de Gracias - test',
        releaseDate: '1967-05-30',
        language: 'spa',
        authorId: '6840f2c9a41bbeb60f77d2fb',
        quantity: Number(1),
        available: true
    };

    beforeEach(() => {
        testDb = database.getDatabase().db();
    });

    it('Should create a book', async () => {
        const res = await request(app)
            .post('/books')
            .send(bookData);

        expect(res.statusCode).toBe(201);

        const newBook = await testDb.collection('Books').findOne({ title: bookData.title });
        expect(newBook).not.toBeNull();
        expect(newBook.title).toBe(bookData.title);
    })

    it('Should not craete a book due to undefined title', async () => {
        let newBookData = { ...bookData };
        newBookData.title = ''
        const res = await request(app)
            .post('/books')
            .send(newBookData);

        expect(res.statusCode).toBe(422);

        const newBook = await testDb.collection('Books').findOne({ title: newBookData.title });
        expect(newBook).toBeNull();
        expect(newBook?.title).not.toBe(bookData.title);
    })

    it('Should not craete a book due to bad title', async () => {
        let newBookData = { ...bookData };
        newBookData.title = 'A'
        const res = await request(app)
            .post('/books')
            .send(newBookData);

        expect(res.statusCode).toBe(422);

        const newBook = await testDb.collection('Books').findOne({ title: newBookData.title });
        expect(newBook).toBeNull();
        expect(newBook?.title).not.toBe(bookData.title);
    })

    it('Should not craete a book due to undefined language', async () => {
        let newBookData = { ...bookData };
        newBookData.title = 'Dias de Gracias - test2'
        newBookData.language = null
        const res = await request(app)
            .post('/books')
            .send(newBookData);

        expect(res.statusCode).toBe(422);

        const newBook = await testDb.collection('Books').findOne({ title: newBookData.title });
        expect(newBook).toBeNull();
        expect(newBook?.title).not.toBe(bookData.title);
    })

    it('Should not craete a book due to undefined authorId', async () => {
        let newBookData = { ...bookData };
        newBookData.title = 'Dias de Gracias - test2'
        newBookData.authorId = null
        const res = await request(app)
            .post('/books')
            .send(newBookData);

        expect(res.statusCode).toBe(422);

        const newBook = await testDb.collection('Books').findOne({ title: newBookData.title });
        expect(newBook).toBeNull();
        expect(newBook?.title).not.toBe(bookData.title);
    })

    it('Should not craete a book due to bad authorId', async () => {
        let newBookData = { ...bookData };
        newBookData.title = 'Dias de Gracias - test2'
        newBookData.authorId = '123'
        const res = await request(app)
            .post('/books')
            .send(newBookData);

        expect(res.statusCode).toBe(422);

        const newBook = await testDb.collection('Books').findOne({ title: newBookData.title });
        expect(newBook).toBeNull();
        expect(newBook?.title).not.toBe(bookData.title);
    })

    it('Should not craete a book due to undefined quantity', async () => {
        let newBookData = { ...bookData };
        newBookData.title = 'Dias de Gracias - test2'
        newBookData.quantity = null
        const res = await request(app)
            .post('/books')
            .send(newBookData);

        expect(res.statusCode).toBe(422);

        const newBook = await testDb.collection('Books').findOne({ title: newBookData.title });
        expect(newBook).toBeNull();
        expect(newBook?.title).not.toBe(bookData.title);
    })

    it('Should not craete a book due to bad quantity', async () => {
        let newBookData = { ...bookData };
        newBookData.title = 'Dias de Gracias - test2'
        newBookData.quantity = '15s'
        const res = await request(app)
            .post('/books')
            .send(newBookData);

        expect(res.statusCode).toBe(422);

        const newBook = await testDb.collection('Books').findOne({ title: newBookData.title });
        expect(newBook).toBeNull();
        expect(newBook?.title).not.toBe(bookData.title);
    })

    it('Should not craete a book due to undefined available', async () => {
        let newBookData = { ...bookData };
        newBookData.title = 'Dias de Gracias - test2'
        newBookData.available = null
        const res = await request(app)
            .post('/books')
            .send(newBookData);

        expect(res.statusCode).toBe(422);

        const newBook = await testDb.collection('Books').findOne({ title: newBookData.title });
        expect(newBook).toBeNull();
        expect(newBook?.title).not.toBe(bookData.title);
    })

    it('Should not craete a book due to bad available', async () => {
        let newBookData = { ...bookData };
        newBookData.title = 'Dias de Gracias - test2'
        newBookData.available = 'yes'
        const res = await request(app)
            .post('/books')
            .send(newBookData);

        expect(res.statusCode).toBe(422);

        const newBook = await testDb.collection('Books').findOne({ title: newBookData.title });
        expect(newBook).toBeNull();
        expect(newBook?.title).not.toBe(bookData.title);
    })
})

describe('GET /books, /books/id, books/search', () => {
    let testDb;
    const bookData = {
        title: 'Dias de Gracias - test',
        releaseDate: '1967-05-30',
        language: 'spa',
        authorId: '6840f2c9a41bbeb60f77d2fb',
        quantity: "1",
        available: true
    };

    beforeEach(() => {
        testDb = database.getDatabase().db();
    });

    it('Should fidn all books', async () => {
        const response = await request(app)
            .get(`/books/`);

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);
    })

    it('Should find only one by ID book', async () => {
        const book = await testDb.collection('Books').findOne({title: bookData.title})
        const id = book._id;
        const response = await request(app)
            .get(`/books/id/${id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            title: bookData.title,
            releaseDate: bookData.releaseDate,
            language: bookData.language,
            quantity: bookData.quantity,
            available: bookData.available
        });
    })

    it('Should not find only one by ID book', async () => {
        const book = await testDb.collection('Books').findOne({title: bookData.title})
        const id = book._id;
        const response = await request(app)
            .get(`/books/id/${id}ss`);

        expect(response.statusCode).toBe(422);
    })

    it('Should fin by query some books', async () => {
        const res = await request(app)
            .get(`/books/search?title=${bookData.title}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    })

    it('Should create a book', async () => {
        const res = await request(app)
            .get(`/books/search?title=`);

        expect(res.statusCode).toBe(422);
    })
})

describe('PUT /books/id', () => {
    let testDb;
    const bookData = {
        title: 'Dias de Gracias - test',
        releaseDate: '1967-05-30',
        language: 'spa',
        authorId: '6840f2c9a41bbeb60f77d2fb',
        quantity: "2",
        available: true
    };

    beforeEach(() => {
        testDb = database.getDatabase().db();
    });

    it('Should update book', async () => {
        const responseDB = await testDb.collection('Books').findOne({title: bookData.title})
        const id = responseDB._id;

        const response = await request(app)
            .put(`/books/id/${id}`).send(bookData);
        
        expect(response.statusCode).toBe(204);

        const updateDB = await testDb.collection('Books').findOne({title: bookData.title})
        expect(responseDB.quantity).not.toBe(updateDB.quantity)
    })

    it('Should not update book due to bad id', async () => {
        const responseDB = await testDb.collection('Books').findOne({title: bookData.title})
        const id = responseDB._id;

        const response = await request(app)
            .put(`/books/id/${id}ss`).send(bookData);
        
        expect(response.statusCode).toBe(422);
    })

    it('Should update book due to bad title', async () => {
        let updateBookData = { ...bookData };
        updateBookData.title = ''

        const responseDB = await testDb.collection('Books').findOne({title: bookData.title})
        const id = responseDB._id;

        const response = await request(app)
            .put(`/books/id/${id}`).send(updateBookData);

        expect(response.statusCode).toBe(422);
        const updateDB = await testDb.collection('Books').findOne({title: bookData.title})
        expect(responseDB.title).toBe(updateDB.title)
    })

    it('Should update book due to missing title', async () => {
        let updateBookData = { ...bookData };
        updateBookData.title = null

        const responseDB = await testDb.collection('Books').findOne({title: bookData.title})
        const id = responseDB._id;

        const response = await request(app)
            .put(`/books/id/${id}`).send(updateBookData);

        expect(response.statusCode).toBe(422);
        const updateDB = await testDb.collection('Books').findOne({title: bookData.title})
        expect(responseDB.title).toBe(updateDB.title)
    })

    it('Should update book due to missing release date', async () => {
        let updateBookData = { ...bookData };
        updateBookData.releaseDate = ''

        const responseDB = await testDb.collection('Books').findOne({title: bookData.title})
        const id = responseDB._id;

        const response = await request(app)
            .put(`/books/id/${id}`).send(updateBookData);

        expect(response.statusCode).toBe(422);
        const updateDB = await testDb.collection('Books').findOne({title: bookData.title})
        expect(responseDB.title).toBe(updateDB.title)
    })

    it('Should update book due to missing release date', async () => {
        let updateBookData = { ...bookData };
        updateBookData.releaseDate = null

        const responseDB = await testDb.collection('Books').findOne({title: bookData.title})
        const id = responseDB._id;

        const response = await request(app)
            .put(`/books/id/${id}`).send(updateBookData);

        expect(response.statusCode).toBe(422);
        const updateDB = await testDb.collection('Books').findOne({title: bookData.title})
        expect(responseDB.releaseDate).toBe(updateDB.releaseDate)
    })

    it('Should update book due to missing language', async () => {
        let updateBookData = { ...bookData };
        updateBookData.language = ''

        const responseDB = await testDb.collection('Books').findOne({title: bookData.title})
        const id = responseDB._id;

        const response = await request(app)
            .put(`/books/id/${id}`).send(updateBookData);

        expect(response.statusCode).toBe(422);
        const updateDB = await testDb.collection('Books').findOne({title: bookData.title})
        expect(responseDB.title).toBe(updateDB.title)
    })

    it('Should update book due to missing language', async () => {
        let updateBookData = { ...bookData };
        updateBookData.language = null

        const responseDB = await testDb.collection('Books').findOne({title: bookData.title})
        const id = responseDB._id;

        const response = await request(app)
            .put(`/books/id/${id}`).send(updateBookData);

        expect(response.statusCode).toBe(422);
        const updateDB = await testDb.collection('Books').findOne({title: bookData.title})
        expect(responseDB.language).toBe(updateDB.language)
    })

    it('Should update book due to missing authorId', async () => {
        let updateBookData = { ...bookData };
        updateBookData.authorId = ''

        const responseDB = await testDb.collection('Books').findOne({title: bookData.title})
        const id = responseDB._id;

        const response = await request(app)
            .put(`/books/id/${id}`).send(updateBookData);

        expect(response.statusCode).toBe(422);
        const updateDB = await testDb.collection('Books').findOne({title: bookData.title})
        expect(responseDB.title).toBe(updateDB.title)
    })

    it('Should update book due to missing authorId', async () => {
        let updateBookData = { ...bookData };
        updateBookData.authorId = null

        const responseDB = await testDb.collection('Books').findOne({title: bookData.title})
        const id = responseDB._id;

        const response = await request(app)
            .put(`/books/id/${id}`).send(updateBookData);

        expect(response.statusCode).toBe(422);
        const updateDB = await testDb.collection('Books').findOne({title: bookData.title})
        expect(responseDB.authorId).toBe(updateDB.authorId)
    })

    it('Should update book due to missing quantity', async () => {
        let updateBookData = { ...bookData };
        updateBookData.quantity = ''

        const responseDB = await testDb.collection('Books').findOne({title: bookData.title})
        const id = responseDB._id;

        const response = await request(app)
            .put(`/books/id/${id}`).send(updateBookData);

        expect(response.statusCode).toBe(422);
        const updateDB = await testDb.collection('Books').findOne({title: bookData.title})
        expect(responseDB.title).toBe(updateDB.title)
    })

    it('Should update book due to missing quantity', async () => {
        let updateBookData = { ...bookData };
        updateBookData.quantity = null

        const responseDB = await testDb.collection('Books').findOne({title: bookData.title})
        const id = responseDB._id;

        const response = await request(app)
            .put(`/books/id/${id}`).send(updateBookData);

        expect(response.statusCode).toBe(422);
        const updateDB = await testDb.collection('Books').findOne({title: bookData.title})
        expect(responseDB.quantity).toBe(updateDB.quantity)
    })

    it('Should update book due to missing available', async () => {
        let updateBookData = { ...bookData };
        updateBookData.available = ''

        const responseDB = await testDb.collection('Books').findOne({title: bookData.title})
        const id = responseDB._id;

        const response = await request(app)
            .put(`/books/id/${id}`).send(updateBookData);

        expect(response.statusCode).toBe(422);
        const updateDB = await testDb.collection('Books').findOne({title: bookData.title})
        expect(responseDB.title).toBe(updateDB.title)
    })

    it('Should update book due to missing available', async () => {
        let updateBookData = { ...bookData };
        updateBookData.available = null

        const responseDB = await testDb.collection('Books').findOne({title: bookData.title})
        const id = responseDB._id;
        
        const response = await request(app)
            .put(`/books/id/${id}`).send(updateBookData);

        expect(response.statusCode).toBe(422);
        const updateDB = await testDb.collection('Books').findOne({title: bookData.title})
        expect(responseDB.available).toBe(updateDB.available)
    })
})

describe('DELETE /books/id', () => {
    let testDb;
    const bookData = {
        title: 'Dias de Gracias - test',
        releaseDate: '1967-05-30',
        language: 'spa',
        authorId: '6840f2c9a41bbeb60f77d2fb',
        quantity: "2",
        available: true
    };

    beforeEach(() => {
        testDb = database.getDatabase().db();
    });

    it('Should not delete book', async () => {
        const responseDB = await testDb.collection('Books').findOne({title: bookData.title})
        const id = responseDB._id;

        const response = await request(app)
            .delete(`/books/id/${id}ss`);

        expect(response.statusCode).toBe(422);
        const updateDB = await testDb.collection('Books').findOne({title: bookData.title})
        expect(updateDB).not.toBeNull();
    })

    it('Should delete book', async () => {
        const responseDB = await testDb.collection('Books').findOne({title: bookData.title})
        const id = responseDB._id;

        const response = await request(app)
            .delete(`/books/id/${id}`);

        expect(response.statusCode).toBe(204);
        const updateDB = await testDb.collection('Books').findOne({title: bookData.title})
        expect(updateDB).toBeNull();
    })
})