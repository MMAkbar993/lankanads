const express = require("express");

const {
    getAdminBlogs,
    getAdminBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
} = require("../controllers/blogController");

const { protectAdmin } = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Same wrapper pattern as adRoutes.js so a bad upload returns a clean 400
// instead of bubbling out of multer as an unhandled error.
const uploadCoverImage = (req, res, next) => {
    upload.single("coverImage")(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Image upload failed",
                error: error.message,
            });
        }

        next();
    });
};

router.use(protectAdmin);

router.get("/", getAdminBlogs);
router.post("/", uploadCoverImage, createBlog);
router.get("/:id", getAdminBlogById);
router.patch("/:id", uploadCoverImage, updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
