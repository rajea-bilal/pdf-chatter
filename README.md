# PDF Chat App 📚

Chat with your PDF documents using NVIDIA's NIM API and the powerful Mixtral-8x7B AI model.

## Features 🌟

- **PDF Processing**: Upload and extract text from any PDF document
- **AI Chat**: Interact with your documents using the Mixtral-8x7B model
- **Real-time Responses**: Stream responses as they're generated
- **Secure Authentication**: User accounts via Clerk

## How to Use 🚀

1. **Sign In**: Create an account or sign in using Clerk authentication
2. **Upload**: Drop your PDF or click to upload
3. **Chat**: Ask questions about your document content
4. **Get Insights**: Receive accurate responses powered by Mixtral-8x7B

## Technical Stack 💻

- Next.js 13+
- NVIDIA NIM API with `mixtral-8x7b-instruct-v0.1` model
- Clerk Authentication
- Tailwind CSS
- Vercel Deployment

## Setup 🛠️

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables: `cp .env.example .env`
4. Run the development server: `npm run dev`

## Create .env.local with:
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
- CLERK_SECRET_KEY=your_key
- NVIDIA_API_KEY=your_key

Open [http://localhost:3000](http://localhost:3000) to start chatting with your PDFs!

Happy coding! 🚀

Made with ❤️ by Rajea Bilal