import clientPromise from '../../app/lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('Cluster0'); 

  if (req.method === 'GET') {
    const recipes = await db.collection('recipes').find({"isGlobal": true}).toArray();
    res.status(200).json(recipes);
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
