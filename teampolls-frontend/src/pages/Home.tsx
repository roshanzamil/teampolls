import { useEffect, useState } from 'react';
import axios from 'axios';
import PollCard from '../components/PollCard';


const API_URL = 'http://localhost:4000';

interface Poll {
  id: number;
  question: string;
  options: string[];
  
}

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([]);

  const fetchPolls = async () => {
    const res = await axios.get(`${API_URL}/polls`);
    setPolls(res.data.reverse());

  };

  useEffect(() => {
    fetchPolls();

    const ws = new WebSocket('ws://localhost:4001');
    ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.newPoll) {
            setPolls((prev) => [...prev, data.newPoll]);
          }
        } catch (err) {
          console.error('❌ Error parsing WebSocket message:', err);
        }
      };
      
    return () => ws.close();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📋 Active Polls</h1>
      {polls.length === 0 ? (
        <p>No polls available. Be the first to create one!</p>

        
      ) : (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {polls.map((poll) => (
    <PollCard key={poll.id} id={poll.id} question={poll.question} />
  ))}
</div>
      )}
    </div>
  );
}
