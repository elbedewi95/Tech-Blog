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

        router.get('/edit/:id', async (req, res) => {
            try{
            
            let onePost = await Post.findOne({
                    where: {
                        id: req.params.id
                    },
                    attributes: [
                        'id',
                        'title',
                        'content',
                        'created_at'
                    ],
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
                if (!onePost) {
                    res.status(404).json({
                        message: 'Uh Oh! This post does not exist!'
                    });
                    return;
                }

                const post = onePost.get({plain: true});
    
                res.render('edit-post', {
                    post,
                    loggedIn: req.session.loggedIn 
                });}
                catch(err){
                    res.status(500).json(err)
                }
            });

            router.get('/new', (req, res) => {
                res.render('add-post', {
                    loggedIn: req.session.loggedIn 
                })
            })
            
            module.exports = router;