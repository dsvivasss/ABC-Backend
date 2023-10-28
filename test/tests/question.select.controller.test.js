const request = require('supertest');
const app = require('../index');
const dotenv = require('dotenv');
const Question = require('../models/Question');

dotenv.config();

describe('Obtain questions Endpoint', () => {

    const questions_filter = {
        "topics": ["oop", "python", "product_management"], // options: ["python", "javascript", "java", "oop", "product_management"]
        "difficulty_level": "hard", // options: ["basic", "medium", "hard"]
        "question_type": "multiple_choice",
        "options": { // Optional field
            "return_answers": true // Default is false
        }
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
            .post('/questions/')

        expect(res.statusCode).toEqual(400);
    })

    it('should return 200 when populates the database', async () => {
        const res = await request(app)
            .post('/questions/')
            .send(questions_filter)

        expect(res.statusCode).toEqual(200);
    })
});