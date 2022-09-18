const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentToThreadHandler,
    options: {
      auth: 'forumapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentHandler,
    options: {
      auth: 'forumapp_jwt',
    },
  },
]);

module.exports = routes;
