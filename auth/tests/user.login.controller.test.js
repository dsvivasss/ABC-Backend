import request from 'supertest';
import app from '../index';
import dotenv from 'dotenv';

dotenv.config();

describe('Login User Endpoint', () => {
    const user = {
        username: 'testuser',
        email: 'email@mail.com',
        password: 'password123'
    }

    beforeAll(async () => {
        app.listen(3010);
        await request(app)
            .post('/users/')
            .send(user)
    });

    it('should log in a user when correct credentials are provided', async () => {
        const res = await request(app)
            .post('/users/auth/')
            .send({
                username: user.username,
                password: user.password
            });

        expect(res.statusCode).toEqual(200);
    });

    it('should return a 401 error when incorrect credentials are provided', async () => {
        const res = await request(app)
            .post('/users/auth')
            .send({
                username: user.username + 'wrong',
                password: user.password
            });

        expect(res.statusCode).toEqual(404);
    });

    it('should return a 400 when missing required fields', async () => {
        const res = await request(app)
            .post('/users/auth')
            .send({
                username: user.username,
            });

        expect(res.statusCode).toEqual(400);
    })
});