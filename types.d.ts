import { User } from "@prisma/client"; // Import your User type

// interface User  {
//   userId: string;
//   email: string;
// };

declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      // Add other properties that your User model contains
    }

    interface Request {
      user?: User; // Make sure to include this line to attach User to the Request object
    }
  }
}
