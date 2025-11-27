'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { Howl } from 'howler';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import clsx from 'clsx';

type Assignment = {
  [team: string]: string;
  title: string;
};

// Pastel / glow colors for assignments
const TITLE_COLORS: Record<string, { bg: string; text: string }> = {
  Plate: { bg: 'bg-green-400/30', text: 'text-white' },
  Bowl: { bg: 'bg-blue-400/30', text: 'text-white' },
  Shield: { bg: 'bg-orange-400/30', text: 'text-white' },
  'Cup Final': { bg: 'bg-purple-400/30', text: 'text-white' },
};

// Coin flip sound
const COIN_SOUND = new Howl({ src: ['/sounds/coin_flip.mp3'] });

export default function TeamFlipTossPage() {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [title, setTitle] = useState('Plate');
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [history, setHistory] = useState<Assignment[]>([]);
  const [flipping, setFlipping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Client-only effects
  useEffect(() => {
    // Load localStorage
    const saved = localStorage.getItem('matchHistory');
    if (saved) setHistory(JSON.parse(saved));

    // Window size
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Save history
    localStorage.setItem('matchHistory', JSON.stringify(history));
  }, [history]);

  const tossTeams = () => {
    if (!team1.trim() || !team2.trim()) return alert('කරුණාකර දෙපාර්ශ්වයේම නම ඇතුළත් කරන්න!');
    setFlipping(true);
    setAssignment(null);
    COIN_SOUND.play();

    setTimeout(() => {
      const roles = ['යෝජක', 'ප්‍රතියෝජක'];
      const shuffledRoles = roles.sort(() => Math.random() - 0.5);
      const result: Assignment = { [team1]: shuffledRoles[0], [team2]: shuffledRoles[1], title };
      setAssignment(result);
      setHistory((prev) => [result, ...prev].slice(0, 20));
      setFlipping(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }, 2000);
  };

  const reset = () => {
    setTeam1('');
    setTeam2('');
    setTitle('Plate');
    setAssignment(null);
    setFlipping(false);
    setShowConfetti(false);
  };

  return (
    <main
      className="min-h-screen p-6 flex flex-col md:flex-row gap-6 font-sans relative"
      style={{
        backgroundImage: 'url("https://cdn.pixabay.com/photo/2021/09/05/08/39/pastel-6591986_1280.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={400} />}

      {/* Left Panel */}
      <Card className="flex-1 p-6 backdrop-blur-lg bg-white/20 rounded-3xl shadow-xl hover:shadow-neon transition-shadow duration-300 flex flex-col gap-6">
        {/* Logo + Titles */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <img src="/logo.png" alt="Association Logo" className="w-24 h-24 object-contain rounded-full shadow-lg" />
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center">
            මහනුවර ආදි විවාදකයන්ගේ සංගමය
          </h2>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center drop-shadow-lg">
            මැදරට කුසලාන අවසන් මහා තරග
          </h1>
        </div>

        <CardContent className="flex flex-col gap-4">
          <Input placeholder="Team 1" value={team1} onChange={(e) => setTeam1(e.target.value)} />
          <Input placeholder="Team 2" value={team2} onChange={(e) => setTeam2(e.target.value)} />

          <Select value={title} onValueChange={setTitle}>
            <SelectTrigger><SelectValue placeholder="Tournament Title" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Plate">Plate</SelectItem>
              <SelectItem value="Bowl">Bowl</SelectItem>
              <SelectItem value="Shield">Shield</SelectItem>
              <SelectItem value="Cup Final">Cup Final</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-4 justify-center mt-2">
            <Button className="bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 shadow-neon" onClick={tossTeams}>
              Flip Toss
            </Button>
            <Button variant="secondary" onClick={reset}>Reset</Button>
          </div>
        </CardContent>

        {/* Coin Flip Animation */}
        {flipping && (
          <div className="flex justify-center gap-6 mt-4">
            {[team1 || 'Team 1', team2 || 'Team 2'].map((team) => (
              <div key={team} className="relative w-32 h-32">
                <motion.img
                  src="/coin.png"
                  alt="Coin Flip"
                  className="w-full h-full object-contain"
                  animate={{ rotateY: [0, 180, 360, 540, 720], y: [0, -20, -40, -20, 0], scale: [1,1.1,1,1.1,1] }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
                <span className="absolute bottom-[-1.5rem] w-full text-center font-bold text-gray-800">{team}</span>
              </div>
            ))}
          </div>
        )}

        {/* Assignment Result */}
        {assignment && !flipping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-2">
            {Object.entries(assignment).filter(([k]) => k !== 'title').map(([team, role]) => {
              const colors = TITLE_COLORS[assignment.title] || { bg: 'bg-gray-400', text: 'text-white' };
              return (
                <div key={team} className={clsx(colors.bg, colors.text, 'p-2 rounded-lg flex justify-between font-bold text-lg shadow-md hover:shadow-neon transition-shadow duration-300')}>
                  <span>{team}</span>
                  <span>{role}</span>
                </div>
              );
            })}
          </motion.div>
        )}
      </Card>

      {/* Right Panel: History */}
      <Card className="md:w-80 overflow-y-auto max-h-[80vh] backdrop-blur-lg bg-white/20 shadow-xl hover:shadow-neon transition-shadow duration-300 sticky top-6">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Previous Matches</h2>
          {history.length === 0 ? (
            <div className="text-gray-700 text-center py-4">No previous matches.</div>
          ) : (
            history.map((h, i) => (
              <div key={i} className="mb-2 p-2 rounded bg-white/20 shadow hover:shadow-neon transition-shadow duration-300">
                <div className="font-semibold">{h.title}</div>
                {Object.entries(h).filter(([k]) => k !== 'title').map(([team, role]) => (
                  <div key={team} className="flex justify-between">{team}: {role}</div>
                ))}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <style jsx>{`
        .shadow-neon {
          box-shadow: 0 0 15px 3px rgba(255, 0, 255, 0.5);
        }
      `}</style>
    </main>
  );
}
