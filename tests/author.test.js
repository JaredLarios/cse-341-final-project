const request = require("supertest");
const { app } = require('../server');
const database = require('../data/database')
const { ObjectId } = require('mongodb');

describe('POST /books', () => {
    let testDb;
    const authorData = {
        name: 'Author',
        lastname: 'Phanton',
        dateOfBirth: '2000-01-01',
        country: 'Spain',
        gender: 'Male',
        biography: 'This is a test',
        alive: true
    };
    
    beforeEach(() => {
        testDb = database.getDatabase().db();
    });

    it('Should create Author', async () => {
        const response = await request(app)
                    .post('/author')
                    .send(authorData);

        expect(response.statusCode).toBe(204);

        const newAuthor = await testDb.collection('Authors').findOne({ name: authorData.name });
        expect(newAuthor).not.toBeNull();
        expect(newAuthor.lastname).toBe(authorData.lastname);
    })

    it('Should not create Author due missing name', async () => {
        let newAuthorData = { ...authorData };
        newAuthorData.name = null
        const response = await request(app)
                    .post('/author')
                    .send(newAuthorData);

        expect(response.statusCode).toBe(422);
    })

    it('Should not create Author due missing lastname', async () => {
        let newAuthorData = { ...authorData };
        newAuthorData.lastname = null
        const response = await request(app)
                    .post('/author')
                    .send(newAuthorData);

        expect(response.statusCode).toBe(422);
    })

    it('Should not create Author due missing DOB', async () => {
        let newAuthorData = { ...authorData };
        newAuthorData.dateOfBirth = null
        const response = await request(app)
                    .post('/author')
                    .send(newAuthorData);

        expect(response.statusCode).toBe(422);
    })

    it('Should not create Author due missing gender', async () => {
        let newAuthorData = { ...authorData };
        newAuthorData.gender = null
        const response = await request(app)
                    .post('/author')
                    .send(newAuthorData);

        expect(response.statusCode).toBe(422);
    })

    it('Should not create Author due missing biography', async () => {
        let newAuthorData = { ...authorData };
        newAuthorData.biography = null
        const response = await request(app)
                    .post('/author')
                    .send(newAuthorData);

        expect(response.statusCode).toBe(422);
    })

    it('Should not create Author due missing alive', async () => {
        let newAuthorData = { ...authorData };
        newAuthorData.alive = null
        const response = await request(app)
                    .post('/author')
                    .send(newAuthorData);

        expect(response.statusCode).toBe(422);
    })
    it('Should not create Author due missing alive', async () => {
        let newAuthorData = { ...authorData };
        newAuthorData.alive = 'yes'
        const response = await request(app)
                    .post('/author')
                    .send(newAuthorData);

        expect(response.statusCode).toBe(422);
    })
})