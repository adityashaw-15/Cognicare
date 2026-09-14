import { HelpCircle, Mic, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { VoiceAssistant } from '../components/VoiceAssistant';

const samplePrompts = [
  'What do I have today?',
  'What is my next reminder?',
  'Who is Ananya?',
  'What is my mood today?'
];

export function VoicePage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Voice Companion"
        title="Voice & Speech Assistance"
        description="Speak or type your questions naturally. CogniCare will answer calmly with audio voice synthesis."
      />

      <section className="panel" style={{ background: 'linear-gradient(135deg, #ffffff 0%, var(--purple-50) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Sparkles color="var(--purple-600)" size={20} />
          <strong style={{ fontSize: '1rem', color: 'var(--purple-800)' }}>Try asking questions like:</strong>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {samplePrompts.map((prompt) => (
            <span 
              key={prompt}
              style={{ 
                background: '#ffffff', 
                color: 'var(--purple-700)', 
                border: '1px solid var(--purple-200)', 
                padding: '8px 16px', 
                borderRadius: '20px', 
                fontSize: '0.9rem', 
                fontWeight: 700, 
                boxShadow: 'var(--shadow-subtle)' 
              }}
            >
              "{prompt}"
            </span>
          ))}
        </div>
      </section>

      <VoiceAssistant />
    </div>
  );
}
