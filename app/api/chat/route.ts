import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
})

export async function POST(req: Request, res: Response) {

  try {
      const { messages } = await req.json();
      console.log('Received messages:', messages);

  const response = await openai.chat.completions.create({
    model: "mistralai/mixtral-8x7b-instruct-v0.1",
    messages,
    stream: true,
    max_tokens: 1024,
  });

    if (!response) {
      throw new Error('No response from API');
    }

  console.log('Response:', response); 
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
  } catch(error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }

}