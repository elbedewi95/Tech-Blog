const router = require("express").Router();
const { Post } = require("../../models");
const withAuth = require("../../utils/auth");


//create new post
router.post("/", withAuth, async(req, res) => {
    try {
        const addNewPost = await Post.create({ ...body, userId: req.session.userId})
        res.status(200).json(addNewPost)
    } 
    catch(err) {
        res.status(500).json(err)
    }
})

