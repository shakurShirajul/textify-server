import jwt, { decode } from 'jsonwebtoken'
const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res
            .status(401)
            .send({
                message: "Unauthorized"
            })
    }
    jwt.verifyToken(token, process.env.ACCESS_TOKEN_SECRET, (err, decoed) => {
        if (err) {
            return res
                .status(401)
                .send({
                    message: "Unauthorized"
                })
        }
        req.user = decoed;
        next();
    })
}

export default verifyToken;