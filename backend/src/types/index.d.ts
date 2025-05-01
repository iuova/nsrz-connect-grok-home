import { User } from '../../models/user'; // or define the shape inline if you don't have a User type

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}
