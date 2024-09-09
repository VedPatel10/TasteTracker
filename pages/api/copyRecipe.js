import clientPromise from '../../app/lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('Cluster0'); 

  if (req.method === 'POST') {
    const { title, description, user_id, isGlobal } = req.body;
    const recipe = {
      title,
      description,
      user_id,
      isGlobal,
      createdAt: new Date(),
    };
    const result = await db.collection('recipes').insertOne(recipe);
    res.status(201).json(result);
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
