

import { dark } from '@clerk/themes';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
 return (
    <header className="flex justify-between p-4 px-8 w-full border-b border-stone-200/20 mb-4">
      {/* Logo section */}
      <div className="block md:flex items-center justify-center gap-3 cursor-pointer">
        <Link href="/"><Image src="/pdf-chat.png" alt="PDF Chat logo" width="150" height="75" /></Link>
       
        <div>
        <span className="text-sm text-orange-100/70">Developed by <a className="hover:text-green-300/50" href="https://www.linkedin.com/in/rajea-bilal/" target="_blank" rel="noopener noreferrer">Rajea Bilal</a></span>
      </div>
      </div>

      
      {/* User section */}
      <div className="flex space-x-4 justify-center items-center ">
        <SignedIn >
          <UserButton 
          appearance={{
            baseTheme: dark,
            elements: {
              avatarBox: "w-14 h-14 rounded-full"
            }
          }} 
          afterSignOutUrl="/" 
          />
        </SignedIn>
          
          {/* when user is not signed in */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-green-300/60 border border-green-300/60 hover:text-white hover:bg-green-300/20 py-2 px-4 rounded-3xl transition duration-300 ease-in-out">Sign in</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-green-300/60 py-2 px-4 rounded-3xl transition duration-300 ease-in-out">Sign up</button>
          </SignUpButton>
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;