export const videoGuides = [
    {
        id: 'cinematic-aerial',
        title: 'cinematic aerial sequence',
        model: 'Veo 3.1 / Kling 2.5 Turbo',
        mainPrompt: 'A wide cinematic aerial shot of a man suspended mid-air as if falling upward, body tilted horizontally, arms and legs slightly bent, wearing a tailored black suit. The background features two modern fighter jets cutting through thin clouds at different depths. Intense backlit golden hour sunlight creating dramatic rim light.',
        shots: [
            {
                id: 'shot-1',
                title: 'extreme close-up face',
                prompt: 'Extreme close up shot of face of the guy falling in back from above, we can see the jet behind him. 16:9. facial features are accurate and sharp.',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
            },
            {
                id: 'shot-2',
                title: 'medium shot man',
                prompt: 'Medium shot of man falling through clouds, peaceful expression, cinematic lighting, ultra-realistic textures.',
                image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80'
            },
            {
                id: 'shot-3',
                title: 'macro watch detail',
                prompt: 'Close up shot of watch on man hand wrist. man is wearing white shirt and black leather jacket. 16:9 high detail mechanical movement.',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'
            },
            {
                id: 'shot-4',
                title: 'low angle shoe shot',
                prompt: 'Extreme horizontal close up shot of high-end sneakers in mid-air. soft motion blur, sunset background.',
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80'
            }
        ]
    },
    {
        id: 'neon-cyberpunk',
        title: 'neon cyberpunk transit',
        model: 'Veo 3.1',
        mainPrompt: 'First-person view flying through a neon-drenched cyberpunk city at night. Rain droplets hitting the lens, refracting vibrant pink and blue lights. Flying vehicles zipping past in long exposure streaks.',
        shots: [
            {
                id: 'c-shot-1',
                title: 'reflective puddle',
                prompt: 'Macro shot of a puddle on a metal rooftop reflecting the neon Kanji signs above. High contrast, cinematic bokeh.',
                image: 'https://images.unsplash.com/photo-1605142859862-978be7eba909?auto=format&fit=crop&w=400&q=80'
            }
        ]
    }
];
