const express = require('express');
const request = require('supertest');
const app = require('./server'); // Assuming server exports the app

describe('SOMA API Tests', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ username: 'testuser', password: 'testpass' });
    expect(response.status).toBe(201);
  });

  it('should login user', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpass' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should get lessons', async () => {
    // First login to get token
    const loginRes = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpass' });
    const token = loginRes.body.token;

    const response = await request(app)
      .get('/api/lessons')
      .set('Authorization', token);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});