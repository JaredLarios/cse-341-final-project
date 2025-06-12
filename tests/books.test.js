const request = require('supertest')
const { app } = require('../server');
const { getTestDb } = require('./setup')

describe('POST /books', () => {
    let testDb;
    const bookData = {
        title: 'Dias de Gracias - test',
        releaseDate: '1967-05-30',
        language: 'spa',
        authorId: '6840f2c9a41bbeb60f77d2fb',
        quantity: 1,
        available: true
    };

    beforeEach(() => {
        testDb = getTestDb();
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