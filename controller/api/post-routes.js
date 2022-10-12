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
//edit a post
router.put("/:id", withAuth, async(req, res) => {
    try {
        const [affectedRows] = await Post.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        if(affectedRows > 0){
            res.status(200).json({ message: "Post updated successfully!"})
        } else {
            res.status(404).json({message: "post not found"})
        }
    } catch(err) {
        res.status(500).json(err)
    }
})

