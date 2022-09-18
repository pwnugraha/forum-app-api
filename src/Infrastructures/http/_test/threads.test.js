const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTabletestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTabletestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and add new thread', async () => {
      // Arrange
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestPayload = {
        title: 'New Thread',
        body: 'This is New Thread',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });

      const responseAuth = JSON.parse(auth.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        title: 'New  Thread',
      };
      const server = await createServer(container);

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });

      const responseAuth = JSON.parse(auth.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan thread karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        title: 'New Thread',
        body: 123,
        owner: 'user-123',
      };
      const server = await createServer(container);

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });

      const responseAuth = JSON.parse(auth.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan thread karena tipe data tidak sesuai');
    });

    it('should response 401 for unauthenticated user', async () => {
      // Arrange
      const requestPayload = {
        title: 'New Thread',
        body: 'This is New Thread',
      };

      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and successfully get thread', async () => {
      // Arrange
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestThreadPayload = {
        title: 'New Thread',
        body: 'This is New Thread',
      };

      const requestPayload = {
        content: 'New Comment',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });

      const responseAuth = JSON.parse(auth.payload);

      const postThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestThreadPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      const responseThread = JSON.parse(postThread.payload);

      await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${responseThread.data.addedThread.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
      const threadId = 'thread-123';
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });
});
