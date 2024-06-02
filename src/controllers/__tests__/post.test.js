const { getAllPosts, getSinglePost, addNewPost } = require('../post');
const Post = require('../../models/post');
const httpMocks = require('node-mocks-http');

jest.mock('../../models/post');

describe('Post Controller', () => {
  describe('getAllPosts', () => {
    it('should return 200 and all posts', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const posts = [{ _id: '1', postText: 'First post', comments: [] }];
      Post.find.mockResolvedValue(posts);

      await getAllPosts(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(posts);
    });
  });

  describe('getSinglePost', () => {
    it('should return 404 if post not found', async () => {
      const req = httpMocks.createRequest({ params: { id: '1' } });
      const res = httpMocks.createResponse();
      Post.findById.mockResolvedValue(null);

      await getSinglePost(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toBe('Post not found');
    });

    it('should return 200 and post if found', async () => {
      const req = httpMocks.createRequest({ params: { id: '1' } });
      const res = httpMocks.createResponse();
      const post = { _id: '1', postText: 'First post', comments: [] };
      Post.findById.mockResolvedValue(post);

      await getSinglePost(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(post);
    });
  });

  describe('addNewPost', () => {
    it('should return 201 and create a post', async () => {
      const req = httpMocks.createRequest({ body: { userName: 'John', postText: 'New post' } });
      const res = httpMocks.createResponse();
      const post = { _id: '1', userName: 'John', postText: 'New post', save: jest.fn() };
      Post.prototype.save.mockResolvedValue(post);

      await addNewPost(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(post);
    });
  });
});
