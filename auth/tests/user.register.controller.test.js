import request from 'supertest';
import app from '../index';
import dotenv from 'dotenv';

dotenv.config();

describe('Register User Endpoint', () => {
    const user = {
        username: 'testuser',
        email: 'email@mail.com',
        password: 'password123'
    }

    beforeAll(async () => {
        app.listen(3011);
    });

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
                username: user.username,
                email: user.email,
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Bad Request: Missing required fields');
    });

    it('should return a 412 error when user already exists with provided username or email', async () => {
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

});

describe('Login User Endpoint', () => {
    const user = {
        username: 'testuser',
        email: 'email@mail.com',
        password: 'password123'
    }

    beforeAll(async () => {
        // create a test user
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
});