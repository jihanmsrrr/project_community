// pages/api/likes.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type LikesDB = { [articleId: string]: string[] };
const LIKES_PATH = path.join(process.cwd(), 'data', 'likes.json');

const readLikesFile = (): LikesDB => {
  try {
    if (!fs.existsSync(LIKES_PATH)) return {};
    const data = fs.readFileSync(LIKES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch { return {}; }
};

const writeLikesFile = (data: LikesDB) => {
  fs.writeFileSync(LIKES_PATH, JSON.stringify(data, null, 2));
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { articleId, userId } = req.method === 'GET' ? req.query : req.body;
  if (!articleId || typeof articleId !== 'string') return res.status(400).json({ message: 'articleId diperlukan.' });
  
  const likes = readLikesFile();
  const articleLikes = likes[articleId] || [];

  if (req.method === 'GET') {
    const currentUserLiked = userId ? articleLikes.includes(userId as string) : false;
    return res.status(200).json({ likeCount: articleLikes.length, isLiked: currentUserLiked });
  }

  if (req.method === 'POST') {
    if (!userId) return res.status(400).json({ message: 'userId diperlukan.' });
    const userIndex = articleLikes.indexOf(userId);

    if (userIndex > -1) {
      articleLikes.splice(userIndex, 1); // Unlike
    } else {
      articleLikes.push(userId); // Like
    }
    likes[articleId] = articleLikes;
    writeLikesFile(likes);
    return res.status(200).json({ success: true, likeCount: articleLikes.length });
  }
  
  res.setHeader('Allow', ['GET', 'POST']).status(405).end();
}