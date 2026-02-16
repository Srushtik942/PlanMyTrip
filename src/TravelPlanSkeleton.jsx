
export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className="border-4 border-orange-500 border-t-white rounded-full w-12 h-12 animate-spin"></div>
      <p className="mt-4 text-white font-semibold">{text}</p>
    </div>
  );
}
