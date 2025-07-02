// pages/api/comments.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type Comment = { commentId: string; userId: string; username: string; text: string; timestamp: number; parentId: string | null };
type CommentsDB = { [articleId: string]: Comment[] };

const COMMENTS_PATH = path.join(process.cwd(), 'data', 'comments.json');

const readCommentsFile = (): CommentsDB => {
  try {
    if (!fs.existsSync(COMMENTS_PATH)) return {};
    const data = fs.readFileSync(COMMENTS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch { return {}; }
};

const writeCommentsFile = (data: CommentsDB) => {
  fs.writeFileSync(COMMENTS_PATH, JSON.stringify(data, null, 2));
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { articleId } = req.query;
    if (!articleId || typeof articleId !== 'string') return res.status(400).json({ message: 'articleId diperlukan.' });

    const comments = readCommentsFile();
    const articleComments = comments[articleId] || [];
    return res.status(200).json(articleComments);
  }

  if (req.method === 'POST') {
    const { articleId, userId, username, text, parentId } = req.body;
    if (!articleId || !userId || !username || !text) return res.status(400).json({ message: 'Data komentar tidak lengkap.' });

    const comments = readCommentsFile();
    const articleComments = comments[articleId] || [];
   const newComment: Comment = { commentId: Date.now().toString(), userId, username, text, timestamp: Date.now(), parentId: parentId || null };
    articleComments.unshift(newComment);
    comments[articleId] = articleComments;
    writeCommentsFile(comments);

    return res.status(201).json(newComment);
  }

  res.setHeader('Allow', ['GET', 'POST']).status(405).end();
}