const router = require("express").Router()
const Users = require('../users/users-model');
const { restricted } = require('../auth/auth-middleware.js');

router.get('/', restricted, (req, res, next) => {
  Users.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      res.status(401).json({message: "You shall not pass!"})
    })
})

module.exports = router;


/**
  [GET] /api/users

  This endpoint is RESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
 */
