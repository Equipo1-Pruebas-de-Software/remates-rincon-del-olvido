import jwt from 'jsonwebtoken';

const authMiddleware = (role) => (req, res, next) => {
    const token = req.cookies.auth;

    if (!token) {
        return res.status(401).json({
            status: 'error',
            status_code: 401,
            message: 'Authentication token is missing'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if (role !== 'any' && decoded.role !== role) {
            return res.status(403).json({
                status: 'error',
                status_code: 403,
                message: 'Forbidden: Insufficient permissions'
            });
        }

        req.userid = decoded.userId;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            status: 'error',
            status_code: 401,
            message: 'Invalid authentication token'
        });
    }
};

export default authMiddleware;