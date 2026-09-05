const Blog = require("../models/Blog");
const { uploadBuffer, destroy } = require("../utils/cloudinaryUpload");

const slugify = (value = "") =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

// Guarantees uniqueness by appending -2, -3, ... when the base slug is taken.
const generateUniqueSlug = async (title, excludeId = null) => {
    const base = slugify(title) || "post";
    let slug = base;
    let suffix = 1;

    /* eslint-disable no-await-in-loop */
    while (true) {
        const filter = { slug };
        if (excludeId) filter._id = { $ne: excludeId };

        const existing = await Blog.findOne(filter).select("_id").lean();
        if (!existing) return slug;

        suffix += 1;
        slug = `${base}-${suffix}`;
    }
};

/* ---------------- Public ---------------- */

exports.getPublicBlogs = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));

        const filter = { status: "published" };

        const [blogs, total] = await Promise.all([
            Blog.find(filter)
                .select("title slug excerpt coverImage publishedAt createdAt")
                .sort({ publishedAt: -1, createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Blog.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            blogs,
            total,
            page,
            limit,
            pages: Math.max(1, Math.ceil(total / limit)),
        });
    } catch (error) {
        console.error("Get Public Blogs Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch blogs",
            error: error.message,
        });
    }
};

exports.getPublicBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            slug: req.params.slug,
            status: "published",
        }).lean();

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        return res.status(200).json({ success: true, blog });
    } catch (error) {
        console.error("Get Public Blog Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch blog",
            error: error.message,
        });
    }
};

/* ---------------- Admin ---------------- */

exports.getAdminBlogs = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
        const search = (req.query.search || "").trim();

        const filter = {};

        if (search) {
            const safe = search.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
            filter.$or = [
                { title: { $regex: safe, $options: "i" } },
                { slug: { $regex: safe, $options: "i" } },
            ];
        }

        const [blogs, total] = await Promise.all([
            Blog.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Blog.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            blogs,
            total,
            page,
            limit,
            pages: Math.max(1, Math.ceil(total / limit)),
        });
    } catch (error) {
        console.error("Get Admin Blogs Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch blogs",
            error: error.message,
        });
    }
};

exports.getAdminBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).lean();

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        return res.status(200).json({ success: true, blog });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        console.error("Get Admin Blog Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch blog",
            error: error.message,
        });
    }
};

exports.createBlog = async (req, res) => {
    try {
        const { title, content, excerpt, metaTitle, metaDescription, status } =
            req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required",
            });
        }

        let coverImage = { url: "", filename: "" };

        if (req.file) {
            try {
                const result = await uploadBuffer(req.file.buffer, {
                    folder: "lanka-ads/blogs",
                });

                coverImage = { url: result.secure_url, filename: result.public_id };
            } catch (uploadError) {
                console.error("Blog Cover Upload Error:", uploadError);

                return res.status(502).json({
                    success: false,
                    message: "Image upload failed. Please try again.",
                });
            }
        }

        const publishing = status === "published";

        const blog = await Blog.create({
            title,
            slug: await generateUniqueSlug(title),
            content,
            excerpt: excerpt || "",
            metaTitle: metaTitle || "",
            metaDescription: metaDescription || "",
            coverImage,
            status: publishing ? "published" : "draft",
            publishedAt: publishing ? new Date() : null,
        });

        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog,
        });
    } catch (error) {
        console.error("Create Blog Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create blog",
            error: error.message,
        });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        const { title, content, excerpt, metaTitle, metaDescription, status } =
            req.body;

        if (title && title !== blog.title) {
            blog.title = title;
            // Slug follows the title only while the post is still a draft —
            // once published, the URL stays put so existing links keep working.
            if (blog.status === "draft") {
                blog.slug = await generateUniqueSlug(title, blog._id);
            }
        }

        if (content !== undefined) blog.content = content;
        if (excerpt !== undefined) blog.excerpt = excerpt;
        if (metaTitle !== undefined) blog.metaTitle = metaTitle;
        if (metaDescription !== undefined) blog.metaDescription = metaDescription;

        if (status && ["draft", "published"].includes(status)) {
            if (status === "published" && blog.status !== "published") {
                blog.publishedAt = new Date();
            }
            blog.status = status;
        }

        if (req.file) {
            try {
                const result = await uploadBuffer(req.file.buffer, {
                    folder: "lanka-ads/blogs",
                });

                const oldPublicId = blog.coverImage?.filename;

                blog.coverImage = {
                    url: result.secure_url,
                    filename: result.public_id,
                };

                if (oldPublicId) {
                    try {
                        await destroy(oldPublicId);
                    } catch (destroyError) {
                        console.error("Blog Cover Destroy Error:", destroyError);
                    }
                }
            } catch (uploadError) {
                console.error("Blog Cover Upload Error:", uploadError);

                return res.status(502).json({
                    success: false,
                    message: "Image upload failed. Please try again.",
                });
            }
        }

        await blog.save();

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog,
        });
    } catch (error) {
        console.error("Update Blog Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update blog",
            error: error.message,
        });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        if (blog.coverImage?.filename) {
            try {
                await destroy(blog.coverImage.filename);
            } catch (destroyError) {
                console.error("Blog Cover Destroy Error:", destroyError);
            }
        }

        await blog.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (error) {
        console.error("Delete Blog Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete blog",
            error: error.message,
        });
    }
};
