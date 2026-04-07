const Blog = require("../models/Blog");
const cloudinary = require("../config/cloudinary");

// GET all blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to load blogs", error: error.message });
  }
};


exports.createBlog = async (req, res) => {
  try {
    let imageUrl = null;
    let imagePublicId = null;
    if (req.file) {
      try {
        imageUrl = req.file.path;
        imagePublicId = req.file.filename;

      } catch (err) {
        console.error("❌ ERROR in image processing:", err);
        throw new Error("Image processing failed");
      }
    } else {
      console.log("⚠️ No file uploaded");
    }

    const blogData = {
      ...req.body,
      image: imageUrl,
      imagePublicId
    };

    let blog;
    try {
      blog = await Blog.create(blogData);
    } catch (err) {
      console.error("❌ ERROR in MongoDB save:", err);
      throw new Error("Database save failed: " + err.message);
    }
    res.status(201).json(blog);

  } catch (error) {
    console.error("🔥 FINAL ERROR:", error);

    res.status(500).json({
      message: error.message,
      step: "Check logs above 👆"
    });
  }
};

exports.updateBlogs = async (req, res) => {
  try{
    const { id }  =req.params;
    const updateData = {...req.body};
    if(req.file){
      updateData.image = req.file.path
    }
    const data = await Blog.findByIdAndUpdate(id, updateData, {new: true});
    res.json(data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

// DELETE blog + Cloudinary image
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // 🔥 Delete image from Cloudinary
    if (blog.imagePublicId) {
      await cloudinary.uploader.destroy(blog.imagePublicId);
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({ message: "Blog and image deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting blog" });
  }
};