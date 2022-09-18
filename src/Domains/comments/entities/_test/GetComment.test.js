const GetComment = require('../GetComment');

describe('a GetComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payloads = [
      {
        title: 'New Comment',
      },
      {
        title: 'New Comment',
      },
    ];

    // Action and Assert
    expect(() => payloads.map((payload) => new GetComment(payload))).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payloads = [
      {
        id: 'comment-123',
        content: '123',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
      },
      {
        id: 'comment-456',
        content: 123,
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding2',
      },
    ];

    // Action and Assert
    expect(() => payloads.map((payload) => new GetComment(payload))).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create getComment object correctly', () => {
    // Arrange
    const payloads = [
      {
        id: 'comment-123',
        content: 'comment 1',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
        is_delete: false,
      },
      {
        id: 'comment-456',
        content: 'comment 2',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding2',
        is_delete: true,
      },
    ];

    // Action
    const getComment = payloads.map((payload) => new GetComment(payload));

    // Assert
    expect(getComment[0].id).toEqual(payloads[0].id);
    expect(getComment[0].content).toEqual(payloads[0].content);
    expect(getComment[0].date).toEqual(payloads[0].date);
    expect(getComment[0].username).toEqual(payloads[0].username);
    expect(getComment[1].id).toEqual(payloads[1].id);
    expect(getComment[1].content).toEqual('**komentar telah dihapus**');
    expect(getComment[1].date).toEqual(payloads[1].date);
    expect(getComment[1].username).toEqual(payloads[1].username);
  });
});
