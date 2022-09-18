const CommentsTableTestHelper = require('../../../../tests/CommentsTabletestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTabletestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist create comment and return added comment correctly', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'New Comment',
        owner: 'user-123',
        thread: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser(createComment.owner);
      await ThreadsTableTestHelper.addThread('thread-123', createComment.owner);

      // Action
      await commentRepositoryPostgres.addComment(createComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(`comment-${fakeIdGenerator()}`);
      expect(comment).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'New Comment',
        owner: 'user-123',
        thread: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser(createComment.owner);
      await ThreadsTableTestHelper.addThread('thread-123', createComment.owner);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(createComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: `comment-${fakeIdGenerator()}`,
        content: 'New Comment',
        owner: 'user-123',
      }));
    });

    it('should throw InvariantError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadRepositoryPostgres.verifyExistingThread('thread-123'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment from database', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'New Comment',
        owner: 'user-123',
        thread: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser(createComment.owner);
      await ThreadsTableTestHelper.addThread('thread-123', createComment.owner);
      await CommentsTableTestHelper.addComment(`comment-${fakeIdGenerator()}`);

      // Action
      await commentRepositoryPostgres.deleteComment(`comment-${fakeIdGenerator()}`);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(`comment-${fakeIdGenerator()}`);
      expect(comment[0].is_delete).toEqual(true);
    });
  });

  describe('getComment function', () => {
    it('should return get comment successfully', async () => {
      // Arrange
      const createComment = {
        id: 'comment-123',
        content: 'New Comment',
        date: '2022-09-16T07:22:33.555Z',
        owner: 'user-123',
        thread: 'thread-123',
      };

      const expectedGetComment = new GetComment({
        id: 'comment-123',
        username: 'dicoding',
        date: '2022-09-16T07:22:33.555Z',
        content: 'New Comment',
        is_deleted: false,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser(createComment.owner, 'dicoding');
      await ThreadsTableTestHelper.addThread(createComment.thread, createComment.owner);
      await CommentsTableTestHelper.addComment(createComment);

      // Action
      const comments = await commentRepositoryPostgres.findCommentByThreadId(createComment.thread);

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0]).toStrictEqual(expectedGetComment);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should return AuthorizationError if not the owner of the comments', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'New Comment',
        owner: 'user-123',
        thread: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser(createComment.owner);
      await ThreadsTableTestHelper.addThread('thread-123', createComment.owner);

      // Action
      await commentRepositoryPostgres.addComment(createComment);

      // Assert
      expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-124')).rejects.toThrow(AuthorizationError);
    });

    it('should not return AuthorizationError if as the owner of the comments', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'New Comment',
        owner: 'user-123',
        thread: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser(createComment.owner);
      await ThreadsTableTestHelper.addThread('thread-123', createComment.owner);

      // Action
      await commentRepositoryPostgres.addComment(createComment);

      // Assert
      expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('verifyExistingComment function', () => {
    it('should return NotFoundError if comment not found', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'New Comment',
        owner: 'user-123',
        thread: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser(createComment.owner);
      await ThreadsTableTestHelper.addThread('thread-123', createComment.owner);

      // Action
      await commentRepositoryPostgres.addComment(createComment);

      // Assert
      expect(commentRepositoryPostgres.verifyExistingComment('comment-124')).rejects.toThrow(NotFoundError);
    });

    it('should not return NotFoundError if comment was found', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'New Comment',
        owner: 'user-123',
        thread: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser(createComment.owner);
      await ThreadsTableTestHelper.addThread('thread-123', createComment.owner);

      // Action
      await commentRepositoryPostgres.addComment(createComment);

      // Assert
      expect(commentRepositoryPostgres.verifyExistingComment('comment-123')).resolves.not.toThrow(NotFoundError);
    });
  });
});
