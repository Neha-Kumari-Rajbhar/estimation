const express=require('express')
const router=express.Router()
const {body}=require('express-validator')//for validating data
const userController=require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/register',[
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
    body('email').isEmail().withMessage("Invalid email"),
    body('password').isLength({min:6}).withMessage('Password must be atleast 6 characters long'),
],
userController.registerUser
)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 character')
],
userController.loginUser
)


//logout
router.get('/logout',authMiddleware.authUser,userController.logoutUser)

// router.get('/search',authMiddleware.authUser,userController.getUserprofile)
module.exports=router