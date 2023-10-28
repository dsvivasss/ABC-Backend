const request = require('supertest');
const app = require('../index');

describe('Retrieve User Endpoint', () => {

    const user = {
        name: 'Daniel Suarez',
        email: 'test@email.com',
        password: 'testpassword',
        salt: 'testsalt',
        language: 'es',
        phone: '1234567890',
        country: 'Colombia',
        skills: ['skill', 'testskill2'],
        personality: ['pers', 'testpersonality2']
    }

    let appServer = {}

    beforeAll(async () => {
        appServer = app.listen(3012);
        await request(app)
            .post('/users/')
            .send(user)

        await request(app)
            .post('/users/auth/')
            .send({
                email: user.email,
                password: user.password
            });

        await new Promise(r => setTimeout(r, 3000));
    }, 10000)

    afterAll(async () => {
        await appServer.close();
    })

    it('should return a 200 when user with filter is found', async () => {
        // Send the token in the headers
        const res = await request(app)
            .get('/users/?skill=')

        expect(res.statusCode).toEqual(200);
    })

});