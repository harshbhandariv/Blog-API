const User = require('../model/user');

async function searchUser(username) {
    try {
        const result = await User.findOne({ username }).select("-email -posts -followers -following").exec();
        return result;
    }
    catch (err) {
        return err;
    }
}

async function getFollowing(username, pageNumber) {
    try {
        const result = await User
            .findOne({ username })
            .select("following")
            .populate({
                path: "following",
                limit: process.env.LIMITS,
                skip: ((pageNumber - 1) * process.env.LIMITS),
                select: "-email -posts -followers -following"
            })
            .exec();
        return result;
    } catch (error) {
        return error;
    }
}

async function getFollowers(username, pageNumber) {
    try {
        const result = await User
            .findOne({ username })
            .select("followers")
            .populate({
                path: "followers",
                limit: process.env.LIMITS,
                skip: ((pageNumber - 1) * process.env.LIMITS),
                select: "-email -posts -followers -following"
            })
            .exec();
        return result;
    } catch (error) {
        return error;
    }
}

async function addFollower(user1, user2) {
    try {
        const result1 = await User.findOne({ username: user1 }).exec();
        const result2 = await User.findOne({ username: user2 }).exec();
        result1.following.push(result2._id);
        result1.followingCount++;
        result2.followers.push(result1._id);
        result2.followerCount++;
        await result1.save();
        await result2.save();
        return ({
            "message": "Following done successfully"
        });
    } catch (error) {
        return error;
    }
}

async function unfollow(user1, user2) {
    try {
        const result1 = await User.findOne({ username: user1 }).exec();
        const result2 = await User.findOne({ username: user2 }).exec();
        var index = result1.following.indexOf(result2._id);
        if (index > -1) {
            result1.following.splice(index, 1);
            result1.followingCount--;
        }
        index = result2.followers.indexOf(result1._id);
        if (index > -1) {
            result2.followers.splice(index, 1);
            result2.followerCount--;
        }
        await result1.save();
        await result2.save();
        return ({
            "message": "Unfollow done successfully"
        });
    } catch (error) {
        return error;
    }
}

async function removeFollower(user1, user2) {
    try {
        const result1 = await User.findOne({ username: user1 }).exec();
        const result2 = await User.findOne({ username: user2 }).exec();
        if (!result1.followers.includes(result2._id)) return { message: "Not possible" };
        var index = result2.following.indexOf(result1._id);
        if (index > -1) {
            result2.following.splice(index, 1);
            result2.followingCount--;
        }
        index = result1.followers.indexOf(result2._id);
        if (index > -1) {
            result1.followers.splice(index, 1);
            result1.followerCount--;
        }
        await result1.save();
        await result2.save();
        return ({
            "message": "Removed follower"
        });
    } catch (error) {
        return error;
    }
}

module.exports = { searchUser, getFollowing, getFollowers, addFollower, unfollow, removeFollower };