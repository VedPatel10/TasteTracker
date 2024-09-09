import clientPromise from '../../app/lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('Cluster0'); 

  if (req.method === 'PUT') {
    const { title, description, user_id } = req.body;
    const result = await db.collection('recipes').deleteOne( {"title":title, "description": description, "user_id": user_id} )
    res.status(201).json(result);
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
