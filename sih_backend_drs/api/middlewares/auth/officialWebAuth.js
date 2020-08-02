const jwt = require("jsonwebtoken");
const { OfficialUserModel } = require("../../models/officialUser");
async function officialWebAuth(req, res, next) {
    token = req.header("x-official-token");
    if (!token)
        return res.status(401).send("access denied, token not provided");
    token = token.split(" ")[1];
    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            console.log(token);
            return res.status(400).json({ error: "invalid/expired token" });
        }
        let user = await OfficialUserModel.findById(decoded.id);
        if (!user) return res.status(400).json({ error: "invalid user" });
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ error: "invalid token/token might be expired" });
    }
}

module.exports.officialWebAuth = officialWebAuth;
