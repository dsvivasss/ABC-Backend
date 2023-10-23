const request = require('supertest');
const app = require('../index');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

describe('Login User Endpoint', () => {
    const user = {
        username: 'testuser',
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

    it('Dummy test', async () => {
        expect(1).toEqual(1);
    });
});