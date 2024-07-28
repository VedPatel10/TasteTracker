'use client';
import { useEffect, useState } from 'react';
import { useSession, useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

// icons
// npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faRefresh } from '@fortawesome/free-solid-svg-icons';


export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useUser();
  const { session } = useSession();
  const [formError, setFormError] = useState('');

  const [isChecked, setIsChecked] = useState(false)

  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        global: {
          fetch: async (url, options = {}) => {
            const clerkToken = await session?.getToken({
              template: 'supabase',
            });

            const headers = new Headers(options?.headers);
            headers.set('Authorization', `Bearer ${clerkToken}`);

            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
      }
    );
  }

  const client = createClerkSupabaseClient();

  const loadTasks = async () => {
    if (!user) return
    setLoading(true);
    const { data, error } = await client.from('tasks').select().eq('user_id', user.id);
    if (error) {
      console.log('Error loading tasks:', error);
    } else {
      setTasks(data);
    }
    setLoading(false);
  };

  async function createTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name || !description) {
      setFormError('Please fill in all fields');
      return;
    }
    if (!user) return

    const { error } = await client.from('tasks').insert([{ name, description, user_id: user.id, public: isChecked }]);

    if (error) {
      console.error('Error creating task:', error);
    } else {
      setName('');
      setDescription('');
      setFormError('');
      loadTasks();
    }
  }

  // remember you need to add policy in supabase!!!
  const handleDelete = async (id: number) => {
    const response = await client.from('tasks').delete().eq('id', id)
    if (response.error) {
      console.error('Error deleting task:', response.error);
    } else {
      loadTasks(); // Refresh the task list after deletion
    }
  }

  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked)
  }

  useEffect(() => {
    if (!user) return;
    loadTasks();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>

          <div className='flex flex-row gap-3'>
            <h2 className="text-2xl font-semibold mb-4">My Recipes</h2>
            {user && <button className="pb-3" onClick={loadTasks}><FontAwesomeIcon icon={faRefresh} /></button>}
          </div>

          {!user && <p>Sign in to start saving recipes!</p>}
          {user && loading && <p>Loading...</p>}

          {!loading && tasks.length === 0 && <p>No recipes found.</p>}
          {!loading && tasks.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {tasks.map((task: any) => (
                <div key={task.id} className="bg-white shadow-md rounded-lg p-4">
                  <h3 className="text-lg font-semibold break-words whitespace-pre-wrap overflow-hidden">{task.name}</h3>
                  <p className='text-sm break-words whitespace-pre-wrap overflow-hidden'>{task.description}</p>
                  <button onClick={() => handleDelete(task.id)} className="text-grey-100 hover:text-grey-700 focus:outline-none"><FontAwesomeIcon icon={faTrash} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Add Recipe</h2>
          <form onSubmit={createTask} className="bg-white shadow-md rounded-lg p-6">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                id="floating_name"
                className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-blue-600 focus:outline-none peer "
                placeholder=" "
                required
              />
              <label htmlFor="floating_name" className="peer-focus:font-medium absolute text-sm text-gray-500 text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Recipe Title
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <textarea
                autoFocus
                name="description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                id="floating_description"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-black border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer resize-none"
                placeholder=" "
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Description
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                checked={isChecked}
                onChange={handleCheckboxToggle}
                id="checkbox-1"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="checkbox-1" className="ms-2 text-sm font-medium text-gray-700">
                Post to Global Recipes
              </label>
            </div>

            {user && (
              <button
                type="submit"
                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Add Recipe
              </button>
            )}
            {formError && <p className="text-red-500 mt-2">{formError}</p>}
          </form>

        </div>
      </div>
    </div>
  );
}