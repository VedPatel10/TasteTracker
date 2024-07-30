'use client'

import Image from "next/image";
import Link from "next/link";
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const { user } = useUser();

  return (
    <main className=" flex flex-col items-center p-6 bg-white">
      <div className="mt-12">
        <img src="../images/TTBG.png" alt="Cooking Illustration" width={100} height={100} />
      </div>
      <div className="text-center max-w-2xl">


        <h2 className="text-3xl font-semibold mb-4">
          Discover, Store, and Share Your Favorite Recipes
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Easily manage your recipes, whether you're a culinary expert or just starting out. Create recipes and share them with the world, or keep them private.
        </p>
        <p className="text-lg text-gray-700 mb-8">
          Join our community to explore a wide variety of global recipes and get inspired by what others are cooking.
        </p>
        <div className="flex justify-center space-x-4">
          {user && (
            <>
              <Link href="/my-recipes" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-3 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                My Recipes
              </Link>
              <Link href="/global-recipes" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-3 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Global Recipes
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
