const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const GetComment = require('../../../Domains/comments/entities/GetComment');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedGetThread = new GetThread({
      id: 'thread-123',
      title: 'New Thread',
      body: 'This is New Thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    });
    expectedGetThread.comments = [
      new GetComment({
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:19:09.775Z',
        content: 'New Comment',
        is_deleted: false,
      }), new GetComment({
        id: 'comment-124',
        username: 'dicoding2',
        date: '2021-08-09T07:19:09.775Z',
        content: 'New Comment2',
        is_deleted: true,
      }),
    ];

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyExistingThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.findThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new GetThread({
        id: 'thread-123',
        title: 'New Thread',
        body: 'This is New Thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
      })));
    mockCommentRepository.findCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        new GetComment({
          id: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08T07:19:09.775Z',
          content: 'New Comment',
          is_deleted: false,
        }),
        new GetComment({
          id: 'comment-124',
          username: 'dicoding2',
          date: '2021-08-09T07:19:09.775Z',
          content: 'New Comment2',
          is_deleted: true,
        }),
      ]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.verifyExistingThread)
      .toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.findThreadById)
      .toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.findCommentByThreadId)
      .toHaveBeenCalledWith(threadId);
    expect(getThread).toStrictEqual(expectedGetThread);
  });
});
