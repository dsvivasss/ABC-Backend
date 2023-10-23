const request = require('supertest');
const app = require('../index');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

describe('Register User Endpoint', () => {
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
        appServer = app.listen(3011);
    });

    afterAll(async () => {
        await appServer.close();
    })

    it('should register a user when valid credentials are provided', async () => {
        const res = await request(app)
            .post('/users/')
            .send(user);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('createdAt');
    });

    it('should return a 400 error when required fields are missing', async () => {
        const res = await request(app)
            .post('/users/')
            .send({
                email: user.email,
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Bad Request: Missing required fields');
    });

    it('should return a 412 error when user already exists with provided email', async () => {
        // create a test user to simulate an existing user with the same email or username
        await request(app)
            .post('/users/')
            .send(user);

        const res = await request(app)
            .post('/users/')
            .send(user);

        expect(res.statusCode).toEqual(412);
        expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should return a 500 error when there is an error during user creation', async () => {
        const mockError = new Error('Mock error message');

        // Replace the findOne function with a mock that throws an error
        const originalFindOne = User.findOne;
        User.findOne = jest.fn(() => {
            throw mockError;
        });

        // Send a request to the login route
        const response = await request(app)
            .post('/users/')
            .send(user);

        // Restore the original findOne function
        User.findOne = originalFindOne;

        // Assertions
        expect(response.status).toBe(500); // Check for a 500 status code

    });
});