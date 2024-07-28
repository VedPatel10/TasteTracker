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
    const { session } = useSession();

    const [searchResult, setSearchResult] = useState('')

    // when creating client, if logged in, use clerk token and supabase info, otherwise, just use supabase info
    function createClerkSupabaseClient() {
        if (user) {
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
        } else {
            return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!)
        }
    }

    const client = createClerkSupabaseClient();

    const handleCopy = async (name: string, description: string) => {
        if (!user) return
        const { error } = await client.from('tasks').insert([{ name, description, user_id: user.id, public: false }])
        if (error) {
            console.error('Error creating task:', error);
        }
    }

    const loadTasks = async () => {
        setLoading(true)

        if (searchResult == '') {
            const { data, error } = await client
                .from('tasks')
                .select()
                .eq('public', 'TRUE')
            // console.log(data)
            // console.log("post")

            if (error) {
                console.log('Error loading tasks:', error);
            } else {
                setTasks(data);
                setLoading(false)
            }
        } else {
            const { data, error } = await client
                .from('tasks')
                .select()
                .eq('public', 'TRUE')
                .textSearch('name', searchResult)

            if (error) {
                console.log('Error loading tasks:', error);
            } else {
                setTasks(data);
                setLoading(false)
            }

        }

    };

    useEffect(() => {
        loadTasks()
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
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                    onClick={loadTasks}>
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
                                <h3 className="text-lg font-semibold break-words whitespace-pre-wrap overflow-hidden">{task.name}</h3>
                                <p className='text-sm break-words whitespace-pre-wrap overflow-hidden'>{task.description}</p>
                                {/* only show copy button if user is singed in */}
                                {user && (<button onClick={() => handleCopy(task.name, task.description)} className=" hover:text-blue-700 focus:outline-none"><FontAwesomeIcon icon={faFileClipboard} /></button>)}
                            </div>
                        ))}
                    </div>
                )
            }
        </div >
    );
}