process.env.NODE_ENV = 'test';  // Add this line at the very top

const request = require('supertest');
const app = require('../server'); // Adjust the path to where your server is exported
const sequelize = require('../config/database'); // Your database configuration
const User = require('../models/User');
const Material = require('../models/Material');

describe('API Tests', () => {
    beforeAll(async () => {
        try {
            await sequelize.sync({ force: true }); // Reset the database
        } catch (error) {
            console.error('Error during database setup:', error);
            throw error; // Fail the tests if database setup fails
        }
    });

    afterAll(async () => {
        try {
            await sequelize.close(); // Close the database connection after tests
        } catch (error) {
            console.error('Error closing database connection:', error);
        }
    });

    let token;
    let userId;

    test('User registration', async () => {
        try {
            const res = await request(app)
                .post('/register')
                .send({
                    username: 'testuser',
                    email: 'testuser@example.com',
                    password: 'Password@123',
                    security_question: 'What is your pet\'s name?',
                    security_answer: 'Fluffy',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('User registered successfully');
        } catch (error) {
            console.error('Error during user registration:', error);
            throw error;
        }
    });

    test('User login', async () => {
        try {
            const res = await request(app)
                .post('/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'Password@123',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.token).toBeDefined();
            token = res.body.token;
        } catch (error) {
            console.error('Error during user login:', error);
            throw error;
        }
    });

    test('Create material', async () => {
        if (!token) {
            throw new Error('Authorization token is missing. User login must have failed.');
        }

        try {
            const res = await request(app)
                .post('/materials')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Test Material',
                    price: 100,
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.name).toBe('Test Material');
        } catch (error) {
            console.error('Error creating material:', error);
            throw error;
        }
    });

    test('Get all materials', async () => {
        if (!token) {
            throw new Error('Authorization token is missing. User login must have failed.');
        }

        try {
            const res = await request(app)
                .get('/materials')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        } catch (error) {
            console.error('Error retrieving materials:', error);
            throw error;
        }
    });

    test('Update material', async () => {
        try {
            const material = await Material.findOne({ where: { name: 'Test Material' } });

            if (!material) {
                throw new Error('Material not found for updating');
            }

            const res = await request(app)
                .put(`/materials/${material.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Updated Material',
                    price: 150,
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.name).toBe('Updated Material');
        } catch (error) {
            console.error('Error updating material:', error);
            throw error;
        }
    });

    test('Delete material', async () => {
        try {
            const material = await Material.findOne({ where: { name: 'Updated Material' } });

            if (!material) {
                throw new Error('Material not found for deletion');
            }

            const res = await request(app)
                .delete(`/materials/${material.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(204);
        } catch (error) {
            console.error('Error deleting material:', error);
            throw error;
        }
    });
});