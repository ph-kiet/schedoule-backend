import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
    let token
    let authHeader = req.headers.Authorization || req.headers.authorization

    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1]

        if(!token){
            res.status(401).json({message: "No token, authorization 1 denied"})
        }

        try{ 
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode
            next()
        }catch(err){
            res.status(403).json({message: "Token is not valid!"})
        }
    }else{
        res.status(401).json({message: "No token, authorization 2 denied"})
    }
}

export default verifyToken