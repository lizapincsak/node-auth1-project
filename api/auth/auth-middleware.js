const {findBy } = require("../users/users-model")

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  if(req.session.user){
    next()
  } else {
    next({message: 'You shall not pass!', status: 401 })
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
const checkUsernameFree = async (req, res, next) => {
  try{
    const existing = await findBy({username: req.body.username})
    if(existing.length >= 1){
      next({
        status: 422,
        message: "Username taken"
      })
    } else {
      next()
    }
  }
  catch(err){
    next(err)
  }
}
/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists(req, res, next) {
  if(req.body.password){
    next()
  } else {
    next({
      status: 401, 
      message: 'Invalid credentials'
    })
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  if(!req.body.password || req.body.password < 3){
    next({
      status: 422,
      message: 'Password must be longer than 3 chars'
    })
  } else {
    next()
  }
}

module.exports = {
  restricted, checkUsernameFree, checkPasswordLength, checkUsernameExists
}