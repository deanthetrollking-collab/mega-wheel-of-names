import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, RotateCcw, Volume2, VolumeX, Trash2, Shuffle, 
  Plus, Save, Award, Settings as SettingsIcon, History as HistoryIcon, 
  Users, Check, X, ArrowRight, Share2, Clipboard, Edit3, Eye, EyeOff, Dices,
  Info, ShieldCheck, HelpCircle, Sparkles, Cpu, Target, Download, Upload, Moon, Sun, AlertCircle
} from 'lucide-react';

// Premium physical sound synthesis using Web Audio API
class AudioSynth {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTick() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      
      // 1. High tactile snap noise burst
      const bufferSize = this.ctx.sampleRate * 0.012; // 12ms buffer
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1400, now);
      noiseFilter.Q.setValueAtTime(4, now);
      
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.06, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      
      // 2. Resonant pop (simulating wood peg deflection)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.012);
      
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      noise.start(now);
      osc.start(now);
      osc.stop(now + 0.015);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playFanfare() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      
      // Accelerated ascending major scale arpeggio
      const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C4 to C5
      
      notes.forEach((freq, idx) => {
        const timeOffset = idx * 0.065;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + timeOffset);
        gain.gain.setValueAtTime(0, now + timeOffset);
        gain.gain.linearRampToValueAtTime(0.06, now + timeOffset + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + 0.15);
      });
      
      // Rich chord starting mid-arpeggio for an epic triumphant burst
      const chord = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Bright chord)
      const chordTime = now + 0.42;
      
      chord.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const subOsc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, chordTime);
        
        // Slightly detuned sawtooth sub-oscillator for lush synth/chorus sound
        subOsc.type = 'sawtooth';
        subOsc.frequency.setValueAtTime(freq + (Math.random() * 3 - 1.5), chordTime);
        
        gain.gain.setValueAtTime(0, chordTime);
        gain.gain.linearRampToValueAtTime(0.07, chordTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 1.4);
        
        osc.connect(gain);
        subOsc.connect(gain);
        
        // Low-pass filter to keep it bright but warm
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, chordTime);
        
        gain.connect(filter);
        filter.connect(this.ctx.destination);
        
        osc.start(chordTime);
        subOsc.start(chordTime);
        
        osc.stop(chordTime + 1.5);
        subOsc.stop(chordTime + 1.5);
      });
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }
}

const synth = new AudioSynth();

// Colorful and bright palettes (Light mode defaults)
const COLOR_PALETTE = [
  '#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', 
  '#C7CEEA', '#FFC6FF', '#BDB2FF', '#9BF6FF', '#CAFFBF'
];

// Rich, jewel-toned colors perfect for high-contrast RPG dice segments
const RPG_COLOR_PALETTE = [
  '#DC2626', // Ruby Red
  '#2563EB', // Sapphire Blue
  '#059669', // Emerald Green
  '#D97706', // Amber Gold
  '#7C3AED', // Amethyst Purple
  '#475569', // Slate Obsidian
  '#DB2777'  // Rose Quartz
];

export default function App() {
  const [activeTab, setActiveTab] = useState('entries'); // entries, settings, history
  const [darkMode, setDarkMode] = useState(false);
  
  // Custom toast notification states
  const [toastMessage, setToastMessage] = useState(null);

  const [entries, setEntries] = useState([
    { id: '1', name: 'Alice', percentage: 20, color: '#FF9AA2', weight: 1, active: true },
    { id: '2', name: 'Bob', percentage: 20, color: '#FFDAC1', weight: 1, active: true },
    { id: '3', name: 'Charlie', percentage: 20, color: '#B5EAD7', weight: 1, active: true },
    { id: '4', name: 'Diana', percentage: 20, color: '#C7CEEA', weight: 1, active: true },
    { id: '5', name: 'Ethan', percentage: 20, color: '#FFC6FF', weight: 1, active: true }
  ]);
  
  const [singleNameInput, setSingleNameInput] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  
  // Settings
  const [removeWinnerAfterSpin, setRemoveWinnerAfterSpin] = useState(false);
  const [weightedEntries, setWeightedEntries] = useState(false);
  const [chancePercentages, setChancePercentages] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [spinDuration, setSpinDuration] = useState(5); // in seconds
  const [savedLists, setSavedLists] = useState([
    { name: 'Default Team', entries: ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan'] },
    { name: 'Lunch Choices', entries: ['Pizza', 'Burgers', 'Salad', 'Sushi', 'Tacos', 'Pasta'] }
  ]);
  const [newListName, setNewListName] = useState('');

  // History & Winners
  const [history, setHistory] = useState([]);
  const [winner, setWinner] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  // Wheel animation states
  const [isSpinning, setIsSpinning] = useState(false);
  const canvasRef = useRef(null);
  const rotationRef = useRef(0);
  const animationFrameRef = useRef(null);

  // Interactive FAQ Section Active State
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const soundEffectsRef = useRef(soundEffects);
  useEffect(() => {
    soundEffectsRef.current = soundEffects;
  }, [soundEffects]);

  // Helper to trigger custom on-screen notification toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Gentle Idle Rotation Loop
  useEffect(() => {
    let idleFrameId;
    
    const tickIdle = () => {
      const activeEntriesCount = entries.filter(e => e.active !== false).length;
      if (!isSpinning && !showWinnerModal && activeEntriesCount > 0) {
        rotationRef.current = (rotationRef.current + 0.0015) % (Math.PI * 2);
        drawWheel(rotationRef.current);
      }
      idleFrameId = requestAnimationFrame(tickIdle);
    };

    if (!isSpinning && !showWinnerModal) {
      idleFrameId = requestAnimationFrame(tickIdle);
    }

    return () => {
      cancelAnimationFrame(idleFrameId);
    };
  }, [isSpinning, showWinnerModal, entries, darkMode]);

  // Adjust percentages of only active entries to sum to exactly 100%
  const normalizePercentages = (list) => {
    const activeList = list.filter(item => item.active !== false);
    if (activeList.length === 0) {
      return list.map(item => ({ ...item, percentage: 0 }));
    }
    const share = parseFloat((100 / activeList.length).toFixed(2));
    
    const updated = list.map(item => {
      if (item.active === false) {
        return { ...item, percentage: 0 };
      }
      return { ...item, percentage: share };
    });
    
    const currentActiveSum = updated.reduce((sum, item) => sum + (item.active !== false ? item.percentage : 0), 0);
    const difference = parseFloat((100 - currentActiveSum).toFixed(2));
    if (difference !== 0) {
      const lastActiveIdx = updated.findLastIndex(item => item.active !== false);
      if (lastActiveIdx !== -1) {
        updated[lastActiveIdx].percentage = parseFloat((updated[lastActiveIdx].percentage + difference).toFixed(2));
      }
    }
    return updated;
  };

  // Re-calculate percentages based on Weights (for active entries only)
  const recalculatePercentagesFromWeights = (list) => {
    const activeList = list.filter(item => item.active !== false);
    if (activeList.length === 0) {
      return list.map(item => ({ ...item, percentage: 0 }));
    }
    const totalWeight = activeList.reduce((sum, item) => sum + (parseFloat(item.weight) || 1), 0);
    if (totalWeight === 0) return normalizePercentages(list);
    
    const updated = list.map(item => {
      if (item.active === false) {
        return { ...item, percentage: 0 };
      }
      const share = ((parseFloat(item.weight) || 1) / totalWeight) * 100;
      return { ...item, percentage: parseFloat(share.toFixed(2)) };
    });

    const currentActiveSum = updated.reduce((sum, item) => sum + (item.active !== false ? item.percentage : 0), 0);
    const difference = parseFloat((100 - currentActiveSum).toFixed(2));
    if (difference !== 0) {
      const lastActiveIdx = updated.findLastIndex(item => item.active !== false);
      if (lastActiveIdx !== -1) {
        updated[lastActiveIdx].percentage = parseFloat((updated[lastActiveIdx].percentage + difference).toFixed(2));
      }
    }
    return updated;
  };

  // Real-time proportional slider algorithm to adjust exact percentage chances dynamically
  const handlePercentageChange = (index, valueStr) => {
    let newValue = parseFloat(valueStr);
    if (isNaN(newValue)) newValue = 0;
    newValue = Math.max(0, Math.min(100, newValue));

    const activeList = entries.filter(e => e.active !== false);
    if (activeList.length <= 1) {
      const updated = entries.map(e => e.active !== false ? { ...e, percentage: 100 } : { ...e, percentage: 0 });
      setEntries(updated);
      return;
    }

    const remaining = 100 - newValue;
    const otherActiveEntries = activeList.filter(e => e.id !== entries[index].id);
    const otherActiveSum = otherActiveEntries.reduce((sum, e) => sum + (e.percentage || 0), 0);

    const updated = entries.map((entry, i) => {
      if (entry.active === false) {
        return { ...entry, percentage: 0 };
      }
      if (i === index) {
        return { ...entry, percentage: newValue };
      }
      if (otherActiveSum === 0) {
        return { ...entry, percentage: parseFloat((remaining / otherActiveEntries.length).toFixed(2)) };
      } else {
        const proportionalShare = (entry.percentage / otherActiveSum) * remaining;
        return { ...entry, percentage: parseFloat(proportionalShare.toFixed(2)) };
      }
    });

    const total = updated.reduce((sum, e) => sum + e.percentage, 0);
    const diff = parseFloat((100 - total).toFixed(4));
    if (Math.abs(diff) > 0.0001) {
      let targetIndex = -1;
      let maxVal = -1;
      for (let i = 0; i < updated.length; i++) {
        if (i !== index && updated[i].active !== false && updated[i].percentage > maxVal) {
          maxVal = updated[i].percentage;
          targetIndex = i;
        }
      }
      if (targetIndex !== -1) {
        updated[targetIndex].percentage = parseFloat((updated[targetIndex].percentage + diff).toFixed(2));
      }
    }

    setEntries(updated);
  };

  const handleWeightChange = (index, weightVal) => {
    let value = parseFloat(weightVal);
    if (isNaN(value) || value < 0.1) value = 0.1;
    
    const updated = [...entries];
    updated[index].weight = value;
    
    const reWeighted = recalculatePercentagesFromWeights(updated);
    setEntries(reWeighted);
  };

  // Toggle activation (hide/unhide) of entry
  const toggleActive = (id) => {
    const updated = entries.map(e => e.id === id ? { ...e, active: e.active === false ? true : false } : e);
    if (weightedEntries) {
      setEntries(recalculatePercentagesFromWeights(updated));
    } else {
      setEntries(normalizePercentages(updated));
    }
  };

  // RPG Polyhedral Dice Roller Setup helper
  const handleLoadDicePreset = (sides) => {
    const diceEntries = [];
    for (let i = 1; i <= sides; i++) {
      diceEntries.push({
        id: crypto.randomUUID(),
        name: i.toString(),
        percentage: 0,
        color: RPG_COLOR_PALETTE[(i - 1) % RPG_COLOR_PALETTE.length],
        weight: 1,
        active: true
      });
    }
    setEntries(normalizePercentages(diceEntries));
    triggerToast(`D${sides} Mode initialized! Alternating RPG Jewel themes loaded.`);
  };

  // Download Current Wheel Layout Setup to local PC as a JSON File
  const downloadWheelConfiguration = () => {
    try {
      const configData = {
        appIdentifier: 'mega_wheel_of_names_v1',
        timestamp: new Date().toISOString(),
        settings: {
          weightedEntries,
          chancePercentages,
          spinDuration,
          soundEffects,
          removeWinnerAfterSpin
        },
        entries: entries
      };

      const fileString = JSON.stringify(configData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(fileString);
      
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataUri);
      downloadAnchor.setAttribute("download", `wheel_setup_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      
      triggerToast("Wheel configuration downloaded successfully!");
    } catch (err) {
      console.error(err);
      triggerToast("Failed to compile layout download.");
    }
  };

  // Restore Wheel Layout Setup from local JSON File
  const uploadWheelConfiguration = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.entries && Array.isArray(parsed.entries)) {
          setEntries(parsed.entries);
          if (parsed.settings) {
            if (parsed.settings.weightedEntries !== undefined) setWeightedEntries(parsed.settings.weightedEntries);
            if (parsed.settings.chancePercentages !== undefined) setChancePercentages(parsed.settings.chancePercentages);
            if (parsed.settings.spinDuration !== undefined) setSpinDuration(parsed.settings.spinDuration);
            if (parsed.settings.soundEffects !== undefined) setSoundEffects(parsed.settings.soundEffects);
            if (parsed.settings.removeWinnerAfterSpin !== undefined) setRemoveWinnerAfterSpin(parsed.settings.removeWinnerAfterSpin);
          }
          triggerToast("Wheel configuration uploaded successfully!");
        } else {
          triggerToast("Invalid wheel file structure.");
        }
      } catch (err) {
        console.error(err);
        triggerToast("Failed to parse uploaded JSON file.");
      }
    };
    fileReader.readAsText(file);
    // Reset file input value so same file can be uploaded again
    event.target.value = '';
  };

  // Drawing the Wheel canvas
  const drawWheel = (angleOffset = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(cx, cy) - 15;

    ctx.clearRect(0, 0, width, height);

    const activeEntries = entries.filter(e => e.active !== false);

    if (activeEntries.length === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.fillStyle = darkMode ? '#1E192F' : '#F1EFF9';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = darkMode ? '#3E3466' : '#DCD8FA';
      ctx.setLineDash([8, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.fillStyle = darkMode ? '#7E759E' : '#8E8AA7';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Add names to spin', cx, cy);
      return;
    }

    let currentAngle = angleOffset;

    // Draw active slices
    activeEntries.forEach((entry) => {
      const sliceAngle = (entry.percentage / 100) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = entry.color;
      ctx.fill();
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = darkMode ? '#161224' : '#FFFFFF';
      ctx.stroke();

      currentAngle += sliceAngle;
    });

    // Draw active labels
    currentAngle = angleOffset;
    activeEntries.forEach((entry) => {
      const sliceAngle = (entry.percentage / 100) * 2 * Math.PI;
      const middleAngle = currentAngle + sliceAngle / 2;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(middleAngle);

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      
      // Determine label color dynamically for better visual contrast on deep jewel tones or light modes
      ctx.fillStyle = darkMode ? '#FFFFFF' : '#2D2342';
      
      const segmentCount = activeEntries.length;
      let fontSize = '15px';
      if (segmentCount > 15) {
        fontSize = '12px';
      } else if (segmentCount > 10) {
        fontSize = '13px';
      }

      ctx.font = `800 ${fontSize} Inter, sans-serif`;
      
      if (entry.percentage > 1.2) {
        const textToDraw = entry.name.length > 14 ? entry.name.slice(0, 12) + '..' : entry.name;
        ctx.fillText(textToDraw, radius - 20, 0);
      }
      ctx.restore();

      currentAngle += sliceAngle;
    });

    // Draw center pin decoration
    ctx.beginPath();
    ctx.arc(cx, cy, 35, 0, 2 * Math.PI);
    ctx.fillStyle = darkMode ? '#2D2342' : '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#8B5CF6';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, 2 * Math.PI);
    ctx.fillStyle = '#8B5CF6';
    ctx.fill();
  };

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [entries, darkMode]);

  useEffect(() => {
    const handleResize = () => {
      drawWheel(rotationRef.current);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [entries, darkMode]);

  // Adding single entry
  const addEntry = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    
    const color = COLOR_PALETTE[entries.length % COLOR_PALETTE.length];
    const newEntry = {
      id: crypto.randomUUID(),
      name: trimmed,
      percentage: 0,
      color,
      weight: 1,
      active: true
    };

    const newEntries = [...entries, newEntry];
    
    let balanced;
    if (weightedEntries) {
      balanced = recalculatePercentagesFromWeights(newEntries);
    } else {
      balanced = normalizePercentages(newEntries);
    }

    setEntries(balanced);
    setSingleNameInput('');
  };

  // Bulk add text change
  const handleBulkImport = () => {
    const names = bulkInput
      .split(/[\n,]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);
    
    if (names.length === 0) return;

    const imported = names.map((name, idx) => ({
      id: crypto.randomUUID(),
      name,
      percentage: 0,
      color: COLOR_PALETTE[(entries.length + idx) % COLOR_PALETTE.length],
      weight: 1,
      active: true
    }));

    const combined = [...entries, ...imported];
    setEntries(normalizePercentages(combined));
    setBulkInput('');
  };

  // Delete option from entire list
  const removeEntry = (id) => {
    const filtered = entries.filter(e => e.id !== id);
    if (weightedEntries) {
      setEntries(recalculatePercentagesFromWeights(filtered));
    } else {
      setEntries(normalizePercentages(filtered));
    }
  };

  // Shuffling active options
  const handleShuffle = () => {
    const activeList = entries.filter(e => e.active !== false);
    if (activeList.length < 2) return;
    
    const shuffledActive = [...activeList];
    for (let i = shuffledActive.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledActive[i], shuffledActive[j]] = [shuffledActive[j], shuffledActive[i]];
    }

    let activePointer = 0;
    const remapped = entries.map(entry => {
      if (entry.active !== false) {
        return shuffledActive[activePointer++];
      }
      return entry;
    });

    setEntries(remapped);
  };

  const handleClear = () => {
    setEntries([]);
  };

  // Spin wheel logic
  const handleSpin = () => {
    const activeEntries = entries.filter(e => e.active !== false);
    if (isSpinning || activeEntries.length === 0) return;
    
    setIsSpinning(true);
    setWinner(null);
    
    const totalSpinTime = spinDuration * 1000; 
    const startTime = performance.now();
    
    const targetSpinAngle = Math.PI * 2 * (10 + Math.random() * 8); 
    const initialAngle = rotationRef.current;
    
    let lastSegmentIdx = -1;

    const animateSpin = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalSpinTime, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentRotation = initialAngle + easeOut * targetSpinAngle;
      
      rotationRef.current = currentRotation % (Math.PI * 2);
      drawWheel(rotationRef.current);

      const relativePointerAngle = (1.5 * Math.PI - rotationRef.current) % (Math.PI * 2);
      const normalizedAngle = relativePointerAngle < 0 ? relativePointerAngle + Math.PI * 2 : relativePointerAngle;

      let accumulatedAngle = 0;
      let currentTickIndex = -1;
      for (let i = 0; i < activeEntries.length; i++) {
        const sliceAngle = (activeEntries[i].percentage / 100) * 2 * Math.PI;
        if (normalizedAngle >= accumulatedAngle && normalizedAngle < accumulatedAngle + sliceAngle) {
          currentTickIndex = i;
          break;
        }
        accumulatedAngle += sliceAngle;
      }

      if (currentTickIndex !== lastSegmentIdx && currentTickIndex !== -1) {
        if (soundEffectsRef.current) {
          synth.playTick();
        }
        lastSegmentIdx = currentTickIndex;
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateSpin);
      } else {
        setIsSpinning(false);
        determineWinner(normalizedAngle);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateSpin);
  };

  const determineWinner = (normalizedAngle) => {
    const activeEntries = entries.filter(e => e.active !== false);
    if (activeEntries.length === 0) return;

    let accumulatedAngle = 0;
    let foundWinner = null;

    for (let i = 0; i < activeEntries.length; i++) {
      const sliceAngle = (activeEntries[i].percentage / 100) * 2 * Math.PI;
      if (normalizedAngle >= accumulatedAngle && normalizedAngle < accumulatedAngle + sliceAngle) {
        foundWinner = activeEntries[i];
        break;
      }
      accumulatedAngle += sliceAngle;
    }

    if (!foundWinner && activeEntries.length > 0) {
      foundWinner = activeEntries[activeEntries.length - 1];
    }

    if (foundWinner) {
      setWinner(foundWinner);
      setShowWinnerModal(true);
      if (soundEffects) {
        synth.playFanfare();
      }
      setHistory(prev => [{
        id: crypto.randomUUID(),
        name: foundWinner.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }, ...prev]);
    }
  };

  // Close, Hide, or Delete landing action handlers
  const handleModalAction = (action) => {
    if (!winner) return;

    if (action === 'delete') {
      removeEntry(winner.id);
    } else if (action === 'hide') {
      toggleActive(winner.id);
    } else if (action === 'close' && removeWinnerAfterSpin) {
      removeEntry(winner.id);
    }

    setShowWinnerModal(false);
    setWinner(null);
  };

  // Preset loading helpers
  const loadSavedList = (savedList) => {
    const listEntries = savedList.entries.map((name, idx) => ({
      id: crypto.randomUUID(),
      name,
      percentage: 0,
      color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
      weight: 1,
      active: true
    }));
    setEntries(normalizePercentages(listEntries));
    triggerToast(`Preset list "${savedList.name}" loaded successfully!`);
  };

  const handleSaveCurrentList = () => {
    const name = newListName.trim();
    if (!name || entries.length === 0) return;
    const names = entries.map(e => e.name);
    setSavedLists([...savedLists, { name, entries: names }]);
    setNewListName('');
    triggerToast(`List "${name}" saved to local session.`);
  };

  // Toggle FAQ Accordion helper
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className={`min-h-screen font-sans antialiased pb-0 transition-colors duration-300 ${
      darkMode ? 'bg-[#0F0C1B] text-[#F1EFF9]' : 'bg-[#FAF9FD] text-[#2D2342]'
    }`}>
      
      {/* Toast Notification HUD */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce-subtle">
          <div className="bg-[#8B5CF6] text-white py-3 px-5 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-bold border border-[#A78BFA]">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className={`border-b sticky top-0 z-10 px-6 py-4 transition-colors duration-300 ${
        darkMode ? 'bg-[#161224] border-[#2D2342] shadow-sm' : 'bg-white border-[#EBE8F5] shadow-sm'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-[#9B63FF] to-[#D946EF] p-2.5 rounded-2xl shadow-md text-white">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#6366F1] to-[#D946EF] bg-clip-text text-transparent">
                Mega Wheel of Names
              </h1>
              <p className="text-xs text-[#8E8AA7] font-medium">Create random decisions with adjustable chances</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick backup icons directly on navbar */}
            <button 
              onClick={downloadWheelConfiguration}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-black ${
                darkMode ? 'bg-[#211B3A] border-[#3E3466] text-purple-300 hover:bg-[#2B234D]' : 'bg-[#FAF9FD] border-[#EBE8F5] text-[#7C3AED] hover:bg-[#F3F0FF]'
              }`}
              title="Download Entire Wheel Configuration"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Download</span>
            </button>

            <label 
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-black cursor-pointer ${
                darkMode ? 'bg-[#211B3A] border-[#3E3466] text-purple-300 hover:bg-[#2B234D]' : 'bg-[#FAF9FD] border-[#EBE8F5] text-[#7C3AED] hover:bg-[#F3F0FF]'
              }`}
              title="Upload custom Wheel setup File"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden md:inline">Upload</span>
              <input 
                type="file" 
                accept=".json" 
                onChange={uploadWheelConfiguration} 
                className="hidden" 
              />
            </label>

            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition-all ${
                darkMode ? 'bg-[#211B3A] border-[#4C3D75] text-yellow-400 hover:bg-[#2B234D]' : 'bg-[#FAF9FD] border-[#E5E7EB] text-gray-500 hover:bg-[#F3F4F6]'
              }`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Audio Toggle */}
            <button 
              onClick={() => setSoundEffects(!soundEffects)}
              className={`p-2 rounded-xl border transition-all ${
                soundEffects 
                  ? 'bg-[#F5F3FF] border-[#DDD6FE] text-[#7C3AED]' 
                  : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-400'
              }`}
              title={soundEffects ? "Mute Sounds" : "Unmute Sounds"}
            >
              {soundEffects ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Grid: Wheel View */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-[460px] md:max-w-[490px] aspect-square flex items-center justify-center">
            
            <div className="absolute inset-0 bg-gradient-to-tr from-[#9E00FF] to-[#00F0FF] rounded-full opacity-[0.06] blur-2xl pointer-events-none"></div>

            <div className={`w-[94%] h-[94%] rounded-full p-2 relative transition-all shadow-[0_24px_48px_-12px_rgba(110,89,179,0.15)] border ${
              darkMode ? 'bg-[#161224] border-[#2D2342]' : 'bg-white border-[#E9E6F6]'
            }`}>
              <canvas 
                ref={canvasRef} 
                width={500} 
                height={500}
                className="w-full h-full rounded-full transition-shadow duration-300"
              />
              
              {entries.filter(e => e.active !== false).length > 0 && (
                <button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="absolute inset-0 m-auto w-24 h-24 rounded-full flex flex-col items-center justify-center text-xs font-black tracking-widest text-white transition-transform active:scale-95 z-10 select-none group focus:outline-none"
                  style={{
                    background: 'radial-gradient(circle, #9B63FF 0%, #7C3AED 100%)',
                    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.45)'
                  }}
                >
                  <span className="group-hover:scale-110 transition-transform tracking-wider">
                    {isSpinning ? 'SPINNING' : 'SPIN'}
                  </span>
                </button>
              )}
            </div>

            {/* Perfect Top Center Indicator Needle */}
            <div className="absolute top-0 flex flex-col items-center pointer-events-none z-10">
              <div 
                className="w-8 h-10 shadow-lg"
                style={{
                  clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                  background: 'linear-gradient(to bottom, #EC4899, #D946EF)',
                  border: '1px solid rgba(255, 255, 255, 0.5)'
                }}
              />
              <div className="w-2.5 h-2.5 bg-white rounded-full -mt-0.5 border border-[#EC4899] shadow-sm" />
            </div>
          </div>

          <div className="mt-6 flex gap-2 items-center text-xs font-semibold text-[#8E8AA7]">
            <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-ping" />
            <span>Click SPIN in the center or use the spin panel below</span>
          </div>
        </div>

        {/* Right Grid: Tab Settings Panels */}
        <div className={`rounded-3xl border p-6 transition-all shadow-[0_12px_30px_rgba(235,232,245,0.4)] lg:col-span-5 ${
          darkMode ? 'bg-[#161224] border-[#2D2342] shadow-none' : 'bg-white border-[#EBE8F5]'
        }`}>
          
          {/* Tab Navigation */}
          <div className={`p-1.5 rounded-2xl mb-6 flex transition-colors ${
            darkMode ? 'bg-[#1E192F]' : 'bg-[#F1EFF9]'
          }`}>
            <button
              onClick={() => setActiveTab('entries')}
              className={`flex-1 py-3 text-center rounded-xl text-sm font-bold transition-all ${
                activeTab === 'entries' 
                  ? (darkMode ? 'bg-[#2D2342] text-white shadow-sm' : 'bg-white text-[#2D2342] shadow-[0_4px_12px_rgba(110,89,179,0.08)]')
                  : 'text-[#8E8AA7] hover:text-[#5B5570]'
              }`}
            >
              Entries
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 text-center rounded-xl text-sm font-bold transition-all ${
                activeTab === 'settings' 
                  ? (darkMode ? 'bg-[#2D2342] text-white shadow-sm' : 'bg-white text-[#2D2342] shadow-[0_4px_12px_rgba(110,89,179,0.08)]')
                  : 'text-[#8E8AA7] hover:text-[#5B5570]'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-center rounded-xl text-sm font-bold transition-all ${
                activeTab === 'history' 
                  ? (darkMode ? 'bg-[#2D2342] text-white shadow-sm' : 'bg-white text-[#2D2342] shadow-[0_4px_12px_rgba(110,89,179,0.08)]')
                  : 'text-[#8E8AA7] hover:text-[#5B5570]'
              }`}
            >
              History
            </button>
          </div>

          {/* TAB 1: ENTRIES */}
          {activeTab === 'entries' && (
            <div className="space-y-5">

              {/* 🎲 RPG / D&D DICE ROLLER PRESENTS PANEL */}
              <div className={`rounded-2xl p-4 border transition-all ${
                darkMode ? 'bg-[#211B3A] border-[#3E3466]' : 'bg-gradient-to-r from-[#F5F3FF] to-[#FCE7F3] border-[#E9D5FF]'
              }`}>
                <div className="flex items-center gap-2 mb-2.5">
                  <Dices className="w-4 h-4 text-[#8B5CF6]" />
                  <span className={`text-xs font-black tracking-wider uppercase ${darkMode ? 'text-purple-300' : 'text-[#7C3AED]'}`}>RPG Dice Modes</span>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {[4, 6, 8, 10, 12, 20].map((sides) => (
                    <button
                      key={sides}
                      onClick={() => handleLoadDicePreset(sides)}
                      className={`py-2 rounded-xl text-xs font-black tracking-wide shadow-sm hover:shadow transition-all flex flex-col items-center justify-center gap-0.5 border ${
                        darkMode ? 'bg-[#1E192F] border-[#4C3D75] text-purple-300 hover:bg-[#8B5CF6] hover:text-white' : 'bg-white hover:bg-[#8B5CF6] text-[#7C3AED] hover:text-white border-[#DDD6FE]'
                      }`}
                    >
                      <span className="text-[9px] uppercase text-opacity-80 font-bold">D</span>
                      <span className="text-sm">{sides}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={singleNameInput}
                    onChange={(e) => setSingleNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addEntry(singleNameInput)}
                    placeholder="Add a name..."
                    className={`w-full text-sm py-3.5 px-4 rounded-2xl placeholder-[#A09BB9] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-all border ${
                      darkMode ? 'bg-[#1E192F] border-[#4C3D75] text-[#F1EFF9]' : 'bg-[#FAF9FD] border-[#DDD6FE] text-[#2D2342]'
                    }`}
                  />
                </div>
                <button
                  onClick={() => addEntry(singleNameInput)}
                  className="bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] text-white p-3.5 rounded-2xl shadow-md flex items-center justify-center transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-[#8E8AA7] pt-1">
                <div className="flex gap-2">
                  <button
                    onClick={handleShuffle}
                    disabled={entries.filter(e => e.active !== false).length < 2}
                    className={`flex items-center gap-1.5 border px-3.5 py-2 rounded-xl font-bold transition-all disabled:opacity-50 ${
                      darkMode ? 'bg-[#1E192F] border-[#3E3466] text-purple-300 hover:bg-[#211B3A]' : 'bg-[#FAF9FD] border-[#E9E6F6] text-[#5B5570] hover:bg-[#F3F1FA]'
                    }`}
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    Shuffle
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={entries.length === 0}
                    className={`flex items-center gap-1.5 border px-3.5 py-2 rounded-xl font-bold transition-all disabled:opacity-50 ${
                      darkMode ? 'bg-[#1E192F] border-[#3E3466] text-red-400 hover:bg-red-950/20 hover:text-red-500' : 'bg-[#FAF9FD] border-[#E9E6F6] text-[#5B5570] hover:bg-[#FDF2F2] hover:text-red-600'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear
                  </button>
                </div>
                <span className="font-extrabold text-[#7C3AED]">{entries.length} entries</span>
              </div>

              {/* Scrollable Entry Elements */}
              <div className="max-h-[290px] overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
                {entries.length === 0 ? (
                  <div className={`text-center py-10 border-2 border-dashed rounded-2xl ${darkMode ? 'border-[#2D2342]' : 'border-[#EBE8F5]'}`}>
                    <p className="text-sm text-[#8E8AA7] font-medium px-4">
                      No entries yet. Add names above, click an RPG dice mode, or paste a bulk list below.
                    </p>
                  </div>
                ) : (
                  entries.map((entry, index) => (
                    <div 
                      key={entry.id} 
                      className={`flex items-center gap-2 border p-2.5 rounded-2xl transition-all ${
                        entry.active !== false 
                          ? (darkMode ? 'bg-[#1E192F] border-[#3E3466] hover:border-[#4C3D75]' : 'bg-[#FAF9FD] border-[#EBE8F5] hover:border-[#DDD6FE]')
                          : (darkMode ? 'bg-[#141021] border-[#201A33] opacity-40 line-through' : 'bg-gray-100 border-gray-200 opacity-60 line-through')
                      }`}
                    >
                      <span 
                        className="w-4 h-4 rounded-full flex-shrink-0 border border-black/5" 
                        style={{ backgroundColor: entry.active !== false ? entry.color : '#CBD5E1' }}
                      />
                      
                      <span className={`text-sm font-semibold flex-1 truncate ${
                        entry.active === false 
                          ? 'text-gray-400' 
                          : (darkMode ? 'text-[#F1EFF9]' : 'text-[#2D2342]')
                      }`}>
                        {entry.name}
                      </span>

                      {/* Toggle Active/Hidden State Directly */}
                      <button
                        onClick={() => toggleActive(entry.id)}
                        className={`p-1.5 rounded-xl transition-all ${
                          entry.active !== false 
                            ? (darkMode ? 'text-[#8E8AA7] hover:text-purple-300 hover:bg-[#211B3A]' : 'text-[#A09BB9] hover:text-[#7C3AED] hover:bg-purple-50')
                            : 'text-[#EC4899] bg-[#FCE7F3] hover:bg-[#FBCFE8]'
                        }`}
                        title={entry.active !== false ? "Hide on Wheel" : "Show on Wheel"}
                      >
                        {entry.active !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      {/* ADJUSTABLE CHANCES */}
                      {chancePercentages && entry.active !== false && (
                        <div className={`flex items-center gap-1.5 border px-2 py-1 rounded-xl ${
                          darkMode ? 'bg-[#161224] border-[#3E3466]' : 'bg-white border-[#E9E6F6]'
                        }`}>
                          <span className="text-[10px] uppercase tracking-wider text-[#A09BB9] font-bold">Chance</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={entry.percentage}
                            onChange={(e) => handlePercentageChange(index, e.target.value)}
                            className={`w-14 text-right text-xs font-extrabold focus:outline-none focus:ring-0 bg-transparent p-0 border-none ${
                              darkMode ? 'text-[#A78BFA]' : 'text-[#7C3AED]'
                            }`}
                          />
                          <span className={`text-xs font-bold ${darkMode ? 'text-[#A78BFA]' : 'text-[#7C3AED]'}`}>%</span>
                        </div>
                      )}

                      {/* ADJUSTABLE WEIGHTS */}
                      {weightedEntries && entry.active !== false && (
                        <div className={`flex items-center gap-1.5 border px-2 py-1 rounded-xl ${
                          darkMode ? 'bg-[#161224] border-[#3E3466]' : 'bg-white border-[#E9E6F6]'
                        }`}>
                          <span className="text-[10px] uppercase tracking-wider text-[#A09BB9] font-bold">Weight</span>
                          <input
                            type="number"
                            min="0.1"
                            max="100"
                            step="0.1"
                            value={entry.weight}
                            onChange={(e) => handleWeightChange(index, e.target.value)}
                            className={`w-12 text-right text-xs font-extrabold focus:outline-none focus:ring-0 bg-transparent p-0 border-none ${
                              darkMode ? 'text-[#60A5FA]' : 'text-[#2563EB]'
                            }`}
                          />
                        </div>
                      )}

                      {/* Delete Entry */}
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className={`p-1.5 rounded-lg transition-all ${
                          darkMode ? 'text-[#8E8AA7] hover:text-red-400 hover:bg-red-950/20' : 'text-[#A09BB9] hover:text-red-500 hover:bg-red-50'
                        }`}
                        title="Delete permanently"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Bulk Imports */}
              <div className={`pt-4 border-t ${darkMode ? 'border-[#2D2342]' : 'border-[#F1EFF9]'}`}>
                <label className="block text-xs font-bold text-[#8E8AA7] uppercase tracking-wider mb-2">
                  Import — one per line or comma-separated
                </label>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="E.g. Hamburgers, Pizza, Tacos, Sushi"
                    className={`flex-1 text-xs p-3 rounded-xl placeholder-[#A09BB9] focus:outline-none resize-none transition-all border ${
                      darkMode ? 'bg-[#1E192F] border-[#4C3D75] text-[#F1EFF9] focus:border-[#8B5CF6]' : 'bg-[#FAF9FD] border-[#DDD6FE] text-[#2D2342] focus:border-[#8B5CF6]'
                    }`}
                  />
                  <button
                    onClick={handleBulkImport}
                    disabled={!bulkInput.trim()}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center transition-all disabled:opacity-50 border ${
                      darkMode ? 'bg-[#1E192F] border-[#4C3D75] text-[#A78BFA] hover:bg-[#8B5CF6] hover:text-white' : 'bg-[#FAF9FD] border-[#DDD6FE] text-[#7C3AED] hover:bg-[#F3F0FF] hover:border-[#8B5CF6]'
                    }`}
                  >
                    Import
                  </button>
                </div>
              </div>

              {/* Spin Button */}
              <div className="pt-3">
                <button
                  onClick={handleSpin}
                  disabled={isSpinning || entries.filter(e => e.active !== false).length === 0}
                  className="w-full bg-gradient-to-r from-[#7C3AED] to-[#DB2777] hover:from-[#6D28D9] hover:to-[#BE185D] text-white py-4 px-6 rounded-2xl font-black text-sm tracking-wider shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
                >
                  <Play className="w-4 h-4 fill-current" />
                  SPIN THE WHEEL
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-extrabold">Remove winner after spin</label>
                    <p className="text-xs text-[#8E8AA7]">Automatically eliminate the winner from the wheel.</p>
                  </div>
                  <button
                    onClick={() => setRemoveWinnerAfterSpin(!removeWinnerAfterSpin)}
                    className={`w-12 h-6 rounded-full p-1 transition-all ${
                      removeWinnerAfterSpin ? 'bg-[#8B5CF6]' : 'bg-[#E5E7EB]'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                      removeWinnerAfterSpin ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className={`flex items-center justify-between border-t pt-4 ${darkMode ? 'border-[#2D2342]' : 'border-[#F1EFF9]'}`}>
                  <div>
                    <label className="text-sm font-extrabold">Weighted entries</label>
                    <p className="text-xs text-[#8E8AA7]">Use per-entry weights to bias the odds.</p>
                  </div>
                  <button
                    onClick={() => {
                      const mode = !weightedEntries;
                      setWeightedEntries(mode);
                      if (mode) setChancePercentages(false);
                    }}
                    className={`w-12 h-6 rounded-full p-1 transition-all ${
                      weightedEntries ? 'bg-[#8B5CF6]' : 'bg-[#E5E7EB]'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                      weightedEntries ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className={`flex items-center justify-between border-t pt-4 ${darkMode ? 'border-[#2D2342]' : 'border-[#F1EFF9]'}`}>
                  <div>
                    <label className="text-sm font-extrabold">Chance percentages</label>
                    <p className="text-xs text-[#8E8AA7]">Set exact percentage chances for each entry.</p>
                  </div>
                  <button
                    onClick={() => {
                      const mode = !chancePercentages;
                      setChancePercentages(mode);
                      if (mode) setWeightedEntries(false);
                    }}
                    className={`w-12 h-6 rounded-full p-1 transition-all ${
                      chancePercentages ? 'bg-[#8B5CF6]' : 'bg-[#E5E7EB]'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                      chancePercentages ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className={`flex items-center justify-between border-t pt-4 ${darkMode ? 'border-[#2D2342]' : 'border-[#F1EFF9]'}`}>
                  <div>
                    <label className="text-sm font-extrabold">Sound effects</label>
                    <p className="text-xs text-[#8E8AA7]">Ticks and a winning fanfare.</p>
                  </div>
                  <button
                    onClick={() => setSoundEffects(!soundEffects)}
                    className={`w-12 h-6 rounded-full p-1 transition-all ${
                      soundEffects ? 'bg-[#8B5CF6]' : 'bg-[#E5E7EB]'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                      soundEffects ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className={`border-t pt-4 space-y-2 ${darkMode ? 'border-[#2D2342]' : 'border-[#F1EFF9]'}`}>
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-extrabold">Spin duration: {spinDuration}s</label>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    value={spinDuration}
                    onChange={(e) => setSpinDuration(parseInt(e.target.value))}
                    className="w-full accent-[#8B5CF6]"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-[#A09BB9] uppercase">
                    <span>Quick (2s)</span>
                    <span>Realistic (5s)</span>
                    <span>Dramatic (15s)</span>
                  </div>
                </div>
              </div>

              {/* Saved list presets */}
              <div className={`border-t pt-5 space-y-4 ${darkMode ? 'border-[#2D2342]' : 'border-[#F1EFF9]'}`}>
                <div>
                  <h3 className="text-xs font-bold text-[#8E8AA7] uppercase tracking-wider mb-2">Saved lists</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="List name"
                      className={`flex-1 text-xs p-3 rounded-xl focus:outline-none border ${
                        darkMode ? 'bg-[#1E192F] border-[#4C3D75] text-[#F1EFF9]' : 'bg-[#FAF9FD] border-[#DDD6FE] text-[#2D2342]'
                      }`}
                    />
                    <button
                      onClick={handleSaveCurrentList}
                      disabled={!newListName.trim() || entries.length === 0}
                      className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {savedLists.length === 0 ? (
                    <p className="text-xs text-[#8E8AA7]">No saved lists yet.</p>
                  ) : (
                    savedLists.map((list, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs border ${
                          darkMode ? 'bg-[#1E192F] border-[#2D2342]' : 'bg-[#FAF9FD] border-[#EBE8F5]'
                        }`}
                      >
                        <div>
                          <p className="font-bold">{list.name}</p>
                          <p className="text-[#8E8AA7]">{list.entries.length} names</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => loadSavedList(list)}
                            className={`font-extrabold py-1.5 px-3 rounded-lg transition-all border ${
                              darkMode ? 'bg-[#2D2342] border-[#3E3466] text-purple-300 hover:bg-[#392E5C]' : 'bg-white border-[#EBE8F5] hover:bg-[#F3F0FF] hover:border-[#8B5CF6] text-[#7C3AED]'
                            }`}
                          >
                            Load
                          </button>
                          <button
                            onClick={() => setSavedLists(savedLists.filter((_, i) => i !== idx))}
                            className={`p-1.5 rounded-lg transition-all ${
                              darkMode ? 'text-[#8E8AA7] hover:text-red-400 hover:bg-red-950/20' : 'text-[#A09BB9] hover:text-red-500 hover:bg-red-50'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#8E8AA7] uppercase tracking-wider">
                  <Award className="w-4 h-4 text-[#F59E0B]" />
                  Past winners
                </span>
                {history.length > 0 && (
                  <button
                    onClick={() => setHistory([])}
                    className="text-xs font-extrabold text-[#8E8AA7] hover:text-red-600 transition-all"
                  >
                    Clear history
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className={`text-center py-12 border border-dashed rounded-2xl ${darkMode ? 'border-[#2D2342]' : 'border-[#EBE8F5]'}`}>
                  <HistoryIcon className="w-8 h-8 text-[#DDD6FE] mx-auto mb-2" />
                  <p className="text-xs text-[#8E8AA7]">Spin the wheel to record winners.</p>
                </div>
              ) : (
                <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {history.map((item, idx) => (
                    <div 
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        darkMode ? 'bg-[#1E192F] border-[#2D2342]' : 'bg-[#FDFDFD] border-[#EBE8F5]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center text-xs font-bold border border-yellow-200">
                          {history.length - idx}
                        </span>
                        <span className="text-sm font-bold">{item.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#8E8AA7]">{item.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* 🌟 ABOUT THIS WEBSITE & HOW IT WORKS 🌟 */}
      <section className={`border-t mt-16 py-16 px-6 transition-colors duration-300 ${
        darkMode ? 'bg-[#141021] border-[#2D2342]' : 'bg-white border-[#EBE8F5]'
      }`}>
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Section 1: Hero Pitch */}
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center gap-2 border px-4 py-1.5 rounded-full text-xs font-bold ${
              darkMode ? 'bg-[#1E192F] border-[#4C3D75] text-purple-300' : 'bg-[#F5F3FF] border-[#DDD6FE] text-[#7C3AED]'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Random Selection Engine</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight">
              About Mega Wheel of Names
            </h2>
            <p className="text-sm text-[#8E8AA7] max-w-2xl mx-auto leading-relaxed">
              Designed for educators, sweepstake organizers, tabletop RPG gamers, and everyday decision-makers. 
              Our application combines a dynamic physical simulation engine, synthesized real-time DSP sound design, and proportional probability algorithms into a single on-device web environment.
            </p>
          </div>

          {/* Section 2: Premium Features Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className={`p-6 rounded-2xl border hover:border-[#DDD6FE] transition-all space-y-3 ${
              darkMode ? 'bg-[#1E192F] border-[#2D2342]' : 'bg-[#FAF9FD] border-[#EBE8F5]'
            }`}>
              <div className="w-10 h-10 bg-[#EEF2FF] text-[#4F46E5] rounded-xl flex items-center justify-center shadow-sm">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold">Proportional Odds Balancer</h3>
              <p className="text-xs text-[#8E8AA7] leading-relaxed">
                Manually shift percentages or adjust entry weights. Our real-time scaler automatically balances adjacent slices to sum perfectly to 100% without breaking wheel symmetry.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border hover:border-[#DDD6FE] transition-all space-y-3 ${
              darkMode ? 'bg-[#1E192F] border-[#2D2342]' : 'bg-[#FAF9FD] border-[#EBE8F5]'
            }`}>
              <div className="w-10 h-10 bg-[#ECFDF5] text-[#059669] rounded-xl flex items-center justify-center shadow-sm">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold">Web Audio DSP Audio</h3>
              <p className="text-xs text-[#8E8AA7] leading-relaxed">
                Zero network requests or audio file dependencies. Real-time sound synthesis mimics wooden pegs striking canvas segments, complete with an arpeggio chord fanfare upon winning.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border hover:border-[#DDD6FE] transition-all space-y-3 ${
              darkMode ? 'bg-[#1E192F] border-[#2D2342]' : 'bg-[#FAF9FD] border-[#EBE8F5]'
            }`}>
              <div className="w-10 h-10 bg-[#FFFBEB] text-[#D97706] rounded-xl flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold">100% Client-Side Privacy</h3>
              <p className="text-xs text-[#8E8AA7] leading-relaxed">
                All data resides solely in your browser's working memory. No names, weights, or winning history are ever transmitted or stored on remote servers, providing maximum privacy.
              </p>
            </div>

          </div>

          {/* Section 3: Interactive FAQ / Guides */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-center mb-8">
              Frequently Asked Questions & Guides
            </h3>
            
            <div className="space-y-3.5">
              {[
                {
                  question: "How does the RPG Dice Preset mode work?",
                  answer: "By selecting D4, D6, D8, D10, D12, or D20 in the 'RPG Dice Modes' panel, the entry pool automatically populates with matching dice faces. Slices are dynamically color-coded with an alternating, highly legible gemstone palette designed specifically for tabletop gaming night or classroom exercises."
                },
                {
                  question: "What is the difference between Hiding and Deleting an option?",
                  answer: "Hiding an entry (using the eye icon) temporarily removes it from active play without losing its setup parameters; the balancer automatically scales the remaining options to 100%. Deleting permanently wipes the name and configuration from the active session pool."
                },
                {
                  question: "Can I save custom lists for future runs?",
                  answer: "Absolutely! Go to the 'Settings' tab, type a list name under 'Saved lists' and hit Save. You can save as many different configurations as your session needs, loading them instantaneously at any point."
                }
              ].map((faq, idx) => (
                <div 
                  key={idx}
                  className={`border rounded-2xl overflow-hidden transition-all ${
                    darkMode ? 'bg-[#1E192F] border-[#2D2342]' : 'bg-[#FAF9FD] border-[#EBE8F5]'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className={`w-full text-left py-4 px-6 font-extrabold text-sm flex justify-between items-center focus:outline-none transition-colors ${
                      darkMode ? 'text-[#F1EFF9] hover:text-[#A78BFA]' : 'text-[#2D2342] hover:text-[#7C3AED]'
                    }`}
                  >
                    <span>{faq.question}</span>
                    <span className="text-lg text-[#8E8AA7]">
                      {openFaqIndex === idx ? '−' : '+'}
                    </span>
                  </button>
                  {openFaqIndex === idx && (
                    <div className={`px-6 pb-4 pt-1 text-xs text-[#8E8AA7] leading-relaxed border-t ${
                      darkMode ? 'bg-[#161224] border-[#2D2342]' : 'bg-white border-[#F3F1FA]'
                    }`}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Website Footer */}
      <footer className={`py-12 px-6 border-t text-center text-xs text-[#8E8AA7] font-semibold space-y-4 ${
        darkMode ? 'bg-[#0B0914] border-[#2D2342]' : 'bg-[#F6F4FB] border-[#EBE8F5]'
      }`}>
        <div className="flex justify-center gap-6 text-[#5B5570]">
          <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('entries'); window.scrollTo({top: 0, behavior: 'smooth'});}} className="hover:text-[#7C3AED]">Home Wheel</a>
          <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('settings'); window.scrollTo({top: 0, behavior: 'smooth'});}} className="hover:text-[#7C3AED]">System Settings</a>
          <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('history'); window.scrollTo({top: 0, behavior: 'smooth'});}} className="hover:text-[#7C3AED]">Winner History</a>
        </div>
        <p>© {new Date().getFullYear()} Mega Wheel of Names. Built to deliver perfect randomness.</p>
        <p className="text-[10px] text-[#A09BB9]">Licensed under MIT. Absolutely no registration or tracking cookies required.</p>
        
        {/* 🚀 AI VIBE-CODED DISCLAIMER 🚀 */}
        <div className={`max-w-md mx-auto mt-6 p-4 rounded-2xl border text-[11px] font-medium leading-relaxed shadow-sm transition-all ${
          darkMode ? 'bg-[#151025] border-purple-900/60 text-purple-300' : 'bg-[#F5F3FF] border-[#E9D5FF] text-[#6D28D9]'
        }`}>
          <div className="flex items-center justify-center gap-1.5 mb-1 text-xs font-extrabold uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Vibe-Coded Project</span>
          </div>
          Designed &amp; constructed instantly under human supervision using advanced generative AI modeling. Crafted in single-file paradigm, zero-latency rendering, and Web Audio DSP.
        </div>
      </footer>

      {/* WINNER LANDING CELEBRATION MODAL */}
      {showWinnerModal && winner && (
        <div className="fixed inset-0 z-50 bg-[#2D2342]/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden transform transition-all animate-bounce-subtle border ${
            darkMode ? 'bg-[#1E192F] border-[#3E3466] shadow-[0_32px_64px_rgba(0,0,0,0.6)]' : 'bg-white border-[#EBE8F5] shadow-[0_32px_64px_rgba(45,35,66,0.35)]'
          }`}>
            
            <div className="absolute top-[-20%] left-[-20%] w-48 h-48 rounded-full bg-[#8B5CF6]/10 blur-xl pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-48 h-48 rounded-full bg-[#EC4899]/10 blur-xl pointer-events-none" />

            <div className="w-20 h-20 bg-gradient-to-tr from-[#F59E0B] to-[#FBBF24] text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200">
              <Award className="w-10 h-10" />
            </div>

            <p className="text-xs uppercase tracking-widest text-[#8E8AA7] font-black">We have a winner!</p>
            <h2 className="text-3xl font-black mt-1 mb-6 break-words leading-tight">
              {winner.name}
            </h2>

            {/* Premium Three Action Options: Close/Keep, Hide, Delete */}
            <div className="flex flex-col gap-2.5">
              
              <button
                onClick={() => handleModalAction('close')}
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-extrabold py-3 px-4 rounded-2xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Keep on Wheel (Close)
              </button>

              <button
                onClick={() => handleModalAction('hide')}
                className={`w-full font-bold py-3 px-4 rounded-2xl transition-all text-sm flex items-center justify-center gap-2 ${
                  darkMode ? 'bg-[#3E3466] hover:bg-[#4C3D75] text-amber-200' : 'bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E]'
                }`}
                title="Hides this segment, maintaining it in list for later unhiding"
              >
                <EyeOff className="w-4 h-4" />
                Hide Option
              </button>
              
              <button
                onClick={() => handleModalAction('delete')}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-3 px-4 rounded-2xl transition-all text-sm flex items-center justify-center gap-2"
                title="Permanently delete from session list"
              >
                <Trash2 className="w-4 h-4" />
                Delete Option
              </button>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}