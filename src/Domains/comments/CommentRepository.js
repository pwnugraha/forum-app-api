class CommentRepository {
  async verifyCommentOwner(id, owner) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyExistingComment(id) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addComment(createComment) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async findCommentByThreadId(id) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteComment(id) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentRepository;
