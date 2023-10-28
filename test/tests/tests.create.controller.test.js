const request = require('supertest');
const app = require('../index');
const dotenv = require('dotenv');

dotenv.config();

describe('Tests Endpoint', () => {

    const test = {
        "title": "Sample Title",
        "type": "technical", // options: ["technical", "psychology"]
        "project_id": 123,
        "company_id": 456,
        "difficulty_level": "hard", // options: ["basic", "medium", "hard"] 
                                    // if type is psychology can skip it
        "hard_skills": ["oop"], // options: ["python", "javascript", "java", "oop", "product_management"]
                                // if type is psychology can skip it
        "users": [789, 101, 234], // Users IDs attached to this test
        "questions": [567, 890, 1234] // Questions IDs used from database
    }

    let appServer = {}

    beforeAll(async () => {
        appServer = await app.listen(3001);

        // Wait for database connection to be established before running tests
        await new Promise(r => setTimeout(r, 3000));
    });

    afterAll(async () => {
        await appServer.close();
    })

    it('should return 400 when missing parameters', async () => {
        const res = await request(app)
            .post('/tests/')

        expect(res.statusCode).toEqual(400);
    })

    it('should return 200 when populates the database', async () => {
        const res = await request(app)
            .post('/tests/')
            .send(test)

        expect(res.statusCode).toEqual(201);
    })

    it('should return a 200 when checking the health of the endpoint', async () => {
        const res = await request(app)
            .get('/tests/ping');

        expect(res.statusCode).toEqual(200);
    })
});