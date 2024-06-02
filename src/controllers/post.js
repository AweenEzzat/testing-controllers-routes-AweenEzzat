const Post = require('../models/post');

module.exports = {
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.find().populate('comments');
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).send('Server error');
    }
  },
  getSinglePost: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id).populate('comments');
      if (!post) {
        return res.status(404).send('Post not found');
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).send('Server error');
    }
  },
  addNewPost: async (req, res) => {
    try {
      const { userName, postText } = req.body;
      const post = new Post({ userName, postText });
      await post.save();
      res.status(201).json(post);
    } catch (error) {
      res.status(500).send('Server error');
    }
  },
};
