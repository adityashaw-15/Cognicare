import { FormEvent, useMemo, useState } from 'react';
import { Mic, Send, Volume2 } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { ThreeDButton } from './ThreeDButton';

interface SpeechLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
}

type SpeechConstructor = new () => SpeechLike;
type SpeechWindow = Window & typeof globalThis & {
  SpeechRecognition?: SpeechConstructor;
  webkitSpeechRecognition?: SpeechConstructor;
};

export function VoiceAssistant() {
  const { reminders, activities, memories, activePatient } = useAppData();
  const [text, setText] = useState('');
  const [answer, setAnswer] = useState('How can I help you today?');
  const [listening, setListening] = useState(false);
  const [voiceUnavailable, setVoiceUnavailable] = useState(false);

  const nextReminder = useMemo(
    () => reminders.find((reminder) => !reminder.completed) ?? reminders[0],
    [reminders]
  );

  const respond = (query: string) => {
    const lower = query.toLowerCase();
    let response = "I can help with reminders, today's routine, familiar memories, and memory activities.";
    if (lower.includes('today') || lower.includes('routine')) {
      const top = activities.slice(0, 4).map((activity) => `${activity.time} ${activity.title}`).join(', ');
      response = top
        ? `Today you have ${top}. CogniCare will keep supporting you in a calm routine.`
        : 'Your routine is available locally on this device.';
    } else if (lower.includes('next reminder') || lower.includes('reminder')) {
      response = nextReminder
        ? `Your next reminder is ${nextReminder.title} at ${nextReminder.time}.`
        : 'You have no pending reminders right now.';
    } else if (lower.includes('memory') || lower.includes('who')) {
      const memory = memories[0];
      response = memory
        ? `${memory.personName} is saved in Familiar Memories. ${memory.promptSeed ?? memory.note ?? ''}`
        : 'Your Familiar Memories are available in Local Mode once added by a caregiver.';
    } else if (lower.includes('name')) {
      response = `You are using CogniCare with the demo profile for ${activePatient.name}.`;
    }
    setAnswer(response);
    speak(response);
  };

  const startListening = () => {
    const SpeechRecognition = (window as SpeechWindow).SpeechRecognition ?? (window as SpeechWindow).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceUnavailable(true);
      setAnswer('Voice input is not available in this browser. You can use text instead.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      setText(transcript);
      respond(transcript);
    };
    recognition.onerror = () => {
      setVoiceUnavailable(true);
      setAnswer('Voice input was not available. You can use text instead.');
    };
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (text.trim()) {
      respond(text.trim());
    }
  };

  return (
    <section className="voice-panel">
      <div className="voice-orb" aria-hidden="true">
        <Volume2 size={34} />
      </div>
      <div>
        <p className="eyebrow">Voice Assistant</p>
        <h2>How can I help you today?</h2>
        <p className="assistant-answer">{answer}</p>
        {voiceUnavailable && <p className="soft-warning">Voice input is not available in this browser. You can use text instead.</p>}
      </div>
      <form className="voice-form" onSubmit={submit}>
        <ThreeDButton type="button" icon={<Mic size={22} />} onClick={startListening}>
          {listening ? 'Listening...' : 'Speak'}
        </ThreeDButton>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Try: What do I have today?"
          aria-label="Text fallback for voice assistant"
        />
        <ThreeDButton type="submit" variant="secondary" icon={<Send size={20} />}>
          Ask
        </ThreeDButton>
      </form>
    </section>
  );
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) {
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

