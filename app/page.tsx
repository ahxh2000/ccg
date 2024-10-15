'use client'
import { useState } from "react";

export default function Home() {
  const [courseContent, setCourseContent] = useState("");
  const [major, setMajor] = useState("医学信息工程");
  const [politicalElement, setPoliticalElement] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generatePoliticalElement = async () => {
    setIsLoading(true);
    try {
      const prompt = `你是一个高校老师，擅长根据学生的专业特点，把课程内容和时事热点相结合来挖掘课程思政的元素。以下是课程的内容：${courseContent}面向${major}专业的学生，请你列出相关的课程思政的元素。`;
      
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setPoliticalElement(data.content);
    } catch (error) {
      console.error('Error:', error);
      setPoliticalElement("生成思政元素时出错，请稍后再试。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">课程思政元素生成器</h1>
        
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows={4}
          placeholder="请输入课程内容，例如：.NET概念，介绍C#语言和.NET Framework."
          value={courseContent}
          onChange={(e) => setCourseContent(e.target.value)}
        />
        
        <select
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
        >
          <option value="医学信息工程">医学信息工程</option>
          <option value="生物医学工程">生物医学工程</option>
        </select>
        
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          onClick={generatePoliticalElement}
          disabled={isLoading}
        >
          {isLoading ? '生成中...' : '生成思政元素'}
        </button>
        
        {politicalElement && (
          <div className="mt-6 p-4 border border-gray-300 rounded">
            <h2 className="text-xl font-semibold mb-2">生成的思政元素：</h2>
            <pre className="whitespace-pre-wrap">{politicalElement}</pre>
          </div>
        )}
      </main>
    </div>
  );
}
