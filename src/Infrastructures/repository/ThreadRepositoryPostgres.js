const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const GetThread = require('../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyExistingThread(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async addThread(createThread) {
    const { title, body, owner } = createThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads (id, title, body, owner) VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread(result.rows[0]);
  }

  async findThreadById(id) {
    const query = {
      text: `SELECT threads.*, users.username FROM threads 
      INNER JOIN users ON threads.owner = users.id WHERE threads.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return new GetThread(result.rows[0]);
  }
}

module.exports = ThreadRepositoryPostgres;
