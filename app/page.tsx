"use client";

import { useState, useEffect } from "react";

import PromptBox from "../components/PromptBox";
import ResponseCard from "../components/ResponseCard";
import ErrorCard from "../components/ErrorCard";
import Loader from "../components/Loader";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchema, setSelectedSchema] =
  useState("user");

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();

      setHistory(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit() {
    try {
      setLoading(true);

      const res = await fetch("/api/call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          schema: selectedSchema,
}),
      });

      const data = await res.json();

      setResponse(data);

      // refresh history
      fetchHistory();

    } catch (error) {
      console.error(error);

      setResponse({
        success: false,
        message: "Something went wrong",
      });

    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold mb-3">
          LLM Output Validator
        </h1>
        <div className="mb-6">
          <ThemeToggle />
        </div>
        <p className="text-zinc-400 mb-8">
          Validate AI responses using Zod schemas.
        </p>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">

          <PromptBox
  prompt={prompt}
  setPrompt={setPrompt}
/>

<select
  value={selectedSchema}
  onChange={(e) =>
    setSelectedSchema(e.target.value)
  }
  className="mt-4 w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
>
  <option value="user">
    User Schema
  </option>

  <option value="product">
    Product Schema
  </option>

  <option value="employee">
    Employee Schema
  </option>
</select>

<button
  onClick={handleSubmit}
  className="mt-5 px-6 py-3 bg-yellow-200 text-black rounded-xl font-semibold hover:opacity-90"
>
  Validate Output
</button>
          {loading && <Loader />}

        </div>

        {/* Current Response */}

        {response && (
  <ResponseCard data={response} />
)}

        {/* Validation History */}

        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-4">
            Validation History
          </h2>

          <div className="space-y-4">

            <div className="mt-10">
  <h2 className="text-3xl font-bold mb-6">
    Validation History
  </h2>

  <div className="space-y-6">
    {history.map((item: any, index: number) => (
      <div
        key={index}
        className="border border-gray-700 rounded-xl p-5 bg-[#111]"
      >
        <p className="text-yellow-300 font-semibold mb-2">
          Prompt:
        </p>

        <p className="mb-4 text-gray-300">
          {item.prompt}
        </p>

        <p
          className={`font-bold mb-3 ${
            item.success
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {item.success
            ? "Valid Response"
            : "Validation Error"}
        </p>

        <pre className="bg-black p-4 rounded-lg overflow-x-auto text-sm text-green-300">
          {JSON.stringify(item.response, null, 2)}
        </pre>

        <p className="text-gray-500 text-sm mt-3">
          {new Date(item.createdAt).toLocaleString()}
        </p>
      </div>
    ))}
  </div>
</div>

          </div>

        </div>

      </div>
    </main>
  );
}