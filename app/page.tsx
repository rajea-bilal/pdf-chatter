import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center p-24 text-center ">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-orange-100/95">
        Chat with Your PDFs using AI
      </h1>
      
      <p className="text-md md:text-lg lg:text-xl mb-8 text-stone-100/50 max-w-2xl">
        Upload any PDF and get instant, intelligent responses powered by NVIDIA NIM Mixtral-8x7B model. 
        Perfect for research, document analysis, and quick information retrieval.
      </p>

      <div className="space-y-4 mb-12">
        <SignedIn>
          <Link 
            href="/chat" 
            className="bg-green-300/40 text-stone-300 px-8 py-4 rounded-full hover:bg-green-300/60 inline-block shadow-md"
          >
            Start Chatting
          </Link>
        </SignedIn>
        
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-green-300/40 text-stone-300 px-8 py-4 rounded-full hover:bg-green-300/60 inline-block shadow-md">
              Get Started
            </button>
          </SignInButton>
        </SignedOut>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        <FeatureCard 
          title="Upload PDFs" 
          description="Simply drag and drop your PDF files"
        />
        <FeatureCard 
          title="Ask Questions" 
          description="Chat naturally with your documents"
        />
        <FeatureCard 
          title="Get Insights" 
          description="Receive AI-powered responses instantly"
        />
      </div>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-10 rounded-lg shadow-xl backdrop-blur-sm border border-stone-200/20">
      <h3 className="text-lg text-green-300/70 font-bold mb-2">{title}</h3>
      <p className="text-orange-50/95">{description}</p>
    </div>
  );
}
