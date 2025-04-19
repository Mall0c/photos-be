import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { jwtData } from 'index';

export function loggedIn(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['x-auth-token'] as string;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Verify and decode the token
    jwt.verify(token, "SECRET", (err, decoded: jwtData) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Add the decoded user information to the request object
        req.userData = decoded;
        next();
    });
}

export function isOwner(userData: jwtData) {
    return userData.role === 0
}

export function isAdmin(userData: jwtData) {
    return userData.role === 1
}

export function isAdminOrOwner(userData: jwtData) {
    return isOwner(userData) || isAdmin(userData)
}