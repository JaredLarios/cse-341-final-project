jest.mock('../middlewares/authenticate', () => ({
    isAuthenticated: jest.fn((req, res, next) => next())
}));

const request = require("supertest");
const { app } = require('../server');
const database = require('../data/database')


describe('POST /locals', () => {
    let testDb;
    const localData = {
        name: 'California De Museo',
        address: '12 st 1245 ,San Diego ,CA, 00101',
        booksOnStockIDs: [],
        phone: 123456789
    };

    beforeEach(() => {
        testDb = database.getDatabase().db();
    });

    it('Should not create a local due to bad name', async () => {
        let newLocal = {...localData}
        newLocal.name = ''

        const res = await request(app)
                        .post('/locals')
                        .send(newLocal);
        
        expect(res.statusCode).toBe(422);

        const newLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        expect(newLocalData).toBeNull();
    })

    it('Should not create a local due to missing name', async () => {
        let newLocal = {...localData}
        newLocal.name = null

        const res = await request(app)
                        .post('/locals')
                        .send(newLocal);
        
        expect(res.statusCode).toBe(422);

        const newLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        expect(newLocalData).toBeNull();
    })

    it('Should not create a local due to bad address', async () => {
        let newLocal = {...localData}
        newLocal.address = ''

        const res = await request(app)
                        .post('/locals')
                        .send(newLocal);
        
        expect(res.statusCode).toBe(422);

        const newLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        expect(newLocalData).toBeNull();
    })

    it('Should not create a local due to missing address', async () => {
        let newLocal = {...localData}
        newLocal.address = null

        const res = await request(app)
                        .post('/locals')
                        .send(newLocal);
        
        expect(res.statusCode).toBe(422);

        const newLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        expect(newLocalData).toBeNull();
    })

    it('Should not create a local due to bad phone', async () => {
        let newLocal = {...localData}
        newLocal.phone = false

        const res = await request(app)
                        .post('/locals')
                        .send(newLocal);
        
        expect(res.statusCode).toBe(422);

        const newLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        expect(newLocalData).toBeNull();
    })

    it('Should not create a local due to missing phone', async () => {
        let newLocal = {...localData}
        newLocal.phone = null

        const res = await request(app)
                        .post('/locals')
                        .send(newLocal);
        
        expect(res.statusCode).toBe(422);

        const newLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        expect(newLocalData).toBeNull();
    })

    it('Should create a local', async () => {
        const res = await request(app)
                        .post('/locals')
                        .send(localData);
        
        expect(res.statusCode).toBe(204);

        const newLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        expect(newLocalData).not.toBeNull();
        expect(newLocalData.name).toBe(localData.name);
    })
})

describe('PUT /locals/id', () => {
    let testDb;
    const localData = {
        name: 'California De Museo',
        address: '12 st 1245 ,San Diego ,CA, 00101',
        booksOnStockIDs: [],
        phone: 123456789
    };

    beforeEach(() => {
        testDb = database.getDatabase().db();
    });

    it('Should not create a local due to bad id', async () => {
        const oldLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        const id = oldLocalData._id

        let newLocal = {...localData}
        newLocal.name = ''
        
        const res = await request(app)
                        .put(`/locals/id/${id}ss`)
                        .send(newLocal);
        
        expect(res.statusCode).toBe(422);

        const newLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        expect(newLocalData.name).toBe(oldLocalData.name)
    })

    it('Should not create a local due to bad name', async () => {
        const oldLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        const id = oldLocalData._id

        let newLocal = {...localData}
        newLocal.name = ''
        
        const res = await request(app)
                        .put(`/locals/id/${id}`)
                        .send(newLocal);
        
        expect(res.statusCode).toBe(422);

        const newLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        expect(newLocalData.name).toBe(oldLocalData.name)
    })

    it('Should not create a local due to missing name', async () => {
        const oldLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        const id = oldLocalData._id
        
        let newLocal = {...localData}
        newLocal.name = null

        const res = await request(app)
                        .put(`/locals/id/${id}`)
                        .send(newLocal);
        
        expect(res.statusCode).toBe(422);

        const newLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        expect(newLocalData.name).toBe(oldLocalData.name)
    })

    it('Should not create a local due to bad address', async () => {
        const oldLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        const id = oldLocalData._id

        let newLocal = {...localData}
        newLocal.address = ''

        const res = await request(app)
                        .put(`/locals/id/${id}`)
                        .send(newLocal);
        
        expect(res.statusCode).toBe(422);

        const newLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        expect(newLocalData.address).toBe(oldLocalData.address)
    })

    it('Should not create a local due to missing address', async () => {
        const oldLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        const id = oldLocalData._id
        
        let newLocal = {...localData}
        newLocal.address = null

        const res = await request(app)
                        .put(`/locals/id/${id}`)
                        .send(newLocal);
        
        expect(res.statusCode).toBe(422);

        const newLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        expect(newLocalData.address).toBe(oldLocalData.address)
    })

    it('Should not create a local due to bad phone', async () => {
        const oldLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        const id = oldLocalData._id
        
        let newLocal = {...localData}
        newLocal.phone = false

        const res = await request(app)
                        .put(`/locals/id/${id}`)
                        .send(newLocal);
        
        expect(res.statusCode).toBe(422);

        const newLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        expect(newLocalData.phone).toBe(oldLocalData.phone)
    })

    it('Should not create a local due to missing phone', async () => {
        const oldLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        const id = oldLocalData._id
        
        let newLocal = {...localData}
        newLocal.phone = null

        const res = await request(app)
                        .put(`/locals/id/${id}`)
                        .send(newLocal);
        
        expect(res.statusCode).toBe(422);

        const newLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        expect(newLocalData.phone).toBe(oldLocalData.phone)
    })

    it('Should create a local', async () => {
        const oldLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        const id = oldLocalData._id;

        let newLocal = {...localData}
        newLocal.phone = 3216549870
        
        const res = await request(app)
                        .put(`/locals/id/${id}`)
                        .send(newLocal);
        
        expect(res.statusCode).toBe(204);

        const newLocalData = await testDb.collection('Locals').findOne({ name: localData.name });
        expect(newLocalData).not.toBeNull();
        expect(newLocalData.phone).not.toBe(oldLocalData.phone);
    })
})