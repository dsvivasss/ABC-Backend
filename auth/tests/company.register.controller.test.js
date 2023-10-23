const request = require('supertest');
const app = require('../index');
const dotenv = require('dotenv');
const Company = require('../models/Company');

dotenv.config();

describe('Register Company Endpoint', () => {
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

    beforeAll(async () => {
        appServer = app.listen(3011);
        
        // Wait for database connection to be established before running tests
        await new Promise(r => setTimeout(r, 3000));

    });

    afterAll(async () => {
        await appServer.close();
    })

    it('should register a company when valid credentials are provided', async () => {
        const res = await request(app)
            .post('/companies/')
            .send(company);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('createdAt');
    });

    it('should return a 400 error when required fields are missing', async () => {
        const res = await request(app)
            .post('/companies/')
            .send({
                email: company.email,
                email: company.email,
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Bad Request: Missing required fields');
    });

    it('should return a 412 error when user already exists with provided name or email', async () => {
        // create a test user to simulate an existing user with the same email or name
        await request(app)
            .post('/companies/')
            .send(company);

        const res = await request(app)
            .post('/companies/')
            .send(company);

        expect(res.statusCode).toEqual(412);
        expect(res.body).toHaveProperty('message', 'Company already exists');
    });

    it('should return a 500 error when there is an error during company creation', async () => {
        const mockError = new Error('Mock error message');

        // Replace the findOne function with a mock that throws an error
        const originalFindOne = Company.findOne;
        Company.findOne = jest.fn(() => {
            throw mockError;
        });

        // Send a request to the login route
        const response = await request(app)
            .post('/companies/')
            .send(company);

        // Restore the original findOne function
        Company.findOne = originalFindOne;

        // Assertions
        expect(response.status).toBe(500); // Check for a 500 status code

    });
});