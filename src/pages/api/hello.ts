import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Handle the request based on the HTTP method

    switch (req.method) {
        case 'GET':
            // Handle GET requests
            res.status(200).json({ message: 'Hello from Next.js!' });
            break;
        case 'POST':
            // Handle POST requests
            const data = req.body;
            // ... process data and respond
            res.status(200).json({ message: 'Posted to Next.js!' });
            break;
        default:
            res.status(405).json({ error: 'Method not allowed' });
    }
}