'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useSession, useUser } from '@clerk/nextjs';

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileClipboard, faSearch } from '@fortawesome/free-solid-svg-icons';


export default function GlobalRecipesPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const [searchResult, setSearchResult] = useState('')

    const copyRecipe = async (name: String, description: String) => {
        if (!user) return

        const recipeData = {
            title: name,
            description: description,
            user_id: user.id,
            isGlobal: false
        }

        const response = await fetch('/api/copyRecipe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipeData)
        });

        const data = await response.json();
        return data;
    }

    const loadRecipes = async () => {
        if (!user) return
        setLoading(true);
    
        const response = await fetch('/api/loadGlobalRecipes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }   
        });
        const data = await response.json();
        setTasks(data);
        setLoading(false);
      }

    useEffect(() => {
        loadRecipes()
    }, []);

    return (
        <div className="container mx-auto p-6">

            <div className='flex flex-col items-center gap-6 mb-8'>
                <h2 className="text-3xl font-semibold ">Discover New Recipes</h2>

                <div className="relative z-0 w-full max-w-md group">
                    <input
                        type="text"
                        name="name"
                        onChange={(e) => setSearchResult(e.target.value)}
                        value={searchResult}
                        id="searchbar"
                        className="block pt-6 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-blue-600 focus:outline-none peer"
                        placeholder=" "
                        required
                        defaultValue=""
                    />
                    <label htmlFor="searchbar" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Search for Recipe
                    </label>
                </div>

                <button
                    title="Refresh Recipes"
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                    onClick={loadRecipes}>
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>

            {loading && <p text-align='center'>Loading...</p>}

            {!loading && tasks.length === 0 && <p>No recipes found.</p>}
            {
                !loading && tasks.length > 0 && (
                    <div className="grid grid-cols-4 gap-4">
                        {tasks.map((task: any) => (
                            <div key={task.id} className="bg-white shadow-md rounded-lg p-4">
                                <h3 key="title" className="text-lg font-semibold break-words whitespace-pre-wrap overflow-hidden">{task.title}</h3>
                                <p key="description" className='text-sm break-words whitespace-pre-wrap overflow-hidden'>{task.description}</p>
                                {/* only show copy button if user is singed in */}
                                {user && (<button title="Save to My Recipes" onClick={() => copyRecipe(task.title, task.description)} className=" hover:text-blue-700 focus:outline-none"><FontAwesomeIcon icon={faFileClipboard} /></button>)}
                            </div>
                        ))}
                    </div>
                )
            }
        </div >
    );
}