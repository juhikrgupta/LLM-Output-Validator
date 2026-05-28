type Props = {
  data: any;
};

export default function ResponseCard({
  data,
}: Props) {

  return (

    <div className="mt-6">

      {data?.success ? (

        <div className="bg-green-950 border border-green-500 rounded-xl p-5">

          <h2 className="text-green-400 text-2xl font-bold mb-4">
            ✅ Valid Output
          </h2>

          <pre className="bg-black p-4 rounded-lg overflow-auto text-sm text-green-300">

            {JSON.stringify(
              data.data,
              null,
              2
            )}

          </pre>

        </div>

      ) : (

        <div className="bg-red-950 border border-red-500 rounded-xl p-5">

          <h2 className="text-red-400 text-2xl font-bold mb-4">
            ❌ Validation Error
          </h2>

          <pre className="bg-black p-4 rounded-lg overflow-auto text-sm text-red-300">

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