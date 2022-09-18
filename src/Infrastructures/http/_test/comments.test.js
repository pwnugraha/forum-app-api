const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTabletestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTabletestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint for add and delete comment', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and add new comment', async () => {
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

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestThreadPayload = {
        title: 'New Thread',
        body: 'This is New Thread',
      };

      const requestPayload = {};
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

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan comment karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
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
        content: 123,
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

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan comment karena tipe data tidak sesuai');
    });

    it('should response 401 for unauthenticated user', async () => {
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

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
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

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${''}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.error).toEqual('Not Found');
      expect(responseJson.message).toEqual('Not Found');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and successfully delete comment', async () => {
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

      const postComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      const responseComment = JSON.parse(postComment.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}`,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 for unauthenticated user', async () => {
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

      const postComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      const responseComment = JSON.parse(postComment.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
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

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${'123'}/comments/${'123'}`,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 if comment not found', async () => {
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
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${'123'}`,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should response 403 for an unauthorized user', async () => {
      // Arrange
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestUser2Payload = {
        username: 'dicoding2',
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
      // Begin user action to add comment
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding2',
          password: 'secret',
          fullname: 'Dicoding Indonesia 2',
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

      const postComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      const responseComment = JSON.parse(postComment.payload);

      // Begin user2 action to delete comment of user
      const authUser2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUser2Payload,
      });

      const responseAuthUser2 = JSON.parse(authUser2.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}`,
        headers: {
          Authorization: `Bearer ${responseAuthUser2.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.message).toEqual('Anda tidak berhak mengakses resource ini');
    });
  });
});
