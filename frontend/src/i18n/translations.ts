export type LanguageCode = 'en' | 'hi' | 'as' | 'bn' | 'mni' | 'kha' | 'lus' | 'nag';

export const languages: Record<LanguageCode, { label: string; status: string }> = {
  en: { label: 'English', status: 'Available' },
  hi: { label: 'Hindi', status: 'Prototype translation' },
  as: { label: 'Assamese', status: 'Future language support' },
  bn: { label: 'Bengali', status: 'Future language support' },
  mni: { label: 'Meitei / Manipuri', status: 'Future language support' },
  kha: { label: 'Khasi', status: 'Future language support' },
  lus: { label: 'Mizo', status: 'Future language support' },
  nag: { label: 'Nagamese', status: 'Future language support' }
};

export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    home: 'Home',
    games: 'Games',
    memories: 'My Memories',
    reminders: 'Reminders',
    routine: 'Daily Routine',
    mood: 'Mood',
    progress: 'Progress',
    voice: 'Voice Assistant',
    settings: 'Settings',
    todayReminders: "Today's Reminders",
    familiarMemories: 'Familiar Memories',
    patientOverview: 'Patient Activity Overview',
    recentActivity: 'Your Recent Activity',
    offline: 'Offline - CogniCare Local Mode',
    online: 'Online',
    savedLocal: 'Saved on this device',
    exerciseMemory: "Let's exercise your memory",
    voicePrompt: 'How can I help you today?'
  },
  hi: {
    home: 'होम',
    games: 'गेम',
    memories: 'मेरी यादें',
    reminders: 'आज के रिमाइंडर',
    routine: 'दैनिक दिनचर्या',
    mood: 'मूड',
    progress: 'प्रगति',
    voice: 'वॉइस सहायक',
    settings: 'सेटिंग्स',
    todayReminders: 'आज के रिमाइंडर',
    familiarMemories: 'परिचित यादें',
    patientOverview: 'रोगी गतिविधि अवलोकन',
    recentActivity: 'आपकी हाल की गतिविधि',
    offline: 'ऑफलाइन - CogniCare लोकल मोड',
    online: 'ऑनलाइन',
    savedLocal: 'इस डिवाइस पर सेव किया गया',
    exerciseMemory: 'आइए आपकी याददाश्त का अभ्यास करें',
    voicePrompt: 'आज मैं आपकी कैसे मदद कर सकता हूं?'
  },
  as: {},
  bn: {},
  mni: {},
  kha: {},
  lus: {},
  nag: {}
};

