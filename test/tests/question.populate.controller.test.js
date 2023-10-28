const request = require('supertest');
const app = require('../index');
const dotenv = require('dotenv');
const Question = require('../models/Question');

dotenv.config();

describe('Populate questions db Endpoint', () => {

    let appServer = {}

    beforeAll(async () => {
        appServer = await app.listen(3001);

        // Wait for database connection to be established before running tests
        await new Promise(r => setTimeout(r, 3000));
    });

    afterAll(async () => {
        await appServer.close();
    })

    it('should return 200 when populates the database', async () => {
        const res = await request(app)
            .post('/questions/populate')

        expect(res.statusCode).toEqual(200);
    })

    it('should return a 200 when checking the health of the endpoint', async () => {
        const res = await request(app)
            .get('/questions/ping');

        expect(res.statusCode).toEqual(200);
    })
});