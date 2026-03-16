import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Home, LayoutGrid, BarChart2, User, Check, X, Play, Flame, Camera, Upload } from 'lucide-react';

type KanaEntry = {
  kana: string;
  romaji: string;
};

const hiraganaBank: KanaEntry[] = [
  { kana: 'あ', romaji: 'a' }, { kana: 'い', romaji: 'i' }, { kana: 'う', romaji: 'u' }, { kana: 'え', romaji: 'e' }, { kana: 'お', romaji: 'o' },
  { kana: 'か', romaji: 'ka' }, { kana: 'き', romaji: 'ki' }, { kana: 'く', romaji: 'ku' }, { kana: 'け', romaji: 'ke' }, { kana: 'こ', romaji: 'ko' },
  { kana: 'さ', romaji: 'sa' }, { kana: 'し', romaji: 'shi' }, { kana: 'す', romaji: 'su' }, { kana: 'せ', romaji: 'se' }, { kana: 'そ', romaji: 'so' },
  { kana: 'た', romaji: 'ta' }, { kana: 'ち', romaji: 'chi' }, { kana: 'つ', romaji: 'tsu' }, { kana: 'て', romaji: 'te' }, { kana: 'と', romaji: 'to' },
  { kana: 'な', romaji: 'na' }, { kana: 'に', romaji: 'ni' }, { kana: 'ぬ', romaji: 'nu' }, { kana: 'ね', romaji: 'ne' }, { kana: 'の', romaji: 'no' },
  { kana: 'は', romaji: 'ha' }, { kana: 'ひ', romaji: 'hi' }, { kana: 'ふ', romaji: 'fu' }, { kana: 'へ', romaji: 'he' }, { kana: 'ほ', romaji: 'ho' },
  { kana: 'ま', romaji: 'ma' }, { kana: 'み', romaji: 'mi' }, { kana: 'む', romaji: 'mu' }, { kana: 'め', romaji: 'me' }, { kana: 'も', romaji: 'mo' },
  { kana: 'や', romaji: 'ya' }, { kana: 'ゆ', romaji: 'yu' }, { kana: 'よ', romaji: 'yo' },
  { kana: 'ら', romaji: 'ra' }, { kana: 'り', romaji: 'ri' }, { kana: 'る', romaji: 'ru' }, { kana: 'れ', romaji: 're' }, { kana: 'ろ', romaji: 'ro' },
  { kana: 'わ', romaji: 'wa' }, { kana: 'を', romaji: 'wo' },
  { kana: 'ん', romaji: 'n' }
];

const katakanaBank: KanaEntry[] = [
  { kana: 'ア', romaji: 'a' }, { kana: 'イ', romaji: 'i' }, { kana: 'ウ', romaji: 'u' }, { kana: 'エ', romaji: 'e' }, { kana: 'オ', romaji: 'o' },
  { kana: 'カ', romaji: 'ka' }, { kana: 'キ', romaji: 'ki' }, { kana: 'ク', romaji: 'ku' }, { kana: 'ケ', romaji: 'ke' }, { kana: 'コ', romaji: 'ko' },
  { kana: 'サ', romaji: 'sa' }, { kana: 'シ', romaji: 'shi' }, { kana: 'ス', romaji: 'su' }, { kana: 'セ', romaji: 'se' }, { kana: 'ソ', romaji: 'so' },
  { kana: 'タ', romaji: 'ta' }, { kana: 'チ', romaji: 'chi' }, { kana: 'ツ', romaji: 'tsu' }, { kana: 'テ', romaji: 'te' }, { kana: 'ト', romaji: 'to' },
  { kana: 'ナ', romaji: 'na' }, { kana: 'ニ', romaji: 'ni' }, { kana: 'ヌ', romaji: 'nu' }, { kana: 'ネ', romaji: 'ne' }, { kana: 'ノ', romaji: 'no' },
  { kana: 'ハ', romaji: 'ha' }, { kana: 'ヒ', romaji: 'hi' }, { kana: 'フ', romaji: 'fu' }, { kana: 'ヘ', romaji: 'he' }, { kana: 'ホ', romaji: 'ho' },
  { kana: 'マ', romaji: 'ma' }, { kana: 'ミ', romaji: 'mi' }, { kana: 'ム', romaji: 'mu' }, { kana: 'メ', romaji: 'me' }, { kana: 'モ', romaji: 'mo' },
  { kana: 'ヤ', romaji: 'ya' }, { kana: 'ユ', romaji: 'yu' }, { kana: 'ヨ', romaji: 'yo' },
  { kana: 'ラ', romaji: 'ra' }, { kana: 'リ', romaji: 'ri' }, { kana: 'ル', romaji: 'ru' }, { kana: 'レ', romaji: 're' }, { kana: 'ロ', romaji: 'ro' },
  { kana: 'ワ', romaji: 'wa' }, { kana: 'ヲ', romaji: 'wo' },
  { kana: 'ン', romaji: 'n' }
];

let audioCtx: AudioContext | null = null;

const playSound = (type: 'correct' | 'incorrect') => {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.3);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.3);
    }
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

type QuestionType = 'kanaToRomaji' | 'romajiToKana';

type Question = {
  type: QuestionType;
  answer: KanaEntry;
  options: string[];
};

export default function App() {
  const [mode, setMode] = useState<'hiragana' | 'katakana' | 'mixed' | null>(null);
  const [tab, setTab] = useState<'home' | 'profile'>('home');
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [firstName, setFirstName] = useState(() => localStorage.getItem('kana_first_name') || 'Student');
  const [lastName, setLastName] = useState(() => localStorage.getItem('kana_last_name') || 'Learner');
  const [profilePic, setProfilePic] = useState<string | null>(() => localStorage.getItem('kana_profile_pic') || null);

  useEffect(() => {
    localStorage.setItem('kana_first_name', firstName);
  }, [firstName]);

  useEffect(() => {
    localStorage.setItem('kana_last_name', lastName);
  }, [lastName]);

  useEffect(() => {
    if (profilePic) {
      localStorage.setItem('kana_profile_pic', profilePic);
    } else {
      localStorage.removeItem('kana_profile_pic');
    }
  }, [profilePic]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [streak, setStreak] = useState(() => {
    const savedStreak = localStorage.getItem('kana_streak');
    const lastActiveStr = localStorage.getItem('kana_last_active');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    
    let currentStreak = savedStreak ? parseInt(savedStreak, 10) : 0;
    
    if (!lastActiveStr) {
      currentStreak = 1;
      localStorage.setItem('kana_streak', '1');
      localStorage.setItem('kana_last_active', todayTime.toString());
    } else {
      const lastActiveTime = parseInt(lastActiveStr, 10);
      const diffDays = Math.round((todayTime - lastActiveTime) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak += 1;
        localStorage.setItem('kana_streak', currentStreak.toString());
        localStorage.setItem('kana_last_active', todayTime.toString());
      } else if (diffDays > 1) {
        currentStreak = 1;
        localStorage.setItem('kana_streak', '1');
        localStorage.setItem('kana_last_active', todayTime.toString());
      }
    }
    
    return currentStreak;
  });

  // Date generation for the header and calendar
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  const weekDays = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 2 + i);
    return { 
      day: d.toLocaleDateString('en-US', { weekday: 'short' }), 
      date: d.getDate(), 
      isToday: i === 2 
    };
  });

  const generateQuestion = useCallback((currentMode: 'hiragana' | 'katakana' | 'mixed') => {
    const bank = currentMode === 'hiragana' ? hiraganaBank : currentMode === 'katakana' ? katakanaBank : [...hiraganaBank, ...katakanaBank];
    
    const answerIndex = Math.floor(Math.random() * bank.length);
    const answer = bank[answerIndex];
    const type: QuestionType = Math.random() > 0.5 ? 'kanaToRomaji' : 'romajiToKana';

    const optionsSet = new Set<string>();
    const correctAnswerStr = type === 'kanaToRomaji' ? answer.romaji : answer.kana;
    optionsSet.add(correctAnswerStr);

    while (optionsSet.size < 4) {
      const randomEntry = bank[Math.floor(Math.random() * bank.length)];
      const randomOptionStr = type === 'kanaToRomaji' ? randomEntry.romaji : randomEntry.kana;
      optionsSet.add(randomOptionStr);
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    setQuestion({ type, answer, options });
    setFeedback(null);
    setSelectedOption(null);
  }, []);

  const handleStart = (selectedMode: 'hiragana' | 'katakana' | 'mixed') => {
    setMode(selectedMode);
    generateQuestion(selectedMode);
  };

  const handleOptionClick = (option: string) => {
    if (feedback || !question) return;

    setSelectedOption(option);
    const isCorrect = 
      (question.type === 'kanaToRomaji' && option === question.answer.romaji) ||
      (question.type === 'romajiToKana' && option === question.answer.kana);

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    playSound(isCorrect ? 'correct' : 'incorrect');
    setTotal(prev => prev + 1);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      setMode((currentMode) => {
        if (currentMode) {
          generateQuestion(currentMode);
        }
        return currentMode;
      });
    }, 1200);
  };

  const handleBackToHome = () => {
    setMode(null);
    setQuestion(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F9] text-[#1A1A1A] font-sans flex flex-col items-center selection:bg-[#B2A4FF] selection:text-white">
      <div className="w-full max-w-[400px] min-h-screen bg-[#F4F5F9] relative flex flex-col shadow-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          {!mode && tab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex-1 flex flex-col px-6 pt-12 pb-32 overflow-y-auto"
            >
              {/* Header */}
              <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FFB84D] overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-xl">
                    {profilePic ? (
                      <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      "🧑‍🎓"
                    )}
                  </div>
                  <div>
                    <h1 className="font-bold text-lg leading-tight">Hello, {firstName}</h1>
                    <p className="text-sm text-gray-500">Today {dateString}</p>
                  </div>
                </div>
              </header>

              {/* Calendar Pills */}
              <div className="flex justify-between mb-8">
                {weekDays.map((d, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col items-center justify-center w-[60px] h-[80px] rounded-full border ${
                      d.isToday 
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md' 
                        : 'bg-white border-gray-200 text-gray-500'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mb-1 ${d.isToday ? 'bg-white' : 'bg-gray-300'}`}></div>
                    <span className="text-[11px] font-medium mb-1">{d.day}</span>
                    <span className={`text-lg font-bold ${d.isToday ? 'text-white' : 'text-[#1A1A1A]'}`}>{d.date}</span>
                  </div>
                ))}
              </div>

              {/* Hero Card */}
              <button 
                onClick={() => handleStart('mixed')}
                className="bg-[#B2A4FF] rounded-[2rem] p-6 relative overflow-hidden mb-8 shadow-sm text-left w-full hover:scale-[0.98] transition-transform block"
              >
                <div className="relative z-10 w-2/3">
                  <h2 className="text-3xl font-extrabold mb-2 text-[#1A1A1A] leading-tight">Daily<br/>challenge</h2>
                  <p className="text-sm text-[#1A1A1A]/70 font-medium mb-4">Master 50 sounds today</p>
                  
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#FFB84D] border-2 border-[#B2A4FF] flex items-center justify-center text-xs">あ</div>
                    <div className="w-8 h-8 rounded-full bg-[#A4C8FF] border-2 border-[#B2A4FF] flex items-center justify-center text-xs">ア</div>
                    <div className="w-8 h-8 rounded-full bg-[#FF99FF] border-2 border-[#B2A4FF] flex items-center justify-center text-xs">ん</div>
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white border-2 border-[#B2A4FF] flex items-center justify-center text-[10px] font-bold">+43</div>
                  </div>
                </div>
                
                {/* Decorative 3D-like elements */}
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-32 h-32">
                  <div className="absolute top-0 right-4 w-16 h-16 bg-[#FFB84D] rounded-full shadow-lg transform rotate-12"></div>
                  <div className="absolute bottom-2 right-12 w-20 h-20 bg-[#1A1A1A] rounded-3xl shadow-lg transform -rotate-12"></div>
                  <div className="absolute top-8 right-0 w-14 h-14 bg-[#A4C8FF] rounded-full shadow-lg"></div>
                </div>
              </button>

              {/* Bento Grid */}
              <h3 className="font-bold text-2xl mb-4 text-[#1A1A1A]">Your plan</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Hiragana Card */}
                <button 
                  onClick={() => handleStart('hiragana')}
                  className="bg-[#FFB84D] rounded-[2rem] p-5 text-left flex flex-col justify-between h-[260px] shadow-sm hover:scale-[0.98] transition-transform"
                >
                  <span className="bg-white/30 text-[#1A1A1A] px-3 py-1 rounded-full text-xs font-medium w-fit">
                    Basic
                  </span>
                  <div>
                    <h4 className="font-bold text-2xl mb-2 text-[#1A1A1A]">Hiragana</h4>
                    <p className="text-sm text-[#1A1A1A]/70 font-medium mb-1">46 Characters</p>
                    <p className="text-sm text-[#1A1A1A]/70 font-medium mb-4">Reading & Writing</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center text-lg">あ</div>
                      <div className="text-sm font-medium text-[#1A1A1A]">Start Practice</div>
                    </div>
                  </div>
                </button>

                {/* Katakana Card */}
                <button 
                  onClick={() => handleStart('katakana')}
                  className="bg-[#A4C8FF] rounded-[2rem] p-5 text-left flex flex-col justify-between h-[260px] shadow-sm hover:scale-[0.98] transition-transform"
                >
                  <span className="bg-white/40 text-[#1A1A1A] px-3 py-1 rounded-full text-xs font-medium w-fit">
                    Foreign
                  </span>
                  <div>
                    <h4 className="font-bold text-2xl mb-2 text-[#1A1A1A]">Katakana</h4>
                    <p className="text-sm text-[#1A1A1A]/70 font-medium mb-1">46 Characters</p>
                    <p className="text-sm text-[#1A1A1A]/70 font-medium mb-4">Reading & Writing</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center text-lg">ア</div>
                      <div className="text-sm font-medium text-[#1A1A1A]">Start Practice</div>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {!mode && tab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex-1 flex flex-col px-6 pt-12 pb-32 overflow-y-auto"
            >
              <header className="flex justify-between items-center mb-8">
                <h1 className="font-bold text-3xl leading-tight text-[#1A1A1A]">Profile</h1>
              </header>

              {/* Profile Picture Edit */}
              <div className="flex flex-col items-center mb-8">
                <label className="relative w-32 h-32 rounded-full bg-[#FFB84D] border-4 border-white shadow-lg flex items-center justify-center text-5xl mb-4 cursor-pointer hover:opacity-90 transition-opacity">
                  {profilePic ? (
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    "🧑‍🎓"
                  )}
                  <div className="absolute bottom-0 right-0 bg-[#1A1A1A] text-white p-2.5 rounded-full border-2 border-white shadow-sm z-10">
                    <Camera size={18} />
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <p className="text-sm text-gray-500 font-medium">Tap to change picture</p>
              </div>

              {/* Name Fields */}
              <div className="flex gap-4 mb-8">
                <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 focus-within:border-[#FFB84D] transition-colors">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">First Name</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-transparent font-bold text-[#1A1A1A] text-lg outline-none" 
                  />
                </div>
                <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 focus-within:border-[#FFB84D] transition-colors">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-transparent font-bold text-[#1A1A1A] text-lg outline-none" 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {mode && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex-1 flex flex-col px-6 pt-12 pb-8 h-screen"
            >
              {/* Top Nav */}
              <div className="flex justify-between items-center mb-8">
                <button 
                  onClick={handleBackToHome} 
                  className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div className="text-center">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    {mode === 'hiragana' ? 'Hiragana' : mode === 'katakana' ? 'Katakana' : 'Daily Challenge'}
                  </h2>
                  <p className="text-xl font-extrabold text-[#1A1A1A]">
                    Score: {score}
                  </p>
                </div>
                <div className="w-12 h-12" /> {/* Spacer */}
              </div>

              {/* Question Card */}
              <motion.div 
                animate={
                  feedback === 'correct' ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } :
                  feedback === 'incorrect' ? { x: [0, -10, 10, -10, 10, 0] } :
                  {}
                }
                transition={{ duration: 0.4 }}
                className="bg-[#B2A4FF] rounded-[2.5rem] flex-1 max-h-[35vh] flex flex-col items-center justify-center relative shadow-sm mb-6"
              >
                <span className="absolute top-6 bg-white/30 px-4 py-1.5 rounded-full text-sm font-bold text-[#1A1A1A]">
                  {question?.type === 'kanaToRomaji' ? 'Select Romaji' : 'Select Kana'}
                </span>
                <span className="text-[8rem] font-extrabold text-[#1A1A1A] leading-none drop-shadow-sm">
                  {question?.type === 'kanaToRomaji' ? question.answer.kana : question.answer.romaji}
                </span>
              </motion.div>

              {/* Options Grid */}
              <div className="grid grid-cols-2 gap-4 flex-1 max-h-[40vh]">
                {question?.options.map((option, index) => {
                  const isCorrectAnswer = 
                    (question.type === 'kanaToRomaji' && option === question.answer.romaji) ||
                    (question.type === 'romajiToKana' && option === question.answer.kana);
                    
                  let bgClass = "bg-white border-2 border-transparent text-[#1A1A1A] shadow-sm hover:border-gray-200";
                  
                  if (feedback) {
                    if (isCorrectAnswer) {
                      bgClass = "bg-[#00D084] border-[#00D084] text-white shadow-md"; // Vibrant green
                    } else if (selectedOption === option) {
                      bgClass = "bg-[#FF3366] border-[#FF3366] text-white shadow-md"; // Vibrant red
                    } else {
                      bgClass = "bg-gray-100 border-transparent text-gray-400 opacity-50";
                    }
                  }

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      disabled={feedback !== null}
                      animate={
                        feedback && isCorrectAnswer ? { scale: [1, 1.1, 1] } :
                        feedback && selectedOption === option && !isCorrectAnswer ? { scale: [1, 0.9, 1], x: [0, -5, 5, -5, 5, 0] } :
                        {}
                      }
                      transition={{ duration: 0.3 }}
                      className={`rounded-[2rem] flex items-center justify-center text-4xl font-extrabold transition-all cursor-pointer ${bgClass}`}
                    >
                      {option}
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback Toast */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className={`absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-4 rounded-full font-bold text-lg shadow-xl flex items-center gap-3 ${
                      feedback === 'correct' ? 'bg-[#1A1A1A] text-[#00D084]' : 'bg-[#1A1A1A] text-[#FF3366]'
                    }`}
                  >
                    {feedback === 'correct' ? (
                      <>
                        <Check size={24} strokeWidth={3} />
                        <span>Awesome!</span>
                      </>
                    ) : (
                      <>
                        <X size={24} strokeWidth={3} />
                        <span>It's {question?.type === 'kanaToRomaji' ? question?.answer.romaji : question?.answer.kana}</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation (Only on Home) */}
        <AnimatePresence>
          {!mode && (
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#1A1A1A] rounded-full px-8 py-4 flex gap-12 items-center shadow-2xl z-50"
            >
              <button 
                onClick={() => setTab('home')}
                className={tab === 'home' ? "bg-white text-[#1A1A1A] p-2.5 rounded-full" : "text-white/50 hover:text-white transition-colors"}
              >
                <Home size={24} strokeWidth={2.5} />
              </button>
              <button className="text-white/50 hover:text-white transition-colors flex items-center gap-1.5">
                <Flame size={24} strokeWidth={2.5} className="text-[#FFB84D]" />
                <span className="font-bold text-[#FFB84D] text-sm">{streak}</span>
              </button>
              <button 
                onClick={() => setTab('profile')}
                className={tab === 'profile' ? "bg-white text-[#1A1A1A] p-2.5 rounded-full" : "text-white/50 hover:text-white transition-colors"}
              >
                <User size={24} strokeWidth={2.5} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

