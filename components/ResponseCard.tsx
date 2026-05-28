type Props = {
  data: any;
};

export default function ResponseCard({ data }: Props) {

  return (
    <div className="mt-6">

      {/* VALID OUTPUT */}
      {data?.success && (

        <div className="bg-green-950 border border-green-500 rounded-xl p-5">

          <h2 className="text-green-400 text-2xl font-bold mb-4">
            ✅ Valid Output
          </h2>

          <pre className="bg-black p-4 rounded-lg overflow-auto text-sm text-green-300 whitespace-pre-wrap">
            {JSON.stringify(
              data?.data || data?.correctedData,
              null,
              2
            )}
          </pre>

        </div>
      )}

      {/* VALIDATION ERROR */}
      {!data?.success && data?.errors && (

        <div className="bg-red-950 border border-red-500 rounded-xl p-5">

          <h2 className="text-red-400 text-2xl font-bold mb-4">
            ❌ Validation Error
          </h2>

          <div className="space-y-3">

            {data.errors.map((err: any, index: number) => (

              <div
                key={index}
                className="bg-black p-3 rounded-lg text-white"
              >

                <p>
                  <span className="text-red-400 font-semibold">
                    Field:
                  </span>{" "}
                  {err.field}
                </p>

                <p>
                  <span className="text-red-400 font-semibold">
                    Message:
                  </span>{" "}
                  {err.message}
                </p>

                {err.expected && (
                  <p>
                    <span className="text-red-400 font-semibold">
                      Expected:
                    </span>{" "}
                    {err.expected}
                  </p>
                )}

              </div>
            ))}

          </div>

        </div>
      )}

      {/* METRICS SECTION */}

      {data?.metrics && (

        <div className="mt-6 bg-zinc-900 border border-zinc-700 rounded-xl p-5">

          <h2 className="text-yellow-300 text-2xl font-bold mb-4">
            📊 Metrics
          </h2>

          <div className="space-y-2 text-white">

            <p>
              <span className="font-semibold text-yellow-200">
                Attempts:
              </span>{" "}
              {data.metrics.attempts}
            </p>

            <p>
              <span className="font-semibold text-yellow-200">
                Latency:
              </span>{" "}
              {data.metrics.latency} ms
            </p>

            <p>
              <span className="font-semibold text-yellow-200">
                Correction Needed:
              </span>{" "}
              {data.metrics.correctionNeeded
                ? "Yes"
                : "No"}
            </p>

            <p>
              <span className="font-semibold text-yellow-200">
                Status:
              </span>{" "}
              {data.metrics.status}
            </p>

          </div>

        </div>
      )}

    </div>
  );
}