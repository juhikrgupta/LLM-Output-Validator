export default function Loader() {

  return (

    <div className="mt-6 flex items-center gap-3 text-yellow-300 font-semibold text-lg">

      <div className="flex gap-1">

        <div className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce"></div>

        <div className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce delay-150"></div>

        <div className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce delay-300"></div>

      </div>

      <span className="animate-pulse">
        Validating AI Output...
      </span>

    </div>
  );
}