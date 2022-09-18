const CreateComment = require('../CreateComment');

describe('a CreateComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      owner: 'user-123',
      thread: 'thread-123',
    };

    // Action and Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should add createComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'New Comment',
      owner: 'user-123',
      thread: 'thread-123',
    };
    // Action
    const { content, owner, thread } = new CreateComment(payload);
    // Assert
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(thread).toEqual(payload.thread);
  });
});
