export default function Header() {
    return (
      <header className="p-4 bg-gray-800 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">TeamPolls</h1>
        <nav className="space-x-4">
          <a href="/" className="hover:underline">Home</a>
          <a href="/create" className="hover:underline">Create Poll</a>
        </nav>
      </header>
    );
  }
  