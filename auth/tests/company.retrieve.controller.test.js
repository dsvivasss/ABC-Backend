const request = require('supertest');
const app = require('../index');
const Company = require('../models/Company');

describe('Retrieve Company Endpoint', () => {

    const company = {
        name: 'test company',
        email: 'company@email.com',
        password: 'testpassword',
        salt: 'testsalt',
        size: '[5 - 10]',
        location: 'Colombia',
        website: 'www.company1.com',
        sector: 'construction'
    }

    let appServer = {}
    let token = '';

    beforeAll(async () => {
        appServer = app.listen(3013);

        // Wait for database connection to be established before running tests
        await new Promise(r => setTimeout(r, 3000));

        await request(app)
            .post('/companies/')
            .send(company)

        const res = await request(app)
            .post('/companies/auth/')
            .send({
                email: company.email,
                password: company.password
            });

        token = res.body.token;
    }, 10000)

    afterAll(async () => {
        await appServer.close();
    })

    it('should return a 200 when company is found', async () => {
        // Send the token in the headers
        const res = await request(app)
            .get('/companies/me/')
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200);
    });

    it('should return 200 in the health check', async () => {
        const res = await request(app)
            .get('/companies/ping/');

        expect(res.statusCode).toEqual(200);
    })

});