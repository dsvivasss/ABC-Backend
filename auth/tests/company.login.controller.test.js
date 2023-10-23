const request = require('supertest');
const app = require('../index');
const dotenv = require('dotenv');
const Company = require('../models/Company');

dotenv.config();

describe('Login Company Endpoint', () => {
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
        appServer = await app.listen(3001);

        // Wait for database connection to be established before running tests
        await new Promise(r => setTimeout(r, 3000));

        await request(app)
            .post('/companies/')
            .send(company)
    });

    afterAll(async () => {
        await appServer.close();
    })

    it('should log in a company when correct credentials are provided', async () => {
        const res = await request(app)
            .post('/companies/auth/')
            .send({
                email: company.email,
                password: company.password
            });

        expect(res.statusCode).toEqual(200);
    });

    it('should return a 404 error when incorrect email is provided', async () => {
        const res = await request(app)
            .post('/companies/auth')
            .send({
                email: company.email + 'wrong',
                password: company.password
            });

        expect(res.statusCode).toEqual(404);
    });

    it('should return a 400 when missing required fields', async () => {
        const res = await request(app)
            .post('/companies/auth')
            .send({
                email: company.email,
            });

        expect(res.statusCode).toEqual(400);
    })

    it('should return a 401 when password is incorrect', async () => {
        const res = await request(app)
            .post('/companies/auth')
            .send({
                email: company.email,
                password: company.password + 'wrong'
            });

        expect(res.statusCode).toEqual(401);
    })

    it('should return a 500 error when there is an error during user login', async () => {
        const mockError = new Error('Mock error message');

        // Replace the findOne function with a mock that throws an error
        const originalFindOne = Company.findOne;
        Company.findOne = jest.fn(() => {
            throw mockError;
        });

        // Send a request to the login route
        const response = await request(app)
            .post('/companies/auth')
            .send(company);

        // Restore the original findOne function
        Company.findOne = originalFindOne;

        // Assertions
        expect(response.status).toBe(500); // Check for a 500 status code

    });
});