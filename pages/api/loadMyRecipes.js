import clientPromise from '../../app/lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('Cluster0'); 

  if (req.method === 'POST') {
    const { user_id } = req.body;
    const recipes = await db.collection('recipes').find({"user_id": user_id}).toArray();
    res.status(200).json(recipes);
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
