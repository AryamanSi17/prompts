import React, { useState, useEffect } from 'react';
import { Copy, Check, Wand2, MessageSquare, User, Zap, Brain, ArrowRight, RotateCcw, Target, Music, ShieldAlert, ChevronRight } from 'lucide-react';

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
        template: (task, role) => `Act as a ${role}. Your goal is to: ${task}.`
    },
    {
        id: 'few-shot',
        name: 'few-shot',
        icon: MessageSquare,
        description: 'provide examples to guide the ai style and format.',
        template: (task, examples) => `Here are some examples of the desired output style and format:\n${examples}\n\nTask: ${task}`
    },
    {
        id: 'cot',
        name: 'chain of thought',
        icon: Brain,
        description: 'forces the ai to think step-by-step for complex logic.',
        template: (task) => `${task}\n\nLet's think about this step by step to ensure the highest quality and accuracy.`
    }
];

const TONES = ['professional', 'creative', 'academic', 'sarcastic', 'friendly', 'minimalist', 'visionary', 'technical'];
const FORMATS = ['markdown', 'bullet points', 'json', 'essay', 'step-by-step guide', 'email', 'social media post'];
const LENGTHS = ['concise', 'balanced', 'exhaustive'];

function PromptBuilder() {
    const [step, setStep] = useState(1);
    const [selectedTech, setSelectedTech] = useState(null);
    const [task, setTask] = useState('');
    const [extra, setExtra] = useState(''); // role or examples
    const [tone, setTone] = useState('professional');
    const [format, setFormat] = useState('markdown');
    const [length, setLength] = useState('balanced');
    const [audience, setAudience] = useState('');
    const [negative, setNegative] = useState('');
    const [context, setContext] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        document.title = 'drafter | nano prompts.';
    }, []);

    const generatePrompt = () => {
        if (!selectedTech) return '';

        let base = "";
        if (selectedTech.id === 'persona') base = selectedTech.template(task, extra || '[role]');
        else if (selectedTech.id === 'few-shot') base = selectedTech.template(task, extra || '[examples]');
        else base = selectedTech.template(task);

        const config = [
            `Tone: ${tone}`,
            `Format: ${format}`,
            `Length: ${length}`,
            audience ? `Target Audience: ${audience}` : null,
            context ? `Background Context: ${context}` : null,
            negative ? `Constraints (DO NOT): ${negative}` : null
        ].filter(Boolean).join('\n');

        return `${base}\n\n--- CONFIGURATION ---\nPlease adhere to the following constraints for the output:\n${config}\n\nFinal Instruction: Ensure the output is optimized for high-performance and absolute clarity.`;
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
        setTone('professional');
        setFormat('markdown');
        setLength('balanced');
        setAudience('');
        setNegative('');
        setContext('');
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

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Progress Indicators */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '48px' }}>
                    {[1, 2, 3, 4].map(s => (
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
                        <h2 style={{ fontSize: '20px', marginBottom: '32px', textTransform: 'lowercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Zap size={20} className="text-accent" /> 1. select engine technique
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
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
                                        border: selectedTech?.id === tech.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                                        background: selectedTech?.id === tech.id ? 'rgba(255,255,255,0.05)' : 'transparent'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.borderColor = 'var(--accent)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.borderColor = selectedTech?.id === tech.id ? 'var(--accent)' : 'var(--border)';
                                    }}
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
                            <h2 style={{ fontSize: '20px', textTransform: 'lowercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MessageSquare size={20} className="text-accent" /> 2. define the work
                            </h2>
                            <button onClick={() => setStep(1)} style={{ fontSize: '12px', border: '1px solid var(--border)', padding: '6px 12px', background: 'transparent', opacity: 0.5, textTransform: 'lowercase' }}>change technique</button>
                        </div>

                        <div className="glass" style={{ padding: 'min(40px, 8vw)' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'lowercase', letterSpacing: '1px' }}>core task / objective</label>
                                <textarea
                                    value={task}
                                    onChange={(e) => setTask(e.target.value)}
                                    placeholder="e.g. write a marketing copy for a new sneaker release..."
                                    style={{ minHeight: '120px', fontSize: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', padding: '20px' }}
                                />
                            </div>

                            {selectedTech?.id === 'persona' && (
                                <div className="fade-in" style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'lowercase', letterSpacing: '1px' }}>expert role / persona</label>
                                    <input
                                        type="text"
                                        value={extra}
                                        onChange={(e) => setExtra(e.target.value)}
                                        placeholder="e.g. senior copywriter at nike"
                                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', padding: '16px' }}
                                    />
                                </div>
                            )}

                            {selectedTech?.id === 'few-shot' && (
                                <div className="fade-in" style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'lowercase', letterSpacing: '1px' }}>provide examples (input to output)</label>
                                    <textarea
                                        value={extra}
                                        onChange={(e) => setExtra(e.target.value)}
                                        placeholder="input: hello to output: hi there!..."
                                        style={{ minHeight: '120px', fontSize: '14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', padding: '20px' }}
                                    />
                                </div>
                            )}

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'lowercase', letterSpacing: '1px' }}>background context (optional)</label>
                                <textarea
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    placeholder="e.g. the sneakers are made of eco-friendly materials and targeted at gen Z..."
                                    style={{ minHeight: '100px', fontSize: '14px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', padding: '20px' }}
                                />
                            </div>

                            <button
                                onClick={() => setStep(3)}
                                disabled={!task}
                                className="primary"
                                style={{ width: '100%', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '14px', fontWeight: 700 }}
                            >
                                continue to customization <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '20px', textTransform: 'lowercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Target size={20} className="text-accent" /> 3. customize output
                            </h2>
                            <button onClick={() => setStep(2)} style={{ fontSize: '12px', border: '1px solid var(--border)', padding: '6px 12px', background: 'transparent', opacity: 0.5, textTransform: 'lowercase' }}>back to task</button>
                        </div>

                        <div className="glass" style={{ padding: '40px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'lowercase' }}>tone of voice</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {TONES.map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setTone(t)}
                                                style={{
                                                    padding: '6px 12px',
                                                    fontSize: '11px',
                                                    background: tone === t ? '#fff' : 'rgba(255,255,255,0.05)',
                                                    color: tone === t ? '#000' : '#fff',
                                                    border: 'none',
                                                    textTransform: 'lowercase'
                                                }}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'lowercase' }}>output format</label>
                                    <select
                                        value={format}
                                        onChange={(e) => setFormat(e.target.value)}
                                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: '#fff', padding: '12px', textTransform: 'lowercase' }}
                                    >
                                        {FORMATS.map(f => <option key={f} value={f} style={{ background: '#000' }}>{f}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'lowercase' }}>detail level</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {LENGTHS.map(l => (
                                            <button
                                                key={l}
                                                onClick={() => setLength(l)}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    fontSize: '11px',
                                                    background: length === l ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                                                    color: length === l ? '#000' : '#fff',
                                                    border: 'none',
                                                    textTransform: 'lowercase',
                                                    fontWeight: 700
                                                }}
                                            >
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'lowercase' }}>target audience</label>
                                <input
                                    type="text"
                                    value={audience}
                                    onChange={(e) => setAudience(e.target.value)}
                                    placeholder="e.g. tech-savvy parents, college students, CEOs..."
                                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', padding: '16px' }}
                                />
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ff4444', marginBottom: '12px', textTransform: 'lowercase' }}>
                                    <ShieldAlert size={14} /> negative constraints (what to avoid)
                                </label>
                                <textarea
                                    value={negative}
                                    onChange={(e) => setNegative(e.target.value)}
                                    placeholder="e.g. do not use buzzwords, avoid mention of competitors, no jargon..."
                                    style={{ minHeight: '100px', fontSize: '14px', background: 'rgba(255,0,0,0.05)', border: '1px solid rgba(255,68,68,0.2)', padding: '20px' }}
                                />
                            </div>

                            <button
                                onClick={() => setStep(4)}
                                className="primary"
                                style={{ width: '100%', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '14px', fontWeight: 700 }}
                            >
                                finalize engine <Wand2 size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '20px', textTransform: 'lowercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Wand2 size={20} className="text-accent" /> 4. ready for deploy
                            </h2>
                            <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', border: '1px solid var(--border)', padding: '6px 12px', background: 'transparent', opacity: 0.6, textTransform: 'lowercase' }}>
                                <RotateCcw size={14} /> reset builder
                            </button>
                        </div>

                        <div className="glass" style={{ padding: 'min(60px, 10vw)', background: 'rgba(255,255,255,0.01)' }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    background: 'rgba(0,0,0,0.8)',
                                    padding: '40px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    marginBottom: '40px',
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: '1.8',
                                    fontSize: '15px',
                                    color: '#eee',
                                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'
                                }}>
                                    {finalPrompt}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        padding: '12px 24px',
                                        background: copied ? 'var(--accent)' : '#fff',
                                        color: '#000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        transition: 'all 0.2s ease',
                                        transform: copied ? 'scale(1.05)' : 'scale(1)'
                                    }}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? 'copied successfully' : 'copy professional engine'}
                                </button>
                            </div>

                            <div style={{
                                padding: '40px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                textAlign: 'center'
                            }}>
                                <h3 style={{ fontSize: '18px', marginBottom: '16px', textTransform: 'lowercase' }}>next steps</h3>
                                <p style={{ color: 'var(--text-dim)', fontSize: '14px', textTransform: 'lowercase', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
                                    your custom architectural prompt is optimized for gpt-4, claude, and gemini. paste it now to begin generating.
                                </p>
                                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer">
                                        <button className="primary" style={{ padding: '12px 32px', fontSize: '12px' }}>open chatgpt <ArrowRight size={14} style={{ marginLeft: '8px' }} /></button>
                                    </a>
                                    <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer">
                                        <button className="glass" style={{ padding: '12px 32px', fontSize: '12px', border: '1px solid var(--border)' }}>open gemini <ArrowRight size={14} style={{ marginLeft: '8px' }} /></button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .text-accent { color: var(--accent); }
                select:focus, textarea:focus, input:focus {
                    border-color: var(--accent) !important;
                    outline: none;
                }
                .glass option {
                    background: #111;
                    color: #fff;
                }
            `}</style>
        </main>
    );
}

export default PromptBuilder;
