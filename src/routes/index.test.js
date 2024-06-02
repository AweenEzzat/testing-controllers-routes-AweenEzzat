const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Post = require('../models/post');
const Comment = require('../models/comment');

describe('API Routes', () => {
  beforeAll(async () => {
    const url = `mongodb://localhost:27017/testDB`;
    await mongoose.connect(url, { useNewUrlParser: true });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  describe('GET /posts', () => {
    it('should return all posts', async () => {
      const post = new Post({ userName: 'John', postText: 'Test post' });
      await post.save();

      const res = await request(app).get('/posts');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].userName).toBe('John');
    });
  });

  describe('POST /posts', () => {
    it('should create a new post', async () => {
      const res = await request(app).post('/posts').send({ userName: 'John', postText: 'New post' });
      expect(res.statusCode).toEqual(201);
      expect(res.body.userName).toBe('John');
      expect(res.body.postText).toBe('New post');
    });
  });

  describe('GET /posts/:id', () => {
    it('should return a single post', async () => {
      const post = new Post({ userName: 'John', postText: 'Test post' });
      await post.save();

      const res = await request(app).get(`/posts/${post._id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.userName).toBe('John');
    });

    it('should return 404 if post not found', async () => {
      const res = await request(app).get('/posts/60f8f8f8f8f8f8f8f8f8f8f8');
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('POST /posts/:id/comments', () => {
    it('should add a comment to a post', async () => {
      const post = new Post({ userName: 'John', postText: 'Test post' });
      await post.save();

      const res = await request(app)
        .post(`/posts/${post._id}/comments`)
        .send({ userName: 'Jane', commentText: 'Nice post' });

      expect(res.statusCode).toEqual(201);
      expect(res.body.userName).toBe('Jane');
      expect(res.body.commentText).toBe('Nice post');
    });

    it('should return 404 if post not found', async () => {
      const res = await request(app)
        .post('/posts/60f8f8f8f8f8f8f8f8f8f8f8/comments')
        .send({ userName: 'Jane', commentText: 'Nice post' });

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('GET /posts/:postid/comment/:commentid', () => {
    it('should return a single comment', async () => {
      const post = new Post({ userName: 'John', postText: 'Test post' });
      await post.save();

      const comment = new Comment({ userName: 'Jane', commentText: 'Nice post', postId: post._id });
      await comment.save();

      const res = await request(app).get(`/posts/${post._id}/comment/${comment._id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.userName).toBe('Jane');
    });

    it('should return 404 if comment not found', async () => {
      const post = new Post({ userName: 'John', postText: 'Test post' });
      await post.save();

      const res = await request(app).get(`/posts/${post._id}/comment/60f8f8f8f8f8f8f8f8f8f8f8`);
      expect(res.statusCode).toEqual(404);
    });
  });
});
