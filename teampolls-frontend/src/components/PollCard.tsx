import AnimatedButton from './AnimatedButton';

interface PollCardProps {
    question: string;
    id: number;
  }
  
  export default function PollCard({ question, id }: PollCardProps) {
    return (
      <div className="p-4 border rounded-md shadow-md my-2 bg-white">
        <h2 className="text-lg font-semibold text-black">{question}</h2>
        <AnimatedButton id={id} />


      </div>
    );
  }
  