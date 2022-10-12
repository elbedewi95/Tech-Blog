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
                res.render("homepage", { posts, loggedIn: req.session.loggedIn })
              
        
            } catch (err) {
                res.status(500).json(err)
            }
        })

        router.get('/post/:id', async (req, res) => {
            try{

           let onePost= await Post.findOne({
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
                        message: 'No post found with this id'
                    });
                    return;
                }
    
                const post = onePost.get({plain: true});
    
                res.render('single-post', {
                    post,
                    loggedIn: req.session.loggedIn
                });
            }
            catch(err){
                res.status(500).json(err)
            }
            });
    
            //redirect to homepage if logged in
            router.get('/login', (req, res) => {
                if (req.session.loggedIn) {
                    res.redirect('/');
                    return;
                }
            
                res.render('login');
            });
            
            //redirect to homepage after signup
            router.get('/signup', (req, res) => {
                if (req.session.loggedIn) {
                    res.redirect('/');
                    return;
                }
            
                res.render('signup');
            });
            
            
            router.get('*', (req, res) => {
                res.status(404).send("Oops!! What brings you here? It's Empty!");
                
            })
            
            
            module.exports = router;