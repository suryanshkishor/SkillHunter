import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Stars, Sparkles, Box, Torus, Sphere, Cylinder, Grid, Icosahedron, Dodecahedron, Octahedron } from '@react-three/drei';
import { GoogleGenAI } from "@google/genai";
import { Zap, Terminal, Shield, Activity, User, Lock, Briefcase, Trophy, Target, Settings, LogOut, Sword, Play, ChevronLeft, ChevronRight, MessageSquare, Send, BookOpen, AlertCircle, Cpu, Crosshair, X } from 'lucide-react';
import * as THREE from 'three';

// --- CONFIGURATION ---
const THEME = {
  cyan: '#00f3ff',
  purple: '#bc13fe',
  gold: '#ffd700',
  red: '#ff003c',
  green: '#0aff0a',
  orange: '#ff9900',
  dark: '#050510',
};

// --- TYPES & DATA ---
type GameState = 'LOGIN' | 'LOBBY' | 'MAP' | 'BATTLE' | 'INVENTORY';

const CHARACTERS = [
    {
        id: 'vanguard',
        name: 'VANGUARD',
        role: 'ASSAULT // FRONTEND',
        desc: 'Specializes in UI/UX architecture. Fast visual prototyping.',
        color: THEME.cyan,
        stats: { speed: 90, logic: 60, creativity: 80 }
    },
    {
        id: 'specter',
        name: 'SPECTER',
        role: 'RECON // DATA SCIENTIST',
        desc: 'Master of algorithms. Detects bugs before they exist.',
        color: THEME.purple,
        stats: { speed: 50, logic: 100, creativity: 40 }
    },
    {
        id: 'titan',
        name: 'TITAN',
        role: 'DEFENSE // BACKEND',
        desc: 'Unbreakable infrastructure. Scales databases effortlessly.',
        color: THEME.orange,
        stats: { speed: 40, logic: 85, creativity: 50 }
    }
];

const JOB_DATA = [
  {
    id: 1,
    title: "SENIOR REACT DEV",
    level: 50,
    salary: "$160k",
    hp: 100,
    requiredSkills: ["REACT", "TYPESCRIPT", "ZUSTAND", "NEXTJS"],
    courses: ["Advanced React Patterns", "TypeScript for Pros", "State Management Mastery", "Next.js Enterprise Guide"],
    pos: [2, 0, 0],
    color: THEME.cyan
  },
  {
    id: 2,
    title: "AI ENGINEER",
    level: 75,
    salary: "$210k",
    hp: 120,
    requiredSkills: ["PYTHON", "PYTORCH", "LLM", "RAG"],
    courses: ["Deep Learning Specialization", "LLM Architecture", "Prompt Engineering 101", "Vector DB Fundamentals"],
    pos: [6, 0, -5],
    color: THEME.purple
  },
  {
    id: 3,
    title: "CYBER SECURITY",
    level: 60,
    salary: "$145k",
    hp: 110,
    requiredSkills: ["NETSEC", "ETHICAL HACKING", "CRYPTOGRAPHY", "PEN-TESTING"],
    courses: ["CompTIA Security+", "Certified Ethical Hacker (CEH)", "Network Defense Essentials", "Cyber Threat Intelligence"],
    pos: [-4, 0, -6],
    color: THEME.red
  }
];

// --- 3D COMPONENTS ---

const CameraDirector = ({ gameState }: { gameState: GameState }) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    switch (gameState) {
        case 'LOGIN':
            // Cinematic idle movement
            const t = state.clock.getElapsedTime();
            targetPos.current.set(Math.sin(t * 0.1) * 3, 2 + Math.cos(t * 0.15), 9);
            targetLook.current.set(0, 0, 0);
            break;
        case 'LOBBY':
            targetPos.current.set(-2, 1, 4.5); 
            targetLook.current.set(-2, 0.5, 0);
            break;
        case 'MAP':
            targetPos.current.set(0, 15, 5); 
            targetLook.current.set(0, 0, -5);
            break;
        case 'BATTLE':
            // Over the shoulder action cam
            targetPos.current.set(-2, 2, 6); 
            targetLook.current.set(2, 0, 0);
            break;
        case 'INVENTORY':
            targetPos.current.set(-4, 1, 4); 
            targetLook.current.set(-3, 0, 0);
            break;
        default:
            targetPos.current.set(0, 5, 10);
    }
    
    camera.position.lerp(targetPos.current, delta * 2);
    const currentLook = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion).add(camera.position);
    currentLook.lerp(targetLook.current, delta * 2);
    camera.lookAt(currentLook);
  });
  return null;
};

// Tactical Drone that represents the AI Chatbot
const TacticalDrone = ({ isThinking, position = [-2, 2, 2] }: { isThinking: boolean, position?: [number, number, number] }) => {
    const group = useRef<THREE.Group>(null);
    const bodyMesh = useRef<THREE.Group>(null);
    const ringRef = useRef<THREE.Mesh>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    // Idle state
    const nextBlink = useRef(Math.random() * 3 + 1);
    const isBlinking = useRef(false);
    const blinkDuration = 0.2;
    const blinkTimer = useRef(0);

    const targetRotY = useRef(0);
    const nextLookTime = useRef(0);

    useFrame((state, delta) => {
        if(!group.current || !bodyMesh.current || !ringRef.current || !lightRef.current) return;
        const t = state.clock.getElapsedTime();

        // 1. Advanced Hover (Breathing)
        // Combine two sine waves for less robotic movement
        const hoverY = Math.sin(t * 1.5) * 0.15 + Math.sin(t * 0.5) * 0.05;
        group.current.position.y = position[1] + hoverY;
        
        // 2. Looking Around (Head Turns)
        if (t > nextLookTime.current) {
            // Pick a new random angle within -45 to 45 degrees relative to front
            targetRotY.current = (Math.random() - 0.5) * 1.5; 
            nextLookTime.current = t + 2 + Math.random() * 3;
        }
        
        // Smoothly rotate body towards target
        // We add a continuous slow rotation as well to keep it alive
        const idleRot = Math.sin(t * 0.2) * 0.2;
        bodyMesh.current.rotation.y = THREE.MathUtils.lerp(bodyMesh.current.rotation.y, targetRotY.current + idleRot, delta * 2);
        
        // Tilt slightly when moving/rotating
        bodyMesh.current.rotation.z = Math.sin(t * 1) * 0.05;
        bodyMesh.current.rotation.x = Math.sin(t * 0.7) * 0.05;

        // 3. Blinking (Aperture effect on ring)
        if (t > nextBlink.current && !isThinking) { // Don't blink if thinking (busy)
            isBlinking.current = true;
            blinkTimer.current = 0;
            nextBlink.current = t + 3 + Math.random() * 5;
        }

        if (isBlinking.current) {
            blinkTimer.current += delta;
            // Parabolic blink curve: 0 -> 1 -> 0
            const progress = blinkTimer.current / blinkDuration;
            if (progress >= 1) {
                isBlinking.current = false;
                ringRef.current.scale.set(1, 1, 1);
                lightRef.current.intensity = 5;
            } else {
                // Close aperture (scale down)
                const closeAmount = Math.sin(progress * Math.PI); // 0 at start, 1 at mid, 0 at end
                const scale = 1 - closeAmount * 0.9; // Scale down to 0.1
                ringRef.current.scale.set(scale, scale, scale);
                lightRef.current.intensity = 5 * (1 - closeAmount * 0.8); // Dim light
            }
        } else {
             // Pulse effect when thinking
             if (isThinking) {
                 const pulse = Math.sin(t * 10) * 0.2 + 1;
                 ringRef.current.scale.set(pulse, pulse, pulse);
                 lightRef.current.intensity = 5 + Math.sin(t * 10) * 2;
             } else {
                 ringRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 5);
                 lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 5, delta * 2);
             }
        }
    });

    return (
        <group ref={group} position={new THREE.Vector3(...position)}>
            <group ref={bodyMesh}>
                <Sphere args={[0.2, 16, 16]}>
                    <meshStandardMaterial color="#222" roughness={0.4} metalness={0.8} />
                </Sphere>
                {/* Mechanical details */}
                <Box args={[0.25, 0.02, 0.25]} position={[0, 0, 0]}>
                     <meshStandardMaterial color="#111" />
                </Box>
                
                {/* Eye Ring */}
                <group rotation={[Math.PI/2, 0, 0]}>
                    <Torus ref={ringRef} args={[0.3, 0.02, 16, 32]}>
                        <meshBasicMaterial color={isThinking ? THEME.orange : THEME.cyan} />
                    </Torus>
                </group>

                {/* Main Light / Eye */}
                <pointLight ref={lightRef} color={isThinking ? THEME.orange : THEME.cyan} distance={5} decay={2} intensity={5} />
                
                {/* Lens Flare core */}
                 <Sphere args={[0.08, 16, 16]}>
                    <meshBasicMaterial color={isThinking ? THEME.orange : THEME.cyan} transparent opacity={0.8} />
                </Sphere>
            </group>
        </group>
    )
}

const CharacterModel = ({ type, color }: { type: string, color: string }) => {
  const group = useRef<THREE.Group>(null);
  const headGroup = useRef<THREE.Group>(null);
  const bodyGroup = useRef<THREE.Group>(null);
  const visorRef = useRef<THREE.Mesh>(null);
  
  // Animation state
  const nextBlinkTime = useRef(Math.random() * 3 + 1);
  const isBlinking = useRef(false);

  useFrame((state) => {
    if (!group.current || !headGroup.current || !bodyGroup.current || !visorRef.current) return;
    const t = state.clock.getElapsedTime();

    // 1. Idle Float (Whole Character)
    group.current.position.y = Math.sin(t * 1.5) * 0.02 - 1; 

    // 2. Breathing (Body)
    const breathCyc = Math.sin(t * 2.5);
    const scaleY = 1 + breathCyc * 0.015; 
    bodyGroup.current.scale.set(1, scaleY, 1);
    
    // 3. Head Animation
    // Smooth random-looking rotation
    headGroup.current.rotation.y = Math.sin(t * 0.3) * 0.15 + Math.sin(t * 1.1) * 0.05;
    headGroup.current.rotation.x = Math.sin(t * 0.5) * 0.05;
    // Head bob connected to breathing (lagged slightly)
    headGroup.current.position.y = 1.6 + Math.sin(t * 2.5 - 0.5) * 0.005;

    // 4. Blinking
    if (t > nextBlinkTime.current) {
        isBlinking.current = true;
    }

    if (isBlinking.current) {
        visorRef.current.scale.y = THREE.MathUtils.lerp(visorRef.current.scale.y, 0.1, 0.4);
        if (visorRef.current.scale.y < 0.15) {
            isBlinking.current = false;
            nextBlinkTime.current = t + 2 + Math.random() * 4;
        }
    } else {
        visorRef.current.scale.y = THREE.MathUtils.lerp(visorRef.current.scale.y, 1, 0.2);
    }
  });

  return (
    <group ref={group} position={[-3, -1, 0]} rotation={[0, 0.4, 0]}>
       
       {/* HEAD GROUP */}
       <group ref={headGroup} position={[0, 1.6, 0]}>
          {/* Main Head Block */}
          <Box args={[0.45, 0.55, 0.5]} material-color="#1a1a2e" />
          
          {/* Visor / Eyes */}
          <Box ref={visorRef} args={[0.48, 0.15, 0.3]} position={[0, 0.05, 0.15]}>
              <meshBasicMaterial color={color} />
          </Box>

          {/* Specter Halo - moves with head now */}
          {type === 'specter' && (
             <Torus args={[0.6, 0.05, 16, 32]} rotation={[Math.PI/2, 0, 0]} position={[0, 0.2, 0]}>
                <meshBasicMaterial color={color} transparent opacity={0.5} />
             </Torus>
          )}
       </group>
       
       {/* BODY GROUP */}
       <group ref={bodyGroup} position={[0, 0.7, 0]}>
            {/* Main Torso */}
            <Box args={[0.7, 1.1, 0.4]} material-color="#111" />
            
            {/* Titan Armor - moves with body scale now */}
            {type === 'titan' && (
                <Box args={[1.2, 0.8, 0.6]} position={[0, 0.1, 0]} material-color="#222" />
            )}
       </group>

      <Cylinder args={[1, 1, 0.05, 32]} position={[0, 0, 0]}>
         <meshBasicMaterial color={color} wireframe opacity={0.3} transparent />
      </Cylinder>
    </group>
  );
};

const MapNodes = ({ onSelectJob }: { onSelectJob: (j: any) => void }) => {
    return (
        <group>
            {JOB_DATA.map((job) => (
                <group key={job.id} position={new THREE.Vector3(...job.pos)} onClick={() => onSelectJob(job)}>
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        <Dodecahedron args={[0.8, 0]}>
                            <meshStandardMaterial color={job.color} wireframe />
                        </Dodecahedron>
                        <Cylinder args={[0.1, 0.1, 10]} position={[0, 5, 0]}>
                            <meshBasicMaterial color={job.color} transparent opacity={0.2} />
                        </Cylinder>
                    </Float>
                    <Text position={[0, 1.5, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
                        {job.title}
                    </Text>
                </group>
            ))}
            <Grid infiniteGrid fadeDistance={30} sectionColor={THEME.purple} cellColor={THEME.dark} />
        </group>
    );
};

const EnemyBoss = ({ job, hp, maxHp }: { job: any, hp: number, maxHp: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const minionsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || !coreRef.current || !ringRef.current || !minionsRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // 1. Dynamic Hover (Complex Wave)
    groupRef.current.position.y = 0.5 + Math.sin(t * 0.8) * 0.2 + Math.cos(t * 0.3) * 0.05;

    // 2. Breathing (Scale) - Inner Core pulsing with health status
    // Pulse faster if low HP?
    const healthPercent = hp / maxHp;
    const pulseSpeed = 2 + (1 - healthPercent) * 5; // Faster when low HP
    const breath = 1 + Math.sin(t * pulseSpeed) * 0.05;
    coreRef.current.scale.set(breath, breath, breath);

    // 3. Pose Shift (Rotation)
    // Base rotation + subtle wobbles
    groupRef.current.rotation.y += 0.005; 
    groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.05; 
    groupRef.current.rotation.z = Math.cos(t * 0.35) * 0.05; 

    // 4. Ring Animation (Gyroscopic / Unstable)
    ringRef.current.rotation.x = Math.sin(t * 0.5) * 0.4;
    ringRef.current.rotation.y = Math.cos(t * 0.4) * 0.4;
    ringRef.current.rotation.z -= 0.02;

    // 5. Minions Orbit & Float
    minionsRef.current.rotation.y -= 0.01; // Orbit entire group
    minionsRef.current.children.forEach((minion, i) => {
        // Individual bobbing for minions relative to group
        const offset = i * 2;
        minion.position.y = Math.sin(t * 2 + offset) * 0.3;
        // Individual rotation
        minion.rotation.x += 0.02;
        minion.rotation.y += 0.03;
    });
  });

  if (hp <= 0) return null;

  return (
    <group ref={groupRef} position={[3, 0.5, 0]}>
        {/* Inner Core Group (Breathing) */}
        <group ref={coreRef}>
            <mesh>
              <Octahedron args={[1.5, 0]}>
                 <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
              </Octahedron>
              <meshBasicMaterial color={job.color} wireframe transparent opacity={0.3} />
            </mesh>
            
            {/* Glowing Center */}
            <mesh scale={[0.5, 0.5, 0.5]}>
                <Icosahedron args={[1, 1]}>
                    <meshBasicMaterial color={THEME.red} />
                </Icosahedron>
            </mesh>
        </group>

        {/* Shield Ring (Independent Rotation) */}
        <Torus ref={ringRef} args={[2.5, 0.05, 16, 64]}>
            <meshBasicMaterial color={THEME.red} transparent opacity={0.5} />
        </Torus>
        
        {/* Minions Group */}
        <group ref={minionsRef}>
            {[...Array(3)].map((_, i) => (
                 <mesh key={i} position={[Math.cos(i * (Math.PI * 2 / 3)) * 3.5, 0, Math.sin(i * (Math.PI * 2 / 3)) * 3.5]}>
                     <Octahedron args={[0.3, 0]}>
                        <meshBasicMaterial color={THEME.red} wireframe />
                     </Octahedron>
                 </mesh>
            ))}
        </group>

        <Text position={[0, 2.8, 0]} fontSize={0.4} color={THEME.red} font="https://fonts.gstatic.com/s/orbitron/v25/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nygyU.woff">
            {job.title}
        </Text>
    </group>
  );
};

const Effects = () => {
    return (
        <>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.2} color={THEME.cyan} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} color={THEME.cyan} intensity={2} />
            <pointLight position={[-10, 5, -10]} color={THEME.purple} intensity={2} />
        </>
    );
};

// --- UI COMPONENTS ---

const TacticalChat = ({ isOpen, toggleOpen }: { isOpen: boolean, toggleOpen: () => void }) => {
    const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial greeting
        if (messages.length === 0) {
            setMessages([{ sender: 'AI', text: 'Tactical Uplink Established. Awaiting orders.' }]);
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        
        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'YOU', text: userMsg }]);
        setInput("");
        setIsTyping(true);

        try {
            // Check for API Key
            if (!process.env.API_KEY) {
                setTimeout(() => {
                    setMessages(prev => [...prev, { sender: 'AI', text: 'API KEY MISSING. SIMULATION MODE: Focus on the objectives.' }]);
                    setIsTyping(false);
                }, 1000);
                return;
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `You are a military tactical AI advisor in a cyberpunk career game. The user is fighting a career boss. Provide short, punchy advice about: ${userMsg}. Keep it under 20 words.`
            });
            
            const text = response.text || "";
            if (text) {
                setMessages(prev => [...prev, { sender: 'AI', text: text }]);
            }
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { sender: 'AI', text: 'CONNECTION LOST. RE-ENGAGE.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    if (!isOpen) {
        return (
             <div 
                onClick={toggleOpen}
                className="absolute bottom-10 left-10 w-80 bg-black/40 p-4 border-l-2 border-neon-cyan animate-slide-in cursor-pointer hover:bg-black/60 transition-colors pointer-events-auto z-50"
            >
                <div className="text-xs font-mono text-neon-cyan mb-2 flex justify-between">
                    <span>SQUAD COMMS</span>
                    <span className="animate-pulse">ONLINE</span>
                </div>
                <div className="text-sm text-gray-300 font-ui truncate">
                    <span className="text-neon-purple">AI:</span> {messages[messages.length-1]?.text}
                </div>
            </div>
        );
    }

    return (
        <div className="absolute bottom-10 left-10 w-96 h-80 bg-black/90 border border-neon-cyan clip-angled flex flex-col pointer-events-auto animate-slide-up z-50 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="flex justify-between items-center p-3 bg-neon-cyan/10 border-b border-neon-cyan/30">
                <span className="text-neon-cyan font-heading text-sm">TACTICAL FEED</span>
                <button onClick={toggleOpen} className="text-gray-400 hover:text-white"><ChevronLeft size={16}/></button>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m, i) => (
                    <div key={i} className={`text-xs font-mono leading-relaxed ${m.sender === 'YOU' ? 'text-right text-gray-300' : 'text-neon-cyan'}`}>
                        <span className="opacity-50 text-[10px] block mb-0.5">{m.sender}</span>
                        <div className={`inline-block p-2 rounded ${m.sender === 'YOU' ? 'bg-white/10' : 'bg-neon-cyan/10 border-l-2 border-neon-cyan'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isTyping && <div className="text-neon-cyan/50 text-xs animate-pulse p-2">AI IS TYPING...</div>}
            </div>

            <form onSubmit={handleSend} className="p-2 border-t border-neon-cyan/30 flex gap-2">
                <input 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder-gray-600"
                    placeholder="REQUEST INTEL..."
                />
                <button type="submit" className="text-neon-cyan hover:text-white"><Send size={16} /></button>
            </form>
        </div>
    );
};

const AiGuideTooltip = ({ onDismiss }: { onDismiss: () => void }) => (
    <div className="absolute bottom-24 left-10 max-w-xs animate-slide-up z-[60] pointer-events-auto">
        <div className="relative bg-neon-cyan/10 border border-neon-cyan p-4 clip-angled backdrop-blur-md shadow-[0_0_20px_rgba(0,243,255,0.2)]">
            <button onClick={onDismiss} className="absolute top-1 right-2 text-neon-cyan hover:text-white"><X size={12} /></button>
            <div className="flex gap-3 items-start">
                 <div className="mt-1 animate-pulse"><AlertCircle size={20} className="text-neon-cyan" /></div>
                 <div>
                     <h4 className="text-neon-cyan font-bold font-mono text-xs tracking-widest mb-1">NEW INTEL AVAILABLE</h4>
                     <p className="text-gray-300 text-xs leading-relaxed font-ui">
                         Operator, establish uplink with the Tactical Drone for mission briefing.
                     </p>
                 </div>
            </div>
            {/* Pointer to the chat button below */}
            <div className="absolute -bottom-2 left-8 w-4 h-4 bg-neon-cyan/10 border-r border-b border-neon-cyan transform rotate-45"></div>
        </div>
    </div>
);

const CourseDetailView = ({ courseName, onClose }: { courseName: string, onClose: () => void }) => {
    // Generate gamified dummy data for any course
    const details = {
        steps: [
            "Initialize Knowledge Base: Core Concepts & Syntax",
            "Acquire Toolset: Environment Setup & Config",
            "Execute Simulation: Build 3 Practice Projects",
            "Final Assessment: Certification Exam / Capstone"
        ],
        demand: 94,
        companies: ["CYBERDYNE SYSTEMS", "MASSIVE DYNAMIC", "HOOLI", "E CORP", "TYRELL CORP"]
    };

    return (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-10 animate-slide-up pointer-events-auto">
             <div className="w-[800px] bg-dark/95 border border-neon-cyan/50 p-8 clip-angled relative shadow-[0_0_50px_rgba(0,243,255,0.2)]">
                <button onClick={onClose} className="absolute top-4 right-8 text-gray-500 hover:text-white font-mono flex items-center gap-1 group">
                    <span className="group-hover:text-neon-red transition-colors">[CLOSE_UPLINK]</span> <X size={16} />
                </button>
                
                <div className="flex items-center gap-6 mb-10 border-b border-gray-800 pb-6">
                    <div className="p-4 bg-neon-cyan/10 border border-neon-cyan rounded-full">
                        <BookOpen size={42} className="text-neon-cyan" />
                    </div>
                    <div>
                        <div className="text-xs font-mono text-neon-cyan tracking-[0.3em] mb-1">INTEL ACQUIRED</div>
                        <h2 className="text-4xl font-heading font-black text-white uppercase tracking-tight">{courseName}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-12">
                    {/* LEFT: STEPS */}
                    <div>
                        <h3 className="text-neon-gold font-bold font-mono mb-6 border-b border-gray-700 pb-2 flex items-center gap-2 tracking-widest text-sm">
                            <Target size={16}/> MISSION STEPS
                        </h3>
                        <div className="space-y-6">
                            {details.steps.map((step, i) => (
                                <div key={i} className="flex items-start gap-4 group cursor-default">
                                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center border border-gray-600 text-gray-500 font-mono text-xs group-hover:border-neon-cyan group-hover:text-neon-cyan group-hover:bg-neon-cyan/10 transition-colors">
                                        0{i+1}
                                    </div>
                                    <div className="text-gray-300 font-ui text-lg leading-tight group-hover:text-white transition-colors">{step}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: DEMAND */}
                    <div>
                         <h3 className="text-neon-red font-bold font-mono mb-6 border-b border-gray-700 pb-2 flex items-center gap-2 tracking-widest text-sm">
                            <Activity size={16}/> MARKET DEMAND
                        </h3>
                        
                        <div className="mb-8 p-4 bg-black/40 border border-gray-800 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-neon-red/5 group-hover:bg-neon-red/10 transition-colors"></div>
                            <div className="flex justify-between text-xs font-mono text-gray-400 mb-2 relative z-10">
                                <span>RELEVANCE SCORE</span>
                                <span className="text-neon-red font-bold animate-pulse">{details.demand}%</span>
                            </div>
                            <div className="w-full h-4 bg-gray-900 overflow-hidden skew-x-[-10deg] relative z-10">
                                <div className="h-full bg-neon-red shadow-[0_0_15px_#ff003c]" style={{ width: `${details.demand}%` }}></div>
                            </div>
                        </div>

                         <h3 className="text-neon-purple font-bold font-mono mb-4 border-b border-gray-700 pb-2 flex items-center gap-2 tracking-widest text-sm">
                            <Briefcase size={16}/> TOP RECRUITERS
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {details.companies.map((co, i) => (
                                <span key={i} className="px-3 py-1 bg-neon-purple/5 border border-neon-purple/30 text-neon-purple text-[10px] font-mono uppercase tracking-wider hover:bg-neon-purple/20 transition-colors cursor-help">
                                    {co}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-4 border-t border-gray-800 flex justify-end">
                    <button onClick={onClose} className="bg-neon-cyan text-black font-bold font-heading px-8 py-3 skew-x-[-10deg] hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] transition-all flex items-center gap-2 group">
                        <span>INITIATE LEARNING PROTOCOL</span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                </div>
             </div>
        </div>
    )
}

const CourseIntel = ({ courses, isOpen, onSelect }: { courses: string[], isOpen: boolean, onSelect: (c: string) => void }) => {
    if (!isOpen) return null;
    return (
        <div className="absolute top-48 right-0 w-[420px] pointer-events-none animate-slide-in z-40">
             {/* Header */}
             <div className="flex justify-end items-center gap-2 mb-4 pr-10">
                 <AlertCircle size={16} className="text-neon-gold animate-pulse" />
                 <span className="font-heading font-bold text-neon-gold tracking-widest text-sm uppercase">Mission Intel // Courses</span>
             </div>
             
             {/* List */}
             <div className="flex flex-col items-end gap-3 pr-0">
                 {courses.map((c, i) => (
                     <div key={i} className="group relative w-full flex justify-end transition-all hover:translate-x-[-10px]">
                        <button 
                            onClick={() => onSelect(c)}
                            className="bg-black/90 border-r-4 border-gray-700 text-gray-400 font-mono text-sm py-3 px-8 w-[90%] skew-x-[-20deg] hover:w-[95%] hover:bg-neon-cyan/10 hover:border-neon-cyan hover:text-white transition-all duration-200 cursor-pointer pointer-events-auto flex items-center justify-end gap-4 shadow-[0_0_15px_rgba(0,0,0,0.8)] backdrop-blur-md group-hover:shadow-[0_0_25px_rgba(0,243,255,0.15)]"
                        >
                             <span className="skew-x-[20deg] truncate text-right">{c}</span>
                             <BookOpen size={14} className="skew-x-[20deg] text-gray-600 group-hover:text-neon-cyan" />
                        </button>
                     </div>
                 ))}
             </div>
             <div className="mt-4 text-[10px] text-gray-600 font-mono text-right pr-12 tracking-widest uppercase">
                 Click to view learning trajectory
             </div>
        </div>
    );
};

const DamageFlash = ({ show }: { show: boolean }) => {
    if (!show) return null;
    return <div className="absolute inset-0 bg-neon-cyan/20 z-[100] animate-pulse pointer-events-none mix-blend-screen"></div>
};

const FloatingText = ({ text, x, y }: { text: string, x: number, y: number }) => {
    return (
        <div 
            className="absolute text-neon-gold font-heading font-black text-4xl pointer-events-none animate-slide-up shadow-black drop-shadow-lg"
            style={{ left: x, top: y }}
        >
            {text}
        </div>
    )
}

const BattleHud = ({ job, hp, maxHp, onFire, ammo, onLeave }: { job: any, hp: number, maxHp: number, onFire: (s:string, e: any)=>void, ammo: string[], onLeave: ()=>void }) => {
    const [intelOpen, setIntelOpen] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* TOP LEFT - ABORT */}
            <button 
                onClick={onLeave} 
                className="absolute top-8 left-8 pointer-events-auto bg-black/80 border border-white/20 text-white font-heading font-bold text-xs px-8 py-3 hover:bg-neon-red hover:border-neon-red transition-all skew-x-[-20deg] group shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            >
                <span className="block skew-x-[20deg] tracking-widest group-hover:animate-pulse">ABORT MISSION</span>
            </button>

            {/* TOP CENTER - COMPASS */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[600px] flex flex-col items-center">
                <div className="flex justify-between w-64 text-xs font-mono text-gray-500 font-bold mb-1">
                    <span>NW</span><span className="text-white">N</span><span>NE</span>
                </div>
                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-gray-600 to-transparent relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-neon-cyan rotate-45 shadow-[0_0_10px_#00f3ff]"></div>
                </div>
            </div>

            {/* RIGHT SIDE - BOSS BAR (MATCHING SCREENSHOT) */}
            <div className="absolute top-24 right-0 w-[55%] flex flex-col items-end pr-0">
                <div className="flex items-baseline gap-4 mb-2 pr-12 relative z-10">
                     <span className="text-white font-heading font-black text-4xl tracking-tighter uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: `0 0 20px ${job.color}` }}>{job.title}</span>
                     <span className="text-neon-red font-mono font-bold text-2xl">{Math.ceil((hp/maxHp)*100)}%</span>
                </div>
                {/* Thick Red Bar */}
                <div className="w-full h-6 bg-black/80 skew-x-[-30deg] relative overflow-hidden border-b-2 border-white/10">
                    <div 
                        className="h-full bg-gradient-to-r from-red-600 to-neon-red shadow-[0_0_20px_#ff003c] transition-all duration-200"
                        style={{ width: `${(hp/maxHp)*100}%` }}
                    />
                    {/* Gloss effect */}
                    <div className="absolute top-0 left-0 w-full h-[50%] bg-white/10"></div>
                </div>
            </div>

            {/* COURSE INTEL (Right side, integrated) */}
            <CourseIntel courses={job.courses} isOpen={intelOpen} onSelect={setSelectedCourse} />

            {/* COURSE DETAIL MODAL */}
            {selectedCourse && <CourseDetailView courseName={selectedCourse} onClose={() => setSelectedCourse(null)} />}

            {/* BOTTOM RIGHT - SKILL BUTTONS */}
            <div className="absolute bottom-12 right-12 flex gap-6 pointer-events-auto perspective-[1000px]">
                {job.requiredSkills.map((skill: string, i: number) => {
                    const available = ammo.includes(skill);
                    return (
                        <button 
                            key={skill}
                            onClick={(e) => onFire(skill, e)}
                            disabled={!available}
                            className={`
                                relative w-36 h-28 bg-black/40 border-2 ${available ? 'border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.2)]' : 'border-gray-800 opacity-50'} 
                                skew-x-[-10deg] flex flex-col items-center justify-center hover:bg-neon-cyan/10 transition-all group active:scale-95
                            `}
                        >
                            <div className="absolute top-2 left-3 text-[10px] text-gray-400 font-mono skew-x-[10deg]">{i+1}</div>
                            <div className="skew-x-[10deg] flex flex-col items-center w-full px-2">
                                <Zap size={28} className={`${available ? 'text-neon-cyan group-hover:drop-shadow-[0_0_8px_#00f3ff]' : 'text-gray-600'} transition-all mb-3`} />
                                <span className="text-[11px] font-bold text-white tracking-widest leading-none text-center w-full font-heading uppercase">{skill}</span>
                            </div>
                            {/* Corner accents */}
                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-neon-cyan/50"></div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

// --- LOGIN & LOBBY ---

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
    <div className="absolute inset-0 flex items-center justify-center z-50 overflow-hidden">
        {/* Decorative Grid Background (Overlay on 3D) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        
        <div className={`
            relative w-[500px] bg-[#050510]/90 border border-white/10 p-12 flex flex-col items-center 
            backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]
            transform transition-all duration-1000 ease-out
            ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}
            clip-angled
        `}>
             {/* Scanning Line Animation */}
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent h-[100%] w-full animate-scan pointer-events-none opacity-30"></div>

             {/* Header */}
             <div className="flex flex-col items-center mb-10 relative z-10">
                 <div className="flex items-center gap-3 mb-2">
                     <div className="relative">
                        <Cpu size={42} className="text-neon-cyan animate-pulse" />
                        <div className="absolute inset-0 bg-neon-cyan blur-md opacity-40"></div>
                     </div>
                     <h1 className="text-5xl font-heading font-black italic tracking-tighter text-white drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                        SKILL<span className="text-neon-cyan">HUNTER</span>
                     </h1>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="h-[1px] w-8 bg-gray-500"></div>
                    <div className="text-xs font-mono text-gray-400 tracking-[0.4em] uppercase">Season 5: Data Wars</div>
                    <div className="h-[1px] w-8 bg-gray-500"></div>
                 </div>
             </div>

             {/* Inputs */}
             <div className="w-full space-y-6 mb-10 relative z-10">
                 <div className="relative group">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-cyan transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-cyan"><User size={20} /></div>
                     <input 
                        type="text" 
                        placeholder="AGENT ID" 
                        defaultValue="AGENT_IO"
                        className="w-full bg-black/40 border border-gray-700 text-white pl-14 pr-4 py-4 font-mono text-sm focus:border-neon-cyan focus:bg-neon-cyan/5 focus:outline-none transition-all skew-x-[-10deg] placeholder-gray-600 hover:border-gray-500" 
                     />
                 </div>
                 <div className="relative group">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-purple transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-purple"><Lock size={20} /></div>
                     <input 
                        type="password" 
                        placeholder="ACCESS CODE" 
                        defaultValue="ACCESS_CODE"
                        className="w-full bg-black/40 border border-gray-700 text-white pl-14 pr-4 py-4 font-mono text-sm focus:border-neon-purple focus:bg-neon-purple/5 focus:outline-none transition-all skew-x-[-10deg] placeholder-gray-600 hover:border-gray-500" 
                     />
                 </div>
             </div>

             {/* Button */}
             <button 
                onClick={onLogin} 
                className="w-full relative group overflow-hidden skew-x-[-10deg]"
             >
                 <div className="absolute inset-0 bg-neon-cyan transform translate-y-1 transition-transform group-hover:translate-y-2"></div>
                 <div className="relative bg-neon-cyan py-5 flex items-center justify-center gap-3 transition-transform group-hover:-translate-y-1 group-active:translate-y-0">
                     <span className="font-heading font-black text-black text-xl tracking-[0.2em] relative z-10 group-hover:animate-pulse">INITIALIZE UPLINK</span>
                     <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors"></div>
                 </div>
             </button>
             
             {/* Footer Info */}
             <div className="mt-8 flex justify-between w-full text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                 <span className="flex items-center gap-1"><Shield size={10}/> Secure Connection</span>
                 <span className="flex items-center gap-1">V.5.0.2 <Activity size={10}/></span>
             </div>
        </div>
    </div>
    );
};

const LobbyScreen = ({ 
    onDeploy, 
    onInventory, 
    charIndex, 
    setCharIndex 
}: { 
    onDeploy: () => void, 
    onInventory: () => void, 
    charIndex: number, 
    setCharIndex: (i:number) => void 
}) => {
    const character = CHARACTERS[charIndex];
    const nextChar = () => setCharIndex((charIndex + 1) % CHARACTERS.length);
    const prevChar = () => setCharIndex((charIndex - 1 + CHARACTERS.length) % CHARACTERS.length);

    return (
        <div className="absolute inset-0 z-40 pointer-events-none">
            {/* TOP BAR */}
            <div className="absolute top-0 w-full flex justify-between p-6 pointer-events-auto bg-gradient-to-b from-black/80 to-transparent z-50">
                <div className="flex gap-8">
                    <div className="text-white">
                        <div className="text-xs text-gray-400 font-mono">RANK</div>
                        <div className="text-2xl font-heading font-bold text-neon-gold flex items-center gap-2"><Trophy size={20} /> PLATINUM IV</div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="p-2 hover:text-neon-cyan text-white transition"><Settings /></button>
                </div>
            </div>

            {/* CHARACTER SELECTOR */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-4 animate-slide-up">
                <div className="flex items-center gap-8">
                    <button onClick={prevChar} className="p-4 bg-black/60 border border-gray-600 hover:border-neon-cyan hover:bg-neon-cyan/20 clip-angled transition-all"><ChevronLeft size={32} className="text-white" /></button>
                    <div className="text-center w-80">
                         <div className="text-xs font-mono text-neon-cyan tracking-widest mb-1">SELECTED OPERATOR</div>
                         <h2 className="text-4xl font-heading font-black text-white italic tracking-tighter" style={{ textShadow: `0 0 15px ${character.color}` }}>{character.name}</h2>
                         <div className="text-sm font-bold text-gray-300 bg-black/50 px-2 py-1 inline-block mt-2 font-mono border border-gray-700">{character.role}</div>
                    </div>
                    <button onClick={nextChar} className="p-4 bg-black/60 border border-gray-600 hover:border-neon-cyan hover:bg-neon-cyan/20 clip-angled transition-all"><ChevronRight size={32} className="text-white" /></button>
                </div>
            </div>

            {/* DEPLOY BUTTON */}
            <div className="absolute right-10 bottom-10 flex flex-col items-end gap-4 pointer-events-auto animate-slide-in">
                <button onClick={onDeploy} className="group relative mt-4">
                    <div className="absolute inset-0 bg-neon-red blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                    <div className="relative bg-neon-red text-black px-12 py-6 font-black font-heading text-3xl tracking-widest clip-angled skew-x-[-10deg] hover:scale-105 transition-transform flex items-center gap-4">
                        DEPLOY <Play fill="black" />
                    </div>
                </button>
            </div>
        </div>
    );
};

const MapScreen = ({ onSelect, onBack }: { onSelect: (j:any)=>void, onBack: ()=>void }) => (
    <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 w-full bg-black/60 backdrop-blur p-4 flex justify-between pointer-events-auto border-b border-white/10 z-50">
             <h1 className="text-2xl font-heading text-white">CAREER WORLD MAP</h1>
             <button onClick={onBack} className="text-neon-cyan font-mono hover:text-white">RETURN TO LOBBY</button>
         </div>
         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/80 px-8 py-2 rounded-full border border-neon-cyan text-neon-cyan font-mono text-sm animate-pulse">
             SELECT A MISSION NODE TO DEPLOY
         </div>
    </div>
);

// --- MAIN APP ---

function App() {
  const [gameState, setGameState] = useState<GameState>('LOGIN');
  const [activeJob, setActiveJob] = useState(JOB_DATA[0]);
  const [bossHp, setBossHp] = useState(100);
  const [ammo, setAmmo] = useState<string[]>([]);
  const [charIndex, setCharIndex] = useState(0);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [hitFlash, setHitFlash] = useState(false);
  const [damageText, setDamageText] = useState<{text: string, x: number, y: number} | null>(null);
  
  // Global UI States
  const [chatOpen, setChatOpen] = useState(false);
  const [showAiPrompt, setShowAiPrompt] = useState(false);

  // Actions
  const handleLogin = () => {
      setGameState('LOBBY');
      setShowAiPrompt(true);
  };
  const handleDeploy = () => setGameState('MAP');
  const handleInventory = () => setGameState('INVENTORY');
  const handleBackToLobby = () => setGameState('LOBBY');
  
  const handleSelectJob = (job: any) => {
      setActiveJob(job);
      setBossHp(job.hp);
      setAmmo(job.requiredSkills);
      setGameState('BATTLE');
  };

  const handleFireSkill = (skill: string, e: any) => {
      const dmg = 25;
      setBossHp(h => Math.max(0, h - dmg));
      
      // Visual Feedback
      setHitFlash(true);
      setTimeout(() => setHitFlash(false), 100);
      
      // Floating text at cursor position (roughly)
      const rect = e.target.getBoundingClientRect();
      setDamageText({
          text: `CRIT! -${dmg}`,
          x: rect.x + Math.random() * 50,
          y: rect.y - 100
      });
      setTimeout(() => setDamageText(null), 800);

      // AI Reaction
      setIsAiThinking(true);
      setTimeout(() => setIsAiThinking(false), 500);

      if (bossHp - dmg <= 0) {
          setTimeout(() => {
              alert("MISSION ACCOMPLISHED");
              setGameState('LOBBY');
          }, 1000);
      }
  };

  return (
    <div className="w-full h-full relative bg-dark text-white select-none overflow-hidden">
      <div className="scanlines"></div>
      <DamageFlash show={hitFlash} />
      {damageText && <FloatingText text={damageText.text} x={damageText.x} y={damageText.y} />}
      
      {/* 3D LAYER */}
      <Canvas shadows camera={{ fov: 45 }}>
          <CameraDirector gameState={gameState} />
          <Effects />
          
          {/* CONTENT BASED ON STATE */}
          {(gameState === 'LOBBY' || gameState === 'INVENTORY' || gameState === 'LOGIN') && (
              <>
                 <CharacterModel 
                    type={CHARACTERS[charIndex].id} 
                    color={CHARACTERS[charIndex].color} 
                 />
                 {gameState === 'LOBBY' && (
                     <TacticalDrone isThinking={isAiThinking} position={[-1, 1, 1]} />
                 )}
              </>
          )}

          {gameState === 'MAP' && (
              <MapNodes onSelectJob={handleSelectJob} />
          )}

          {gameState === 'BATTLE' && (
              <>
                <CharacterModel 
                    type={CHARACTERS[charIndex].id} 
                    color={CHARACTERS[charIndex].color} 
                />
                <TacticalDrone isThinking={isAiThinking} position={[-2, 2, 2]} />
                <EnemyBoss job={activeJob} hp={bossHp} maxHp={activeJob.hp} />
              </>
          )}
      </Canvas>

      {/* UI LAYER */}
      {gameState === 'LOGIN' && <LoginScreen onLogin={handleLogin} />}
      
      {/* GLOBAL CHAT OVERLAY (Except Login) */}
      {gameState !== 'LOGIN' && (
          <>
            <TacticalChat isOpen={chatOpen} toggleOpen={() => {
                setChatOpen(!chatOpen);
                if (showAiPrompt) setShowAiPrompt(false);
            }} />
            
            {showAiPrompt && !chatOpen && gameState === 'LOBBY' && (
                <AiGuideTooltip onDismiss={() => setShowAiPrompt(false)} />
            )}
          </>
      )}

      {gameState === 'LOBBY' && (
          <LobbyScreen 
            onDeploy={handleDeploy} 
            onInventory={handleInventory} 
            charIndex={charIndex}
            setCharIndex={setCharIndex}
          />
      )}
      {gameState === 'MAP' && <MapScreen onSelect={handleSelectJob} onBack={handleBackToLobby} />}
      {gameState === 'BATTLE' && (
          <BattleHud 
            job={activeJob} 
            hp={bossHp} 
            maxHp={activeJob.hp} 
            ammo={ammo} 
            onFire={handleFireSkill} 
            onLeave={handleBackToLobby} 
          />
      )}
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);