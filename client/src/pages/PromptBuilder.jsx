import React, { useState, useEffect } from 'react';
import { Copy, Check, Wand2, MessageSquare, User, Zap, Brain, ArrowRight, RotateCcw } from 'lucide-react';

const TECHNIQUES = [
    {
        id: 'zero-shot',
        name: 'zero-shot',
        icon: Zap,
        description: 'direct instruction without examples. best for simple tasks.',
        template: (task) => task
    },
    {
        id: 'persona',
        name: 'persona alias',
        icon: User,
        description: 'assign a professional role to the ai for expert results.',
        template: (task, role) => `Act as a ${role}. Your goal is to: ${task}. Be professional and thorough.`
    },
    {
        id: 'few-shot',
        name: 'few-shot',
        icon: MessageSquare,
        description: 'provide examples to guide the ai style and format.',
        template: (task, examples) => `Here are some examples:\n${examples}\n\nTask: ${task}`
    },
    {
        id: 'cot',
        name: 'chain of thought',
        icon: Brain,
        description: 'forces the ai to think step-by-step for complex logic.',
        template: (task) => `${task}\n\nLet's think about this step by step to ensure the highest quality and accuracy.`
    }
];

function PromptBuilder() {
    const [step, setStep] = useState(1);
    const [selectedTech, setSelectedTech] = useState(null);
    const [task, setTask] = useState('');
    const [extra, setExtra] = useState(''); // role or examples
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        document.title = 'drafter | nano prompts.';
    }, []);

    const generatePrompt = () => {
        if (!selectedTech) return '';
        if (selectedTech.id === 'persona') return selectedTech.template(task, extra || '[role]');
        if (selectedTech.id === 'few-shot') return selectedTech.template(task, extra || '[examples]');
        return selectedTech.template(task);
    };

    const finalPrompt = generatePrompt();

    const handleCopy = () => {
        navigator.clipboard.writeText(finalPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const reset = () => {
        setStep(1);
        setSelectedTech(null);
        setTask('');
        setExtra('');
    };

    return (
        <main className="container fade-in" style={{ padding: '80px 0', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 className="ndot" style={{ fontSize: 'min(56px, 10vw)', marginBottom: '16px', textTransform: 'lowercase' }}>
                    prompt <span style={{ color: 'var(--accent)' }}>drafter</span>.
                </h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '16px', textTransform: 'lowercase' }}>
                    architect professional engines for gpt and gemini in seconds.
                </p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Progress */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
                    {[1, 2, 3].map(s => (
                        <div key={s} style={{
                            flex: 1,
                            height: '4px',
                            background: step >= s ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                            transition: 'all 0.3s ease'
                        }} />
                    ))}
                </div>

                {step === 1 && (
                    <div className="fade-in">
                        <h2 style={{ fontSize: '20px', marginBottom: '32px', textTransform: 'lowercase', fontWeight: 600 }}>1. select technique</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            {TECHNIQUES.map(tech => (
                                <div
                                    key={tech.name}
                                    className="glass"
                                    onClick={() => {
                                        setSelectedTech(tech);
                                        setStep(2);
                                    }}
                                    style={{
                                        padding: '32px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        border: selectedTech?.id === tech.id ? '1px solid var(--accent)' : '1px solid var(--border)'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <tech.icon size={32} style={{ color: 'var(--accent)', marginBottom: '20px' }} />
                                    <h3 style={{ fontSize: '18px', marginBottom: '12px', textTransform: 'lowercase' }}>{tech.name}</h3>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', textTransform: 'lowercase' }}>{tech.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '20px', textTransform: 'lowercase', fontWeight: 600 }}>2. define the work</h2>
                            <button onClick={() => setStep(1)} style={{ fontSize: '12px', border: 'none', padding: '0', background: 'transparent', opacity: 0.5 }}>change technique</button>
                        </div>

                        <div className="glass" style={{ padding: '40px' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'lowercase' }}>what should the ai do?</label>
                                <textarea
                                    value={task}
                                    onChange={(e) => setTask(e.target.value)}
                                    placeholder="e.g. write a marketing copy for a new sneaker release..."
                                    style={{ minHeight: '120px', fontSize: '16px', background: 'rgba(0,0,0,0.3)' }}
                                />
                            </div>

                            {selectedTech?.id === 'persona' && (
                                <div className="fade-in" style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'lowercase' }}>expert role / persona</label>
                                    <input
                                        type="text"
                                        value={extra}
                                        onChange={(e) => setExtra(e.target.value)}
                                        placeholder="e.g. senior copywriter at nike"
                                        style={{ background: 'rgba(0,0,0,0.3)' }}
                                    />
                                </div>
                            )}

                            {selectedTech?.id === 'few-shot' && (
                                <div className="fade-in" style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'lowercase' }}>provide examples (input to output)</label>
                                    <textarea
                                        value={extra}
                                        onChange={(e) => setExtra(e.target.value)}
                                        placeholder="input: hello to output: hi there!..."
                                        style={{ minHeight: '120px', fontSize: '14px', background: 'rgba(0,0,0,0.3)' }}
                                    />
                                </div>
                            )}

                            <button
                                onClick={() => setStep(3)}
                                disabled={!task}
                                className="primary"
                                style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                            >
                                build engine <Wand2 size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '20px', textTransform: 'lowercase', fontWeight: 600 }}>3. ready for deploy</h2>
                            <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', opacity: 0.6 }}>
                                <RotateCcw size={14} /> start over
                            </button>
                        </div>

                        <div className="glass" style={{ padding: '40px', background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    background: 'rgba(0,0,0,0.5)',
                                    padding: '32px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    marginBottom: '32px',
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: '1.6',
                                    fontSize: '15px'
                                }}>
                                    {finalPrompt}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        padding: '8px 16px',
                                        background: copied ? 'var(--accent)' : '#fff',
                                        color: '#000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '11px',
                                        fontWeight: 700
                                    }}
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'copied' : 'copy for chatgpt'}
                                </button>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-dim)', fontSize: '13px', textTransform: 'lowercase', marginBottom: '24px' }}>
                                    your custom engine is ready. paste it into chatgpt or gemini to see the magic.
                                </p>
                                <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer">
                                    <button style={{ padding: '12px 32px', fontSize: '12px' }}>open chatgpt <ArrowRight size={14} style={{ marginLeft: '8px' }} /></button>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default PromptBuilder;
