const router = require("express").Router();
const bcrypt = require('bcryptjs');
const { add, findBy } = require('../users/users-model');
const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require("./auth-middleware");

router.post('/register', checkPasswordLength, checkUsernameExists, checkUsernameFree, (req, res, next) => {
  const { username, password } = req.body

  const hash = bcrypt.hashSync(password, 8)

  add({username, password: hash})
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
})
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body

  const [user] = await findBy({ username })

  if(user && bcrypt.compareSync(password, user.password)){
    req.session.user = user
    res.json({message: `Welcome ${username}!`})
  } else {
    next({
      status: 401, 
      message: "Invalid credentials"
    })
  }
})

router.get('/logout', (req, res, next) => {
  if(req.session && req.session.user) {
    req.session.destroy(err => {
      if(err) {
        next({
          message: "no session", 
          status: 200
        })
      } else {
        res.status(200).json({message: "logged out"})
      }
    })
  } else {
    next({message: "no session"})
  }
})

module.exports = router;


/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

 
// Don't forget to add the router to the `exports` object so it can be required in other modules
