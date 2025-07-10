// types/next.d.ts
import { IncomingMessage } from 'http';
// No need to import NextApiRequest here when augmenting the module

declare module 'next' {
  /**
   * Extends the NextApiRequest interface to include the `file` property
   * that multer adds to the request object.
   */
  export interface NextApiRequest extends IncomingMessage {
    file?: Express.Multer.File;
  }
}
