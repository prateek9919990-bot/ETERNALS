const express = require("express");
const upload = require("../middlewares/upload");
const router = express.Router();

const {
  getBlogs,
  createBlog,
  updateBlogs,
  deleteBlog
} = require("../controllers/blogController");

// ✅ GET all blogs
router.get("/", getBlogs);

// ✅ CREATE blog (FIXED)
router.post("/", upload.single("image"), createBlog);

router.put('/:id', upload.single("image"), updateBlogs);

// ✅ DELETE blog
router.delete("/:id", deleteBlog);

module.exports = router;