import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { UserService } from '../service/user.service';
import { UserController } from '../controller/user.controller';
import { S3Service } from '../service/s3.service';
import { ConfigModule, ConfigService } from "@nestjs/config";
import authConfigs from '../configs/read.config'
import { INestApplication } from '@nestjs/common';
import { DBConnection } from '../repository/database.connection';
import { PostService } from '../service/post.service';
import { PostsController } from '../controller/post.controller';
import { CommentController } from '../controller/comment.controller';
import { CommentService } from '../service/comment.service';
let date = Date.now();

describe('Usuários', () => {
  let app: INestApplication;
  let dbConnection: DBConnection;
  let idUsuario: string;
  let idPost: string;
  let idComment: string;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({
        load: [authConfigs]
      })],
      controllers: [UserController, PostsController, CommentController],
      providers: [UserService, PostService, CommentService, S3Service, ConfigService, DBConnection],
    }).compile();

    dbConnection = moduleRef.get<DBConnection>(DBConnection);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`TST 01 - REGISTRO DE USUÁRIOS (POST /user/register)`, async () => {
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

  it(`TST 02 - LISTAGEM DE USUÁRIOS (GET /user/list)`, async () => {
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

  it(`TST 03 - LISTAGEM DE USUÁRIO ESPECÍFICO POR USERNAME (GET /user/:username)`, async () => {
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

    idUsuario = response.body._id;
  });

  it(`TST 04 - LISTAGEM DE USUÁRIO ESPECÍFICO POR EMAIL (GET /user/email/:email)`, async () => {
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

  it(`TST 05 - ATUALIZAÇÃO DE USUÁRIO ESPECÍFICO (PUT /user/:username)`, async () => {
    await request(app.getHttpServer())
      .put(`/user/${date}-teste`)
      .send({
        "pathFotoPerfil": `https://emgjthqhswskiiijplve.supabase.co/storage/v1/object/sign/site_imagens_bucket/profile/teste-e2e-profile.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzaXRlX2ltYWdlbnNfYnVja2V0L3Byb2ZpbGUvdGVzdGUtZTJlLXByb2ZpbGUuanBnIiwiaWF0IjoxNzAwMTY2MDExLCJleHAiOjE3MzE3MDIwMTF9.r0LjUC_qVWqePNe_4Z8oGa75evt5SY4Woc7U8F33ntk&t=2023-11-16T20%3A19%3A37.814Z`,
      })
      .expect(200)
      .expect(
        {
          "message": `Usuário atualizado com sucesso.`
        }
      );
  });

  it(`TST 06 - CRIAÇÃO DE POST (POST /post/create/:id)`, async () => {

    await request(app.getHttpServer())
      .post(`/post/create/${idUsuario}`)
      .send({
        "usuario": `${date}-teste-posts`,
        "pathFotoPost": "https://url.da.imagem",
        "descricaoPost": "TESTE E2E - POSTS"
      })
      .expect(201)
      .expect(
        {
          "message": `Post criado com sucesso.`
        }
      );
  });

  it(`TST 07 - LISTAR POSTS (GET /post/list)`, async () => {

    const response = await request(app.getHttpServer())
      .get(`/post/list`)
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          usuario: expect.any(String),
          posts: expect.arrayContaining([
            expect.objectContaining({
              usuario: expect.any(String),
              pathFotoPost: expect.any(String),
              descricaoPost: expect.any(String),
              comentarios: expect.any(Array),
              tags: expect.any(Array),
              curtidas: expect.any(Array),
              criadoEm: expect.any(String),
              atualizadoEm: expect.any(String),
              _id: expect.any(String)
            })
          ])
        })
      ])
    );
  });

  it(`TST 08 - LISTAR POSTS POR USERNAME (GET /post/list/user/:username)`, async () => {

    const response = await request(app.getHttpServer())
      .get(`/post/list/user/${date}-teste`)
      .expect(200);

    expect(response.body.posts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          usuario: expect.any(String),
          pathFotoPost: expect.any(String),
          descricaoPost: expect.any(String),
          comentarios: expect.any(Array),
          tags: expect.any(Array),
          curtidas: expect.any(Array),
          criadoEm: expect.any(String),
          atualizadoEm: expect.any(String),
          _id: expect.any(String)
        })
      ])
    );

    idPost = response.body.posts[0]._id;
  });

  it(`TST 09 - RETORNAR POST ESPECÍFICO POR ID (GET /post/list/:id)`, async () => {

    const response = await request(app.getHttpServer())
      .get(`/post/list/${idPost}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        usuario: expect.any(String),
        pathFotoPost: expect.any(String),
        descricaoPost: expect.any(String),
        comentarios: expect.any(Array),
        tags: expect.any(Array),
        curtidas: expect.any(Array),
        criadoEm: expect.any(String),
        atualizadoEm: expect.any(String),
        _id: expect.any(String)
      })
    );
  });

  it(`TST 10 - CRIAR COMENTÁRIO (POST /comment/create/:postid)`, async () => {

    const response = await request(app.getHttpServer())
      .post(`/comment/create/${idPost}`)
      .send({
        "usuario": `${date}-teste`,
        "comentarioTexto": "Teste E2E - Comentários"
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        usuario: expect.any(String),
        comentarioTexto: expect.any(String),
        criadoEm: expect.any(String),
        atualizadoEm: expect.any(String),
        _id: expect.any(String)
      })
    );
  });

  it(`TST 11 - RETORNAR COMENTÁRIOS DE POST (GET /comment/list/:postid)`, async () => {

    const response = await request(app.getHttpServer())
      .get(`/comment/list/${idPost}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          usuario: expect.any(String),
          comentarioTexto: expect.any(String),
          criadoEm: expect.any(String),
          atualizadoEm: expect.any(String),
          _id: expect.any(String)
        })
      ])
    );
    idComment = response.body[0]._id;
  });

  it(`TST 12 - ATUALIZAR COMENTÁRIO (PUT /comment/update/:idcomment/post/:idpost)`, async () => {
    const response = await request(app.getHttpServer())
      .put(`/comment/update/${idComment}/post/${idPost}`)
      .send({
        "comentarioTexto": "Teste E2E - Atualização comentários"
      })
      .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          usuario: expect.any(String),
          pathFotoPost: expect.any(String),
          descricaoPost: expect.any(String),
          comentarios: expect.any(Array),
          tags: expect.any(Array),
          curtidas: expect.any(Array),
          criadoEm: expect.any(String),
          atualizadoEm: expect.any(String),
          _id: expect.any(String)
        })
      );
  });

  it(`TST 13 - EXCLUSÃO DE COMENTÁRIO (DELETE /comment/remove/:commentid)`, async () => {
    await request(app.getHttpServer())
      .delete(`/comment/remove/${idComment}`)
      .expect(201)
      .expect(
        {
          "message": "Comentário deletado com sucesso."
        }
      );
  });

  it(`TST 14 - EXCLUSÃO DE POST (DELETE /post/remove/:postid)`, async () => {
    await request(app.getHttpServer())
      .delete(`/post/remove/${idPost}`)
      .expect(201)
      .expect(
        {
          "message": "Post deletado com sucesso."
        }
      );
  });

  it(`TST 15 - EXCLUSÃO DE USUÁRIO (DELETE /user/remove/:username)`, async () => {
    await request(app.getHttpServer())
      .delete(`/user/remove/${date}-teste`)
      .expect(200)
      .expect(
        {
          "message": "Usuário deletado com sucesso."
        }
      );
  });

  afterAll(async () => {
    await dbConnection.disconnectMongo()
    await app.close();
  });
});