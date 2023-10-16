import request from 'supertest';
import app from '../index';

describe('Retrieve User Endpoint', () => {

    it('should return a 400 error when no access token is provided', async () => {
        const res = await request(app)
            .get('/users/me/');

        expect(res.statusCode).toEqual(400);
    });

    it('should return a 401 error when an invalid access token is provided', async () => {
        const res = await request(app)
            .get('/users/me/')
            .set('Authorization', 'Bearer invalid-token');

        expect(res.statusCode).toEqual(401);
    });

});