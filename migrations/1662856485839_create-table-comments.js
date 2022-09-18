exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    thread: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
  });

  pgm.addConstraint('comments', 'fk_comments.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_thread.thread_threads.id', 'FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
