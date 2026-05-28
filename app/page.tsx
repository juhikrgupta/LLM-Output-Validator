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

  const [failures, setFailures] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [selectedSchema,
    setSelectedSchema] =
      useState("user");

  useEffect(() => {

    fetchHistory();

    fetchFailures();

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
          }),
        });

      const data =
        await res.json();

      setResponse(data);

      fetchHistory();

      fetchFailures();

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  }

  return (

    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white p-10">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold mb-4">
          LLM Output Validator
        </h1>

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

        {/* VALIDATION HISTORY */}

        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-6">
            Validation History
          </h2>

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