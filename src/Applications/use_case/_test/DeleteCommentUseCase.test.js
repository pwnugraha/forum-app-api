const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyExistingThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyExistingComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyExistingThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyExistingComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyCommentOwner)
      .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
  });

  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 123,
      threadId: 'thread-123',
      owner: 'user-123',
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
