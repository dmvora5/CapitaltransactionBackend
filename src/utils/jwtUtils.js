const jwt = require('jsonwebtoken');


const signJwt = ({ payload, secret, expire }) => {
    return jwt.sign(payload, secret, {
        expiresIn: expire,
        // algorithm: 'RS256'
    })
};

const verifyJwt = ({ token, secret }) => {
    try {
        console.log('token', token)
        return jwt.verify(token, secret)
    } catch (error) {
        console.log('error', error)
        return null;
    }
};

const getAccessToken = (user) => {
    return signJwt({
        payload: {
            _id: user._id,
            email: user.email,
            userName: user.userName,
            roles: user.roles
        },
        secret: process.env.ACCESS_TOKEN_SECRET,
        expire: process.env.ACCESS_TOKEN_EXPIRETION
    });
}

const getRefreshToken = (user) => {
    return signJwt({
        payload: {
            _id: user._id,
            email: user.email,
            userName: user.userName,
            roles: user.roles
        },
        secret: process.env.REFRESH_TOKEN_SECRET,
        expire: process.env.REFRESH_TOKEN_EXPIRETION
    })
}

module.exports = {
    signJwt,
    verifyJwt,
    getAccessToken,
    getRefreshToken
}