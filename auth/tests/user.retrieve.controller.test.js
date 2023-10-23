const request = require('supertest');
const app = require('../index');
const User = require('../models/User');

describe('Retrieve User Endpoint', () => {

    const user = {
        name: 'Daniel Suarez',
        email: 'test@email.com',
        password: 'testpassword',
        salt: 'testsalt',
        language: 'es',
        phone: '1234567890',
        country: 'Colombia',
        skills: ['testskill1', 'testskill2'],
        personality: ['testpersonality1', 'testpersonality2']
    }

    let appServer = {}
    let token = '';

    beforeAll(async () => {
        appServer = app.listen(3012);
        await request(app)
            .post('/users/')
            .send(user)

        const res = await request(app)
            .post('/users/auth/')
            .send({
                email: user.email,
                password: user.password
            });

        token = res.body.token;
    })

    afterAll(async () => {
        await appServer.close();
    })

    it('should return a 200 when user is found', async () => {
        // Send the token in the headers
        const res = await request(app)
            .get('/users/me/')
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200);
    });

    it('should return a 500 error when there is an error during user retrieve', async () => {
        const mockError = new Error('Mock error message');

        // Replace the findOne function with a mock that throws an error
        const originalFindOne = User.findOne;
        User.findOne = jest.fn(() => {
            throw mockError;
        });

        // Send a request to the login route
        const response = await request(app)
            .get('/users/me/')
            .set('Authorization', 'Bearer ' + token);

        // Restore the original findOne function
        User.findOne = originalFindOne;

        // Assertions
        expect(response.status).toBe(500); // Check for a 500 status code

    });

    it('should return 200 in the health check', async () => {
        const res = await request(app)
            .get('/users/ping/');

        expect(res.statusCode).toEqual(200);
    })

});