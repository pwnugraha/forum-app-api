const GetThread = require('../GetThread');

describe('a GetThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'New Thread',
    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 123,
      body: 'user-123',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create getThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'New Thread',
      body: 'user-123',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    // Action
    const getThread = new GetThread(payload);

    // Assert
    expect(getThread.id).toEqual(payload.id);
    expect(getThread.title).toEqual(payload.title);
    expect(getThread.body).toEqual(payload.body);
    expect(getThread.date).toEqual(payload.date);
    expect(getThread.username).toEqual(payload.username);
  });
});
