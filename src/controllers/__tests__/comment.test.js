const { getSingleComment, addCommentOnPost } = require('../comment');
const Comment = require('../../models/comment');
const Post = require('../../models/post');
const httpMocks = require('node-mocks-http');

jest.mock('../../models/comment');
jest.mock('../../models/post');

describe('Comment Controller', () => {
  describe('getSingleComment', () => {
    it('should return 404 if comment not found', async () => {
      const req = httpMocks.createRequest({ params: { commentid: '1' } });
      const res = httpMocks.createResponse();
      Comment.findById.mockResolvedValue(null);

      await getSingleComment(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toBe('Comment not found');
    });

    it('should return 200 and comment if found', async () => {
      const req = httpMocks.createRequest({ params: { commentid: '1' } });
      const res = httpMocks.createResponse();
      const comment = { _id: '1', commentText: 'Test comment', postId: '1' };
      Comment.findById.mockResolvedValue(comment);

      await getSingleComment(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(comment);
    });
  });

  describe('addCommentOnPost', () => {
    it('should return 404 if post not found', async () => {
      const req = httpMocks.createRequest({ params: { id: '1' }, body: { userName: 'John', commentText: 'Nice post' } });
      const res = httpMocks.createResponse();
      Post.findById.mockResolvedValue(null);

      await addCommentOnPost(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toBe('Post not found');
    });

    it('should return 201 and create a comment', async () => {
      const req = httpMocks.createRequest({ params: { id: '1' }, body: { userName: 'John', commentText: 'Nice post' } });
      const res = httpMocks.createResponse();
      const post = { _id: '1', comments: [], save: jest.fn() };
      const comment = { _id: '2', userName: 'John', commentText: 'Nice post', postId: '1', save: jest.fn() };
      Post.findById.mockResolvedValue(post);
      Comment.prototype.save.mockResolvedValue(comment);

      await addCommentOnPost(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(comment);
    });
  });
});
