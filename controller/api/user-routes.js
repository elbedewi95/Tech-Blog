const router = require("express").Router()
const { User } = require("../../models");


// Get all users
router.get('/', async (req, res) => {
    try{
        let allUsers =  User.findAll({
            attributes: {
                exclude: ['password']
            }
        })
        res.json(allUsers)
    }

   catch(err) {
        res.status(500).json(err)
    }
});

//create new user
router.post("/", async(req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            password: req.body.password
        });
        req.session.save(() => {
            req.session.userId = newUser.id;
            req.session.username = newUser.username;
            req.session.loggedIn = true;
            res.json(newUser);
        })
       
    } catch(err) {
        res.status(500).json(err)
    }
})
//user login
router.post("/login", async(req, res) => {
    try {
        const oneUser = await User.findOne({
            where: {
                username: req.body.username
            }
        });
        if(!oneUser) {
            res.status(400).json({ message: 'This username does not exist!'})
            return
        }

        const isValidPassword = oneUser.checkPassword(req.body.password);

        if(!isValidPassword) {
            res.status(400).json({ message: "Hmm! seems like you got the wrong password, try again!"})
            return
        }

        req.session.save(() => {
            req.session.userId = oneUser.id;
            req.session.username = oneUser.username;
            req.session.logginIn = true;

            res.status(200).json({ oneUser, message: "Login successful!"})
        })
    } catch(err) {
        res.status(400).json({ message : "Can't find this account!"})
    }
})

//user logout

router.post("/logout", async(req, res) => {
    if(req.session.loggedIn){
        req.session.destroy(() => {
            res.status(204).end()
        })
    } else {
        res.status(404).end()
    }
})

module.exports = router;