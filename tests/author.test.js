jest.mock('../middlewares/authenticate', () => ({
    isAuthenticated: jest.fn(() => (req, res, next) => next())
}));


const request = require("supertest");
const { app } = require('../server');
const database = require('../data/database')
const { ObjectId } = require('mongodb');

describe('POST /author', () => {
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

describe('GET /author, /author/id, /author/search', () => {
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

    it('Should get a list of Authors', async () => {
        const authorsList = await testDb.collection('Authors').find().toArray();

        const response = await request(app).get('/author');

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(authorsList.length);
    })

    it('Should get an Author by id', async () => {
        const responseDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});
        const id = responseDB._id

        const response = await request(app).get(`/author/id/${id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.dateOfBirth).toBe(responseDB.dateOfBirth);
    })

    it('Should not get an Author by id', async () => {
        const responseDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});
        const id = responseDB._id

        const response = await request(app).get(`/author/id/${id}ss`);

        expect(response.statusCode).toBe(422);
    })

    it('Should get an Author by query', async () => {
        const responseDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        const response = await request(app)
            .get(`/author/search?name=${authorData.name}&lastname=${authorData.lastname}`);

        expect(response.statusCode).toBe(200);
        expect(response.body[0].dateOfBirth).toBe(responseDB.dateOfBirth);
    })

    it('Should get an Author by query', async () => {
        const responseDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        const response = await request(app)
            .get(`/author/search?name=${authorData.name}`);

        expect(response.statusCode).toBe(200);
        expect(response.body[0].dateOfBirth).toBe(responseDB.dateOfBirth);
    })

    it('Should not get an Author by query', async () => {
        const responseDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        const response = await request(app)
            .get(`/author/search?lastname=${authorData.name}`);

        expect(response.statusCode).toBe(422);
    })
})

describe('PUT /author', () => {
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

    it('Should update Authors', async () => {
        const authorDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});
        const id = authorDB._id

        let updateAuthor = {...authorData};
        updateAuthor.alive = false;

        const response = await request(app).put(`/author/id/${id}`).send(updateAuthor);

        const authorDBUpdate = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        expect(response.statusCode).toBe(204);
        expect(authorDB.alive).not.toBe(authorDBUpdate.alive);
        expect(authorDBUpdate.alive).toBe(false);
    })

    it('Should not update Authors due to bad id', async () => {
        const authorDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});
        const id = authorDB._id

        let updateAuthor = {...authorData};
        updateAuthor.alive = false;

        const response = await request(app).put(`/author/id/${id}ss`).send(updateAuthor);

        const authorDBUpdate = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        expect(response.statusCode).toBe(422);
        expect(authorDB.name).toBe(authorDBUpdate.name);
    })

    it('Should not update Authors due to bad name', async () => {
        const authorDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});
        const id = authorDB._id

        let updateAuthor = {...authorData};
        updateAuthor.name = '';

        const response = await request(app).put(`/author/id/${id}`).send(updateAuthor);

        const authorDBUpdate = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        expect(response.statusCode).toBe(422);
        expect(authorDB.name).toBe(authorDBUpdate.name);
    })

    it('Should not update Authors due to missing name', async () => {
        const authorDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});
        const id = authorDB._id

        let updateAuthor = {...authorData};
        updateAuthor.name = null;

        const response = await request(app).put(`/author/id/${id}`).send(updateAuthor);

        const authorDBUpdate = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        expect(response.statusCode).toBe(422);
        expect(authorDB.name).toBe(authorDBUpdate.name);
    })

    it('Should not update Authors due to bad lasname', async () => {
        const authorDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});
        const id = authorDB._id

        let updateAuthor = {...authorData};
        updateAuthor.lastname = '';

        const response = await request(app).put(`/author/id/${id}`).send(updateAuthor);

        const authorDBUpdate = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        expect(response.statusCode).toBe(422);
        expect(authorDB.lastname).toBe(authorDBUpdate.lastname);
    })

    it('Should not update Authors due to missing lasname', async () => {
        const authorDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        const id = authorDB._id

        let updateAuthor = {...authorData};
        updateAuthor.lastname = null;

        const response = await request(app).put(`/author/id/${id}`).send(updateAuthor);

        const authorDBUpdate = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        expect(response.statusCode).toBe(422);
        expect(authorDB.lastname).toBe(authorDBUpdate.lastname);
    })

    it('Should not update Authors due to bad dateOfBirth', async () => {
        const authorDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        const id = authorDB._id

        let updateAuthor = {...authorData};
        updateAuthor.dateOfBirth = '';

        const response = await request(app).put(`/author/id/${id}`).send(updateAuthor);

        const authorDBUpdate = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        expect(response.statusCode).toBe(422);
        expect(authorDB.dateOfBirth).toBe(authorDBUpdate.dateOfBirth);
    })

    it('Should not update Authors due to missing dateOfBirth', async () => {
        const authorDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        const id = authorDB._id

        let updateAuthor = {...authorData};
        updateAuthor.dateOfBirth = null;

        const response = await request(app).put(`/author/id/${id}`).send(updateAuthor);

        const authorDBUpdate = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        expect(response.statusCode).toBe(422);
        expect(authorDB.dateOfBirth).toBe(authorDBUpdate.dateOfBirth);
    })

    it('Should not update Authors due to bad country', async () => {
        const authorDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        const id = authorDB._id

        let updateAuthor = {...authorData};
        updateAuthor.country = '';

        const response = await request(app).put(`/author/id/${id}`).send(updateAuthor);

        const authorDBUpdate = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        expect(response.statusCode).toBe(422);
        expect(authorDB.country).toBe(authorDBUpdate.country);
    })

    it('Should not update Authors due to missing country', async () => {
        const authorDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        const id = authorDB._id

        let updateAuthor = {...authorData};
        updateAuthor.country = null;

        const response = await request(app).put(`/author/id/${id}`).send(updateAuthor);

        const authorDBUpdate = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        expect(response.statusCode).toBe(422);
        expect(authorDB.country).toBe(authorDBUpdate.country);
    })

    it('Should not update Authors due to bad gender', async () => {
        const authorDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        const id = authorDB._id

        let updateAuthor = {...authorData};
        updateAuthor.gender = '';

        const response = await request(app).put(`/author/id/${id}`).send(updateAuthor);

        const authorDBUpdate = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        expect(response.statusCode).toBe(422);
        expect(authorDB.gender).toBe(authorDBUpdate.gender);
    })

    it('Should not update Authors due to missing gender', async () => {
        const authorDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        const id = authorDB._id

        let updateAuthor = {...authorData};
        updateAuthor.gender = null;

        const response = await request(app).put(`/author/id/${id}`).send(updateAuthor);

        const authorDBUpdate = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        expect(response.statusCode).toBe(422);
        expect(authorDB.gender).toBe(authorDBUpdate.gender);
    })

    it('Should not update Authors due to bad biography', async () => {
        const authorDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        const id = authorDB._id

        let updateAuthor = {...authorData};
        updateAuthor.biography = '';

        const response = await request(app).put(`/author/id/${id}`).send(updateAuthor);

        const authorDBUpdate = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        expect(response.statusCode).toBe(422);
        expect(authorDB.biography).toBe(authorDBUpdate.biography);
    })

    it('Should not update Authors due to missing biography', async () => {
        const authorDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        const id = authorDB._id

        let updateAuthor = {...authorData};
        updateAuthor.biography = '';

        const response = await request(app).put(`/author/id/${id}`).send(updateAuthor);

        const authorDBUpdate = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        expect(response.statusCode).toBe(422);
        expect(authorDB.biography).toBe(authorDBUpdate.biography);
    })

    it('Should not update Authors due to bad alive', async () => {
        const authorDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        const id = authorDB._id

        let updateAuthor = {...authorData};
        updateAuthor.alive = 'yes';

        const response = await request(app).put(`/author/id/${id}`).send(updateAuthor);

        const authorDBUpdate = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        expect(response.statusCode).toBe(422);
        expect(authorDB.alive).toBe(authorDBUpdate.alive);
    })

    it('Should not update Authors due to missing alive', async () => {
        const authorDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        const id = authorDB._id

        let updateAuthor = {...authorData};
        updateAuthor.alive = null;

        const response = await request(app).put(`/author/id/${id}`).send(updateAuthor);

        const authorDBUpdate = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname});

        expect(response.statusCode).toBe(422);
        expect(authorDB.alive).toBe(authorDBUpdate.alive);
    })
})

describe('DELETE /author/id', () => {
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

    it('Should not delete author', async () => {
        const responseDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname})
        const id = responseDB._id;

        const response = await request(app)
            .delete(`/author/id/${id}ss`);

        expect(response.statusCode).toBe(422);
        const updateDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname})
        expect(updateDB).not.toBeNull();
    })

    it('Should delete author', async () => {
        const responseDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname})
        const id = responseDB._id;

        const response = await request(app)
            .delete(`/author/id/${id}`);

        expect(response.statusCode).toBe(204);
        const updateDB = await testDb
            .collection('Authors')
            .findOne({name: authorData.name, lastname: authorData.lastname})
        expect(updateDB).toBeNull();
    })
})