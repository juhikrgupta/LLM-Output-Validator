"use client";

import {
  useState,
  useEffect,
} from "react";

import PromptBox
from "@/components/PromptBox";

import ResponseCard
from "@/components/ResponseCard";

import Loader
from "@/components/Loader";

import ThemeToggle
from "@/components/ThemeToggle";

export default function Home() {

  const [prompt, setPrompt] =
    useState("");

  const [response, setResponse] =
    useState<any>(null);

  const [history, setHistory] =
    useState<any[]>([]);

  const [selectedHistory,
  setSelectedHistory] =
    useState<string[]>([]);

  const [metrics, setMetrics] =
  useState<any>(null);
  

  const [failures, setFailures] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [selectedSchema,
    setSelectedSchema] =
      useState("user");
  
  const [strategy,
  setStrategy] =
    useState("json");

  const tips = [

  "LLMs often generate invalid JSON when prompts are ambiguous.",

  "Validation middleware prevents malformed AI outputs from breaking applications.",

  "Retry correction improves structured output reliability significantly.",

  "Few-shot prompting can improve first-attempt validation success.",

  "Schema enforcement is critical in production AI systems.",

  "Nested objects and enums are among the hardest outputs for LLMs to generate correctly.",
];

const [randomTip] =
  useState(

    tips[
      Math.floor(
        Math.random() *
        tips.length
      )
    ]
  );

  useEffect(() => {

    fetchHistory();

    fetchFailures();
    fetchMetrics();

  }, []);

 async function fetchHistory() {

  try {

    const res =
      await fetch("/api/history");

    const data =
      await res.json();

    if (Array.isArray(data)) {

      setHistory(data);

    } else {

      setHistory([]);
    }

  } catch (error) {

    console.error(error);

    setHistory([]);
  }
}

  async function fetchFailures() {

    try {

      const res =
        await fetch("/api/failures");

      const data =
        await res.json();

      setFailures(
        data.failures || []
      );

    } catch (error) {

      console.error(error);
    }
  }

  async function fetchMetrics() {

  try {

    const res =
      await fetch("/api/metrics");

    const data =
      await res.json();

    setMetrics(data);

  } catch (error) {

    console.error(error);
  }
}

  async function deleteSelected() {

  try {

    await fetch("/api/history", {

      method: "DELETE",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({

        ids:
          selectedHistory,
      }),
    });

    setSelectedHistory([]);

    fetchHistory();

  } catch (error) {

    console.error(error);
  }
}


  async function handleSubmit() {

    try {

      setLoading(true);

      const res =
        await fetch("/api/call", {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            prompt,

            schema:
              selectedSchema,
            strategy:
              strategy,
          }),
        });

      const data =
        await res.json();

      setResponse(data);

      fetchHistory();

      fetchFailures();
      fetchMetrics();

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  }

  return (

    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white p-10">

      <div className="max-w-4xl mx-auto">
      
      <div className="mb-8 bg-[#111] border border-gray-700 rounded-xl p-5 shadow-lg">

  <h2 className="text-xl font-bold text-yellow-300 mb-3">
    AI Reliability Tip
  </h2>

  <p className="text-gray-300 leading-relaxed">

    {randomTip}

  </p>

</div>

        <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-yellow-300 via-pink-400 to-blue-400 bg-clip-text text-transparent">

  LLM Output Validator

</h1>

<p className="text-gray-400 mb-6 text-lg">

  Reliable AI Output Validation Middleware

</p>

        <div className="mb-6">
          <ThemeToggle />
        </div>

        <PromptBox
          prompt={prompt}
          setPrompt={setPrompt}
        />

        <select

          value={selectedSchema}

          onChange={(e) =>
            setSelectedSchema(
              e.target.value
            )
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

        <select

  value={strategy}

  onChange={(e) =>
    setStrategy(
      e.target.value
    )
  }

  className="mt-4 w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
>

  <option value="json">
    JSON Instruction Strategy
  </option>

  <option value="fewshot">
    Few-Shot Example Strategy
  </option>

</select>

        <div className="mt-5 bg-[#111] border border-gray-700 rounded-xl p-5 hover:scale-105 hover:shadow-2xl transition duration-300">

  <h2 className="text-2xl font-bold text-yellow-300 mb-4">
    Schema Preview
  </h2>

  <pre className="text-sm text-green-300 overflow-x-auto">

{selectedSchema === "user" && `
{
  "name": "string",
  "age": "number",
  "email": "string",
  "skills": ["string"]
}
`}

{selectedSchema === "product" && `
{
  "productName": "string",
  "price": "number",
  "category": "string",
  "inStock": "boolean"
}
`}

{selectedSchema === "employee" && `
{
  "name": "string",
  "age": "number",
  "department": "string",
  "salary": "number",
  "isActive": "boolean"
}
`}

  </pre>

</div>

        <button

          onClick={handleSubmit}

          className="mt-5 px-6 py-3 bg-yellow-300 text-black rounded-xl font-bold"
        >
          Validate Output
        </button>

        {loading && <Loader />}

        {response && (
          <ResponseCard data={response} />
        )}
        {metrics && (

  <div className="mt-10">

    <h2 className="text-3xl font-bold mb-6">
      Metrics Dashboard
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div className="bg-[#111] border border-gray-700 rounded-xl p-5 hover:scale-105 hover:shadow-2xl transition duration-300">
        <p className="text-gray-400">
          Total Validations
        </p>

        <h3 className="text-4xl font-bold text-yellow-300 mt-2">
          {metrics.total}
        </h3>
      </div>

      <div className="bg-[#111] border border-gray-700 rounded-xl p-5 hover:scale-105 hover:shadow-2xl transition duration-300">
        <p className="text-gray-400">
          Success Rate
        </p>

        <h3 className="text-4xl font-bold text-green-400 mt-2">
          {metrics.successRate}%
        </h3>
      </div>

      <div className="bg-[#111] border border-gray-700 rounded-xl p-5 hover:scale-105 hover:shadow-2xl transition duration-300">
        <p className="text-gray-400">
          Failures
        </p>

        <h3 className="text-4xl font-bold text-red-400 mt-2">
          {metrics.failureCount}
        </h3>
      </div>

      <div className="bg-[#111] border border-gray-700 rounded-xl p-5 hover:scale-105 hover:shadow-2xl transition duration-300">
        <p className="text-gray-400">
          Auto Corrections
        </p>

        <h3 className="text-4xl font-bold text-blue-400 mt-2">
          {metrics.correctionCount}
        </h3>
      </div>

     <div className="bg-[#111] border border-gray-700 rounded-xl p-5 hover:scale-105 hover:shadow-2xl transition duration-300">
        <p className="text-gray-400">
          Average Latency
        </p>

        <h3 className="text-4xl font-bold text-pink-400 mt-2">
          {metrics.averageLatency}
        </h3>
      </div>

    </div>

  </div>
)}
        {/* VALIDATION HISTORY */}

        <div className="mt-10">

<div className="flex items-center justify-between mb-6">

  <h2 className="text-3xl font-bold">
    Validation History
  </h2>

  {selectedHistory.length > 0 && (

    <button

      onClick={deleteSelected}

      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-semibold"
    >
      Delete Selected
    </button>
  )}

</div>

          <div className="space-y-6">

            {history.map(
              (
                item: any,
                index: number
              ) => (

 <div

  key={index}

  className="border border-gray-700 rounded-xl p-5 bg-[#111]"
>

  <div className="flex justify-end mb-3">

    <input

      type="checkbox"

      checked={selectedHistory.includes(
        item._id
      )}

      onChange={(e) => {

        if (e.target.checked) {

          setSelectedHistory([
            ...selectedHistory,
            item._id,
          ]);

        } else {

          setSelectedHistory(

            selectedHistory.filter(
              (id) =>
                id !== item._id
            )
          );
        }
      }}

      className="w-5 h-5"
    />

  </div>
                  <div className="space-y-2 mb-4">

                    <p>
                      <span className="text-yellow-300 font-semibold">
                        Prompt:
                      </span>{" "}
                      {item.prompt}
                    </p>

                    <p>
                      <span className="text-yellow-300 font-semibold">
                        Schema:
                      </span>{" "}
                      {item.schema}
                    </p>

                    <p>
                      <span className="text-yellow-300 font-semibold">
                        Status:
                      </span>{" "}

                      {item.success
                        ? "✅ Success"
                        : "❌ Failed"}
                    </p>

                    <p>
                      <span className="text-yellow-300 font-semibold">
                        Attempts:
                      </span>{" "}
                      {item.attempts}
                    </p>

                    <p>
                      <span className="text-yellow-300 font-semibold">
                        Correction Needed:
                      </span>{" "}

                      {item.correctionNeeded
                        ? "Yes"
                        : "No"}
                    </p>

                    <p>
                      <span className="text-yellow-300 font-semibold">
                        Latency:
                      </span>{" "}
                      {item.latency}
                    </p>

                  </div>

                  <pre className="bg-black p-4 rounded-lg overflow-x-auto text-sm text-green-300">

                    {JSON.stringify(
                      item.response,
                      null,
                      2
                    )}

                  </pre>

                </div>
              )
            )}

          </div>

        </div>

        {/* FAILURE ANALYSIS */}

        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-6 text-red-400">
            Failure Analysis
          </h2>

          <div className="space-y-6">

            {failures.map(
              (
                item: any,
                index: number
              ) => (

                <div

                  key={index}

                  className="border border-red-500 rounded-xl p-5 bg-red-950"
                >

                  <p className="text-yellow-300 font-semibold mb-2">
                    Prompt:
                  </p>

                  <p className="mb-4 text-white">
                    {item.prompt}
                  </p>

                  <pre className="bg-black p-4 rounded-lg overflow-x-auto text-sm text-red-300">

                    {JSON.stringify(
                      item.response,
                      null,
                      2
                    )}

                  </pre>

                </div>
              )
            )}

          </div>

        </div>

      </div>

    </main>
  );
}