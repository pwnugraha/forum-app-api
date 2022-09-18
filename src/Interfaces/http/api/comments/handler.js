const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentToThreadHandler = this.postCommentToThreadHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentToThreadHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId: thread } = request.params;
    const useCasePayload = { ...request.payload, owner, thread };
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const useCasePayload = { commentId, threadId, owner };
    await deleteCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = CommentsHandler;
