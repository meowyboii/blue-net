import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen ">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4">Welcome to Blue Net</h1>
      <p className="text-lg mb-8">A social media app</p>
      <p className="text-gray-600">Your social media experience redefined.</p>
    </div>
  );
}
