const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports = {
  getSingleComment: async (req, res) => {
    try {
      const { postid, commentid } = req.params;
      const comment = await Comment.findById(commentid).populate('postId');
      if (!comment) {
        return res.status(404).send('Comment not found');
      }
      res.status(200).json(comment);
    } catch (error) {
      res.status(500).send('Server error');
    }
  },
  addCommentOnPost: async (req, res) => {
    try {
      const { id } = req.params;
      const { userName, commentText } = req.body;
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).send('Post not found');
      }
      const comment = new Comment({ userName, commentText, postId: id });
      await comment.save();
      post.comments.push(comment._id);
      await post.save();
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).send('Server error');
    }
  },
};
