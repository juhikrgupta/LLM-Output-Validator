"use client";

type Props = {
  data: any;
};

export default function ResponseCard({
  data,
}: Props) {

  async function handleCopy() {

    const textToCopy =
      JSON.stringify(
        data.data ||
        data.errors ||
        data.message,
        null,
        2
      );

    await navigator.clipboard.writeText(
      textToCopy
    );
  }

  return (

    <div className="mt-6">

      {data?.success ? (

        <div className="bg-green-950 border border-green-500 rounded-xl p-5 shadow-lg">

          <div className="flex items-center justify-between mb-4">

            <h2 className="text-green-400 text-2xl font-bold">
              ✅ Valid Output
            </h2>

            <button

              onClick={handleCopy}

              className="bg-green-500 hover:bg-green-600 transition px-4 py-2 rounded-lg text-black font-semibold text-sm"
            >
              Copy JSON
            </button>

          </div>

          <div className="space-y-2 mb-5 text-sm">

            <p>
              <span className="font-bold text-yellow-300">
                Attempts:
              </span>{" "}
              {data.attempts}
            </p>

            <p>
              <span className="font-bold text-yellow-300">
                Correction Needed:
              </span>{" "}

              {data.correctionNeeded
                ? "Yes"
                : "No"}
            </p>

            <p>
              <span className="font-bold text-yellow-300">
                Latency:
              </span>{" "}
              {data.latency}
            </p>

          </div>

          <pre className="bg-black p-4 rounded-lg overflow-auto text-sm text-green-300 border border-green-800">

            {JSON.stringify(
              data.data,
              null,
              2
            )}

          </pre>

        </div>

      ) : (

        <div className="bg-red-950 border border-red-500 rounded-xl p-5 shadow-lg">

          <div className="flex items-center justify-between mb-4">

            <h2 className="text-red-400 text-2xl font-bold">
              ❌ Validation Error
            </h2>

            <button

              onClick={handleCopy}

              className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg text-white font-semibold text-sm"
            >
              Copy Error
            </button>

          </div>

          <div className="space-y-2 mb-5 text-sm">

            <p>
              <span className="font-bold text-yellow-300">
                Attempts:
              </span>{" "}
              {data.attempts}
            </p>

            <p>
              <span className="font-bold text-yellow-300">
                Correction Needed:
              </span>{" "}

              {data.correctionNeeded
                ? "Yes"
                : "No"}
            </p>

            <p>
              <span className="font-bold text-yellow-300">
                Latency:
              </span>{" "}
              {data.latency}
            </p>

          </div>

          <pre className="bg-black p-4 rounded-lg overflow-auto text-sm text-red-300 border border-red-800">

            {JSON.stringify(
              data.errors ||
              data.message,
              null,
              2
            )}

          </pre>

        </div>
      )}

    </div>
  );
}