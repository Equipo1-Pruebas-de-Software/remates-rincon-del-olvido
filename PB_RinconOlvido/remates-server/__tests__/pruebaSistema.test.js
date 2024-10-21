import request from 'supertest';
import createApp from '../server.js';

let app;

beforeAll(async () => {
    app = await createApp();

    const loginResponse = await request(app)
            .post('/login/admin')
            .send({ email: 'admin@admin.cl', password: 'asd123' });
    const cookies = loginResponse.headers['set-cookie'];

    await request(app)
            .post(`/products`)
            .send({
                "id": 999999,
                "name":"test product",
                "price":100,
                "end_date":"2024-12-31T23:59:59.000Z",
                "image_url":"https://s3.aws.bucketname.com/asd123",
                "description": "asd"
            })
            .set('Cookie', cookies);
});

afterAll(async() => {
    const loginResponse = await request(app)
            .post('/login/admin')
            .send({ email: 'admin@admin.cl', password: 'asd123' });
    const cookies = loginResponse.headers['set-cookie'];

    await request(app)
            .del(`/products/999999`)
            .set('Cookie', cookies);

    await request(app)
            .del(`/bids/999999`)
            .set('Cookie', cookies);
});

describe('CU2: Ver detalles de productos', () => {
    test('Debería buscar un producto y mostrar resultados coincidentes', async () => {
        const loginResponse = await request(app)
            .post('/login/user')
            .send({ email: 'user@user.cl', password: 'asd123' });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.status).toBe('success');

        const cookies = loginResponse.headers['set-cookie'];

        const response = await request(app)
            .get(`/products/`)
            .set('Cookie', cookies);
        
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
    });

    test('Debería mostrar información detallada del producto seleccionado', async () => {
        const loginResponse = await request(app)
            .post('/login/user')
            .send({ email: 'user@user.cl', password: 'asd123' });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.status).toBe('success');

        const cookies = loginResponse.headers['set-cookie'];
        
        const productId = 999999;

        const response = await request(app)
            .get(`/products/${productId}`)
            .set('Cookie', cookies);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
    });
})

describe('CU3: Realizar oferta en tiempo real', () => {
    test('Realizar oferta en tiempo real', async () => {
        const loginResponse = await request(app)
            .post('/login/user')
            .send({ id: 999999, email: 'user@user.cl', password: 'asd123' });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.status).toBe('success');

        const cookies = loginResponse.headers['set-cookie'];
        const productId = 999999;

        const bidAmount = 200;a
    
        const bidResponse = await request(app)
            .post(`/bids`)
            .send({ id: 999999, productId: productId, bid: bidAmount })
            .set('Cookie', cookies);

        
        if (bidAmount < 100) {
            expect(bidResponse.status).toBe(400);
            expect(bidResponse.body.message).toBe('The bid must be at least equal to the product price.');
        } else {
            expect(bidResponse.status).toBe(201);
            expect(bidResponse.body.status).toBe('success');
            expect(bidResponse.body.message).toBe('Bid created successfully');
        }
    });
});