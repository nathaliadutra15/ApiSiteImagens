import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { UserService } from '../service/user.service';
import { UserController } from '../controller/user.controller';
import { S3Service } from '../service/s3.service';
import { ConfigModule, ConfigService } from "@nestjs/config";
import authConfigs from '../configs/read.config'
import { INestApplication } from '@nestjs/common';
import { DBConnection } from '../repository/database.connection';
let date = Date.now();

describe('Usuários', () => {
  let app: INestApplication;
  let dbConnection: DBConnection;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({
        load: [authConfigs]
      })],
      controllers: [UserController],
      providers: [UserService, S3Service, ConfigService, DBConnection],
    }).compile();

    dbConnection = moduleRef.get<DBConnection>(DBConnection);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`TST 1 - REGISTRO DE USUÁRIOS (POST /user/register)`, async () => {
    await request(app.getHttpServer())
      .post('/user/register')
      .send({
        "email": `${date}-teste@email.com`,
        "usuario": `${date}-teste`,
        "dataNasc": "2023-01-01T00:00:00.000Z",
        "senha": "teste"
      })
      .expect(201)
      .expect(
        {
          "message": `Usuário "${date}-teste" criado com sucesso.`
        }
      );
  });

  it(`TST 2 - LISTAGEM DE USUÁRIOS (GET /user/list)`, async () => {
    const response = await request(app.getHttpServer())
      .get('/user/list')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          email: expect.any(String),
          usuario: expect.any(String),
          dataNasc: expect.any(String),
          senha: expect.any(String),
          seguidores: expect.any(Array),
          seguindo: expect.any(Array),
          criadoEm: expect.any(String),
          posts: expect.any(Array),
          __v: expect.any(Number)
        })
      ])
    );
  });

  it(`TST 3 - LISTAGEM DE USUÁRIO ESPECÍFICO POR USERNAME (GET /user/:username)`, async () => {
    const response = await request(app.getHttpServer())
      .get(`/user/${date}-teste`);

    expect(response.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        email: expect.any(String),
        usuario: expect.any(String),
        dataNasc: expect.any(String),
        senha: expect.any(String),
        seguidores: expect.any(Array),
        seguindo: expect.any(Array),
        criadoEm: expect.any(String),
        posts: expect.any(Array),
        __v: expect.any(Number)
      })
    );
    expect(response.body.usuario).toBe(`${date}-teste`);


  });

  it(`TST 4 - LISTAGEM DE USUÁRIO ESPECÍFICO POR EMAIL (GET /user/email/:email)`, async () => {
    const response = await request(app.getHttpServer())
      .get(`/user/email/${date}-teste@email.com`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        email: expect.any(String),
        usuario: expect.any(String),
        dataNasc: expect.any(String),
        senha: expect.any(String),
        seguidores: expect.any(Array),
        seguindo: expect.any(Array),
        criadoEm: expect.any(String),
        posts: expect.any(Array),
        __v: expect.any(Number)
      })
    );
    expect(response.body.email).toBe(`${date}-teste@email.com`);
  });

  it(`TST 4 - LISTAGEM DE USUÁRIO ESPECÍFICO POR EMAIL (GET /user/email/:email)`, async () => {
    const response = await request(app.getHttpServer())
      .get(`/user/email/${date}-teste@email.com`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        email: expect.any(String),
        usuario: expect.any(String),
        dataNasc: expect.any(String),
        senha: expect.any(String),
        seguidores: expect.any(Array),
        seguindo: expect.any(Array),
        criadoEm: expect.any(String),
        posts: expect.any(Array),
        __v: expect.any(Number)
      })
    );
    expect(response.body.email).toBe(`${date}-teste@email.com`);
  });

  it(`TST 5 - ATUALIZAÇÃO DE USUÁRIO ESPECÍFICO (PUT /user/:username)`, async () => {
    await request(app.getHttpServer())
      .put(`/user/${date}-teste`)
      .send({
        "email": `${date}-teste-update@email.com`,
      })
      .expect(200)
      .expect(
        {
          "message": `Usuário atualizado com sucesso.`
        }
      );

    const response = await request(app.getHttpServer())
      .get(`/user/${date}-teste`);
    expect(response.body.email).toBe(`${date}-teste-update@email.com`);


  });

  it(`TST 6 - EXCLUSÃO DE USUÁRIO (DELETE /user/remove/:username)`, async () => {
    await request(app.getHttpServer())
      .delete(`/user/remove/${date}-teste`)
      .expect(200)
      .expect(
        {
          "message": "Usuário deletado com sucesso."
        }
      );

    async () => {
      await request(app.getHttpServer())
        .get(`/user/${date}-teste`)
        .expect(422)
        .expect(
          {
            "message": "Usuário não foi encontrado."
          }
        );
    }
  });

  afterAll(async () => {
    await dbConnection.disconnectMongo()
    await app.close();
  });
});