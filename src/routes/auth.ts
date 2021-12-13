import { Request, Response, NextFunction } from 'express';

//Simple validation of the secure token
export const checkSecurityToken = (req: Request, res: Response, next: NextFunction) => {
  const token = <string>req.headers['auth'];
  if (token !== '12345') {
    res.status(401).send();
    return;
  }
  next();
};
