class ThreadRepository {
  async addThread(createThread) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyExistingThread(id) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async findThreadById(id) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadRepository;
