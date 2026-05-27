type ErrorType = {
  success: boolean;
  message?: string;
  errors?: {
    field?: string;
    message: string;
    expected?: string;
    received?: string;
  }[];
};

export default function ErrorCard({
  error,
}: {
  error: ErrorType;
}) {
  return (
    <div className="mt-6 border border-red-500 bg-red-500/10 p-4 rounded-xl">
      <h2 className="text-red-400 font-bold text-xl mb-2">
        Validation Error
      </h2>

      {error.message && (
        <p className="text-red-300 mb-2">{error.message}</p>
      )}

      {error.errors?.map((err, index) => (
        <div
          key={index}
          className="mb-3 border-b border-red-400/20 pb-2"
        >
          <p>
            <span className="font-semibold">Field:</span>{" "}
            {err.field}
          </p>

          <p>
            <span className="font-semibold">Message:</span>{" "}
            {err.message}
          </p>

          {err.expected && (
            <p>
              <span className="font-semibold">Expected:</span>{" "}
              {err.expected}
            </p>
          )}

          {err.received && (
            <p>
              <span className="font-semibold">Received:</span>{" "}
              {err.received}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}