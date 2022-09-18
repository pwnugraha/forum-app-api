class GetThreadUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyExistingThread(useCasePayload);
    const thread = await this._threadRepository.findThreadById(useCasePayload);
    thread.comments = await this._commentRepository.findCommentByThreadId(useCasePayload);
    return thread;
  }
}

module.exports = GetThreadUseCase;
