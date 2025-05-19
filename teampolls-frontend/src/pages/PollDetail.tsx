import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const API_URL = 'http://localhost:4000';
const COLORS = ['#4DB6AC', '#FFB300', '#FF6384', '#36A2EB', '#9966FF'];

export default function PollDetail() {
  const { id } = useParams();
  const [poll, setPoll] = useState<any>(null);
  const [votes, setVotes] = useState<any>({});
  const [selectedOption, setSelectedOption] = useState('');
  const [prediction, setPrediction] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const fetchPoll = async () => {
    try {
      const res = await axios.get(`${API_URL}/poll/${id}`);
      setPoll(res.data);
      setVotes(res.data.tally);
    } catch (error) {
      console.error('Failed to fetch poll data', error);
    }
  };

  const fetchPrediction = async () => {
    const res = await axios.get(`${API_URL}/poll/${id}/predict`);
    setPrediction(res.data.prediction);
  };

  

  useEffect(() => {
    const init = async () => {
      if (!localStorage.getItem('token')) {
        const res = await axios.post(`${API_URL}/auth/anon`);
        localStorage.setItem('token', res.data.token);
      }
  
      await fetchPoll();
      await fetchPrediction();
  
      const ws = new WebSocket('ws://localhost:4001');
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.voteUpdate && data.voteUpdate.pollId === parseInt(id || '')) {
            fetchPoll();
            fetchPrediction();
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };
  
      return () => ws.close();
    };
  
    init();
  }, [id]);
  

  const handleVote = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/poll/${id}/vote`, 
        { option: selectedOption }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedOption('');
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        const res = await axios.post(`${API_URL}/auth/anon`);
        localStorage.setItem('token', res.data.token);
      } else {
        console.error('Failed to cast vote', error);
      }
    }
  };
  

  const chartData = poll?.options.map((opt: string) => ({
    name: opt,
    value: votes[opt] || 0,
  }));

  return (
<div className="rounded-[20px] w-[450px] bg-[#393939] p-[30px] justify-self-center">

      <h1 className="text-2xl font-bold mb-4">{poll?.question}</h1>

      <div className="space-y-2">
        {poll?.options.map((opt: string) => (
          <label key={opt} className="block">
            <input
              type="radio"
              name="pollOption"
              value={opt}
              checked={selectedOption === opt}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="mr-2"
            />
            {opt}
          </label>
        ))}
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={handleVote}
        disabled={!selectedOption}
      >
        Vote
      </button>

      <h2 className="text-xl font-bold mt-8 mb-4">📊 Live Results</h2>
      {chartData && (
        <PieChart width={400} height={300}>
          <Pie
            dataKey="value"
            isAnimationActive
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {chartData.map((_, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            {prediction && (
  <div className="mt-4 p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-lg animate-pulse">
    🔮 <strong>AI Predicts:</strong> {prediction}
  </div>
)}

          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
        
      )}

    {prediction && (
      <div className="mt-4 p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-lg animate-pulse">
        🔮 <strong>AI Predicts:</strong> {prediction}
      </div>
    )}

{showCelebration && (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    exit={{ scale: 0 }}
    transition={{ duration: 0.5 }}
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-0 z-50"
    onClick={() => setShowCelebration(false)}
  >
    <div className="text-white text-4xl animate-bounce">
      🎉🎉 Vote Submitted! 🎉🎉
    </div>
  </motion.div>
)}
    </div>
  );
}
