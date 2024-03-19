const { redisInstance } = require("../config/connectDb");
const { signJwt, getAccessToken, getRefreshToken } = require("../utils/jwtUtils")

exports.signToken = async (user) => {
    const access_token = getAccessToken(user)
    const refresh_token = getRefreshToken(user)
    // redisInstance.set(user._id, JSON.stringify(user), {
    //     EX: 60 * 60
    // })

    return { access_token, refresh_token }
}