const jwt = require("jsonwebtoken");

exports.auth = async(req, res, next) => {

    try {

        const token = req.cookies.token;

        console.log("token -> ", token);
        if (!token) {
            return res.status(400).json({
                success: false, 
                message: `user is not logged in`, 
            });
        }

        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

        console.log("decoded payload => ", decodedPayload);

        if (!decodedPayload) {
            return res.status(400).json({
                success: false, 
                message: `user is not logged in`, 
            });
        }

        req.user = decodedPayload;
        
        next();
          
    } catch(err) {
        console.log(err.message);
    }
}