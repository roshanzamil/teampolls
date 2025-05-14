import { useState } from 'react';
import axios from 'axios';

export default function PollCreator() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['']);
  const [expiresAt, setExpiresAt] = useState('');

  const addOption = () => setOptions([...options, '']);
  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async () => {
    await axios.post('http://localhost:4000/poll', { question, options, expiresAt });
    alert('Poll Created!');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Create a New Poll</h2>
      <input 
        className="border p-2 mb-2 w-full" 
        placeholder="Poll Question" 
        value={question} 
        onChange={(e) => setQuestion(e.target.value)} 
      />
      {options.map((opt, idx) => (
        <input 
          key={idx} 
          className="border p-2 mb-2 w-full" 
          placeholder={`Option ${idx + 1}`} 
          value={opt} 
          onChange={(e) => handleOptionChange(idx, e.target.value)} 
        />
      ))}
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addOption}>Add Option</button>
      <input 
        type="datetime-local" 
        className="border p-2 my-2 w-full" 
        value={expiresAt} 
        onChange={(e) => setExpiresAt(e.target.value)} 
      />
      <button className="bg-green-500 text-white px-4 py-2 mt-4 rounded" onClick={handleSubmit}>Create Poll</button>
    </div>
  );
}
