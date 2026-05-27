type Props = {
  data: any;
};

export default function ResponseCard({ data }: Props) {
  return (
    <div className="bg-zinc-900 border border-green-700 rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-bold text-green-400 mb-4">
        Valid Response
      </h2>

      <pre className="text-green-300 overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}