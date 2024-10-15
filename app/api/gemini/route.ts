import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 确保在环境变量中设置了 API 密钥
const API_KEY = process.env.GEMINI_API_KEY;

// 初始化 Gemini API
const genAI = new GoogleGenerativeAI(API_KEY!);

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    // 使用 text-only 模型
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
