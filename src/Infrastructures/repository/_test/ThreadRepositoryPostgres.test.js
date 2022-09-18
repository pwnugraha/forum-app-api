const ThreadsTableTestHelper = require('../../../../tests/ThreadsTabletestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist create thread and return added thread correctly', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'New Thread',
        body: 'This is New Thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser(createThread.owner);

      // Action
      await threadRepositoryPostgres.addThread(createThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById(`thread-${fakeIdGenerator()}`);
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'New Thread',
        body: 'This is New Thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser(createThread.owner);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(createThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'New Thread',
        owner: 'user-123',
      }));
    });
  });

  describe('getThread function', () => {
    it('should return get thread successfully', async () => {
      // Arrange
      const createThread = {
        id: 'thread-123',
        title: 'New Thread',
        body: 'This is New Thread',
        date: '2022-09-16T07:22:33.555Z',
        owner: 'user-123',
      };

      const expectedGetThread = new GetThread({
        id: 'thread-123',
        title: 'New Thread',
        body: 'This is New Thread',
        date: '2022-09-16T07:22:33.555Z',
        username: 'dicoding',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser(createThread.owner, 'dicoding');
      await ThreadsTableTestHelper.addThread(createThread);

      // Action
      const thread = await threadRepositoryPostgres.findThreadById(createThread.id);

      // Assert
      expect(thread).toStrictEqual(expectedGetThread);
    });
  });

  describe('verifyExistingThread function', () => {
    it('should return NotFoundError if thread not found', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'New Thread',
        body: 'This is New Thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser(createThread.owner);

      // Action
      await threadRepositoryPostgres.addThread(createThread);

      // Assert
      expect(threadRepositoryPostgres.verifyExistingThread('thread-124')).rejects.toThrow(NotFoundError);
    });

    it('should not return NotFoundError if thread was found', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'New Thread',
        body: 'This is New Thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser(createThread.owner);

      // Action
      await threadRepositoryPostgres.addThread(createThread);

      // Assert
      expect(threadRepositoryPostgres.verifyExistingThread('thread-123')).resolves.not.toThrow(NotFoundError);
    });
  });
});
