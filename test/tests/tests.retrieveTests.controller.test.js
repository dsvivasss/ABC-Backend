const request = require('supertest');
const app = require('../index');

describe('Obtain questions Endpoint', () => {

    let appServer = {}

    beforeAll(async () => {
        appServer = await app.listen(3001);

        // Wait for database connection to be established before running tests
        await new Promise(r => setTimeout(r, 3000));
    });

    afterAll(async () => {
        await appServer.close();
    })

    it('should return 200 when retrieving the tests', async () => {
        const res = await request(app)
            .get('/tests/projects/2')

        expect(res.statusCode).toEqual(200);
    })
});