const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Post, Comment} = require('../models');


        router.get("/", async (req, res) => {
            try {
                let postData = await Post.findAll({
                    include: [{
                        model: Comment,
                        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                        include: {
                            model: User,
                            attributes: ['username']
                        }
                    },
                    {
                        model: User,
                        attributes: ['username']
                    }
                ]
                })
        
               
                const posts = postData.map((post) => post.get({ plain: true }));
                res.render("dashboard", { posts, loggedIn: req.session.loggedIn })
              
        
            } catch (err) {
                res.status(500).json(err)
            }
        })

        