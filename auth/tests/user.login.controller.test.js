const request = require('supertest');
const app = require('../index');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

describe('Login User Endpoint', () => {
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

    beforeAll(async () => {
        appServer = await app.listen(3010);
        await request(app)
            .post('/users/')
            .send(user)
    });

    afterAll(async () => {
        await appServer.close();
    })

    it('should log in a user when correct credentials are provided', async () => {
        const res = await request(app)
            .post('/users/auth/')
            .send({
                email: user.email,
                password: user.password
            });

        expect(res.statusCode).toEqual(200);
    });

    it('should return a 404 error when incorrect email is provided', async () => {
        const res = await request(app)
            .post('/users/auth')
            .send({
                email: user.email + 'wrong',
                password: user.password
            });

        expect(res.statusCode).toEqual(404);
    });

    it('should return a 400 when missing required fields', async () => {
        const res = await request(app)
            .post('/users/auth')
            .send({
                email: user.email,
            });

        expect(res.statusCode).toEqual(400);
    })

    it ('should return a 401 when password is incorrect', async () => {
        const res = await request(app)
            .post('/users/auth')
            .send({
                email: user.email,
                password: user.password + 'wrong'
            });

        expect(res.statusCode).toEqual(401);
    })

    it('should return a 500 error when there is an error during user login', async () => {
        const mockError = new Error('Mock error message');

        // Replace the findOne function with a mock that throws an error
        const originalFindOne = User.findOne;
        User.findOne = jest.fn(() => {
            throw mockError;
        });

        // Send a request to the login route
        const response = await request(app)
            .post('/users/auth')
            .send(user);

        // Restore the original findOne function
        User.findOne = originalFindOne;

        // Assertions
        expect(response.status).toBe(500); // Check for a 500 status code

    });
});