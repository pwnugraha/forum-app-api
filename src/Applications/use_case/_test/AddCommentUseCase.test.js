const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'New Comment',
      owner: 'user-123',
      thread: 'thread-123',
    };
    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      thread: useCasePayload.thread,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyExistingThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedComment({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
        thread: useCasePayload.thread,
      })));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyExistingThread).toBeCalled();
    expect(mockCommentRepository.addComment).toBeCalledWith(new CreateComment({
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      thread: useCasePayload.thread,
    }));
  });
});
