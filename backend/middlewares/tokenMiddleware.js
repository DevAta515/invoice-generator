const jwt = require("jsonwebtoken")

function tokenMiddleware=(req, res, next) => {
    let authHeader = req.headers.authorization;
    const [bear, code] = authHeader.split(" ");
    if (bear != "Bearer" || !authHeader) {
        return res.status(403).json({
            msg: "Invalid"
        })
    }
    try {
        const decoded = jwt.verify(code, process.env.JWT_SECRET);
        // console.log(decoded);
        next();

    }
    catch (err) {
        return res.status(403).json({
            msg: "here error"
        })
    }
}