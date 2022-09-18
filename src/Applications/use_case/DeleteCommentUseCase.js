class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    await this._threadRepository.verifyExistingThread(useCasePayload.threadId);
    await this._commentRepository.verifyExistingComment(useCasePayload.commentId);
    await this._commentRepository.verifyCommentOwner(useCasePayload.commentId, useCasePayload.owner);
    await this._commentRepository.deleteComment(useCasePayload.commentId);
  }

  _validatePayload(payload) {
    const { commentId, threadId, owner } = payload;
    if (!commentId || !threadId || !owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
