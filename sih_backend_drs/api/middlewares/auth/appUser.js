const jwt = require("jsonwebtoken");
const { appUserModel } = require("../../models/appUser");

async function appUserAuth(req, res, next) {
    const token = req.header("x-user-token").split(" ")[1];
    if (!token)
        return res.status(401).send("access denied, token not provided");
    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded)
            return res.status(400).json({ error: "invalid/expired token" });
        let user = await appUserModel.findOne({ phNo: decoded.phNo });

        if (!user) return res.status(400).json({ error: "invalid user" });
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
}

module.exports.appUserAuth = appUserAuth;
