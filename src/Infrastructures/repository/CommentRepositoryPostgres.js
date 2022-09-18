const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const GetComment = require('../../Domains/comments/entities/GetComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    const comment = result.rows[0];
    if (comment.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyExistingComment(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async addComment(createComment) {
    const { content, owner, thread } = createComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments (id, content, owner, thread) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, owner, thread],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async findCommentByThreadId(id) {
    const query = {
      text: `SELECT comments.*, users.username FROM comments
      INNER JOIN threads ON comments.thread = threads.id 
      INNER JOIN users ON comments.owner = users.id 
      WHERE comments.thread = $1 
      ORDER BY comments.date ASC`,
      values: [id],
    };

    const results = await this._pool.query(query);
    const mapResults = results.rows.map((result) => new GetComment(result));
    return mapResults;
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
