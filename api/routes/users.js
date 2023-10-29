const User = require ("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin){
        if (req.body.password){
            try {
                //updating account with new password
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } 
            catch (err){
                return res.status(500).json(err);
            }
        }
        try {
            //search for user profile and update it however intended
            const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body});
            res.status(200).json("Account has been updated");
        } 
        catch (err){
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can only update your account!");
    }
})

//delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin){
        try {
            //search for user profile and delete it
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted successfully");
        } 
        catch (err){
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can only delete your account!");
    }
});

//get a user
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;

    try {
        const user = userId 
            ? await User.findById(userId) 
            : await User.findOne({username:username});
        const {password, updatedAt, isAdmin, createdAt, ...other} = user._doc
        //fetch(get) only the necessary information, excluding 'password', 'isAdmin' etc
        res.status(200).json(other)
    }
    catch (err) {
        res.status(500).json(err)
    }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
    try{
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map((friendId)=>{
                return User.findById(friendId);
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const {_id, username, profilePicture} = friend;
            friendList.push({_id, username, profilePicture});
        });
        res.status(200).json(friendList);
    } catch(err) {
        res.status(500).json(err);
    }
})

//follow a user
//the id is that of the person you want to follow
router.put("/:id/follow", async (req, res) =>{
    if (req.body.userId !== req.params.id){
        try {
            //currentUser is trying to follow user
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //if statement checks to see if currentUser is already following user
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers: req.body.userId}});
                await currentUser.updateOne({$push:{followings: req.params.id}});
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("you already follow this user");
            }
        }
        catch (err) {
            res.status(500).json(err)
        }
    }
    else {
        res.status(403).json("you can't follow yourself.")
    }
});

//unfollow a user
//the id is that of the person you want to unfollow
router.put("/:id/unfollow", async (req, res) =>{
    if (req.body.userId !== req.params.id){
        try {
            //currentUser is trying to unfollow user
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //if statement checks to see if currentUser is already following user
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers: req.body.userId}});
                await currentUser.updateOne({$pull:{followings: req.params.id}});
                res.status(200).json("user has been unfollowed");
            } else {
                res.status(403).json("you are not following this user");
            }
        }
        catch (err) {
            res.status(500).json(err)
        }
    }
    else {
        res.status(403).json("you are not following yourself.")
    }
});

//this test works: to get list of users' followings. For the rightbar follow button
router.get("/followings/:userId", async (req, res) => {
    try{
        const user = await User.findById(req.params.userId);
        const followingsIds = user.followings;
        res.status(200).json(followingsIds);
    } catch(err) {
        res.status(500).json(err);
    }
})
//test

module.exports = router