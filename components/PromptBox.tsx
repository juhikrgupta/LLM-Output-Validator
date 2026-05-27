type Props = {
  prompt: string;
  setPrompt: (value: string) => void;
};

export default function PromptBox({
  prompt,
  setPrompt,
}: Props) {
  return (
    <textarea
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      placeholder="Enter your prompt..."
      className="w-full h-40 p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white outline-none"
    />
  );
}