import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * Smoke e2e test. Requires a reachable DATABASE_URL (Postgres). It verifies the
 * app boots and the public health + auth-validation paths behave.
 */
describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('GET /api/health → 200', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.data.status).toBe('ok');
      });
  });

  it('POST /api/auth/login with bad body → 400', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'not-an-email' })
      .expect(400);
  });

  it('GET /api/products → 200 (public)', () => {
    return request(app.getHttpServer()).get('/api/products').expect(200);
  });

  it('GET /api/cart without token → 401', () => {
    return request(app.getHttpServer()).get('/api/cart').expect(401);
  });
});
