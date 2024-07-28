import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs'

import Link from 'next/link'
// import Image from 'images/TT.png'

const navbar = () => {
    return (
        <nav className="border-gray-200 bg-green-500 mb-5">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="../images/TTWHITE.png" className="h-8" alt="Flowbite Logo" border-gray-200 bg-green-500 mb-5 />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">TASTETRACKER</span>
                </a>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 pt-2" id="navbar-user">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-green-500 border-gray-700">
                        <li>
                            <Link href="/" className="text-white hover:text-gray-300">Home</Link>
                        </li>
                        <li>
                            <Link href="/my-recipes" className="text-white hover:text-gray-300">My Recipes</Link>
                        </li>
                        <li>
                            <Link href="/global-recipes" className="text-white hover:text-gray-300">Global Recipes</Link>
                        </li>
                        <li>
                            <SignedOut>
                                <div className="text-black bg-white hover:bg-gradient-to-br focus:ring-3 focus:outline-none font-medium rounded px-5 text-center me-2 mb-2" >
                                    <SignInButton />
                                </div>
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
export default navbar