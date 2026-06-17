/**
 * Lessons are the heart of the content system.
 *
 * Each lesson belongs to a unit and carries everything a screen (or the future
 * Vision Agent audio teacher) needs:
 *   - `goals`           what the learner will be able to do
 *   - `vocabulary`      words taught in this lesson
 *   - `phrases`         full phrases taught in this lesson
 *   - `activities`      interactive exercises to practice
 *   - `aiTeacherPrompt` persona + focus for the audio AI teacher
 *
 * Lesson ids are prefixed with their unit, e.g. `es-unit-1-lesson-1`.
 */
import type { Lesson, LanguageCode } from "@/types/learning";

export const lessons: Lesson[] = [
  // ============================================================ Spanish · U1
  {
    id: "es-unit-1-lesson-1",
    unitId: "es-unit-1",
    languageId: "es",
    title: "Greetings",
    type: "vocabulary",
    order: 1,
    xpReward: 10,
    goals: [
      "Say hello and goodbye in Spanish",
      "Recognize three everyday greetings",
    ],
    vocabulary: [
      {
        id: "es-v-hola",
        word: "Hola",
        translation: "Hello",
        phonetic: "OH-lah",
        example: "¡Hola! ¿Cómo estás?",
      },
      {
        id: "es-v-adios",
        word: "Adiós",
        translation: "Goodbye",
        phonetic: "ah-DYOHS",
        example: "Adiós, hasta mañana.",
      },
      {
        id: "es-v-buenos-dias",
        word: "Buenos días",
        translation: "Good morning",
        phonetic: "BWEH-nohs DEE-ahs",
        example: "Buenos días, profesor.",
      },
    ],
    phrases: [
      {
        id: "es-p-como-estas",
        text: "¿Cómo estás?",
        translation: "How are you?",
        phonetic: "KOH-moh ehs-TAHS",
      },
    ],
    activities: [
      {
        id: "es-u1-l1-a1",
        type: "multipleChoice",
        prompt: 'How do you say "Hello" in Spanish?',
        options: [
          { id: "o1", text: "Adiós", correct: false },
          { id: "o2", text: "Hola", correct: true },
          { id: "o3", text: "Gracias", correct: false },
        ],
      },
      {
        id: "es-u1-l1-a2",
        type: "translate",
        prompt: 'Translate: "Good morning"',
        answer: "Buenos días",
        hint: "Two words — starts with Buenos.",
      },
      {
        id: "es-u1-l1-a3",
        type: "match",
        prompt: "Match the greeting to its meaning",
        options: [
          { id: "o1", text: "Adiós = Goodbye", correct: true },
          { id: "o2", text: "Hola = Thank you", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Maria, a warm, bubbly Spanish teacher who lights up when a learner tries. Stick to this greetings lesson — Hola, Adiós, Buenos días — and only these. Say each one slowly, give the English meaning, then cheer them on as they say it back to you.",
  },
  {
    id: "es-unit-1-lesson-2",
    unitId: "es-unit-1",
    languageId: "es",
    title: "Introduce Yourself",
    type: "chat",
    order: 2,
    xpReward: 15,
    goals: ["Tell someone your name", "Ask for someone's name"],
    vocabulary: [
      {
        id: "es-v-me-llamo",
        word: "Me llamo",
        translation: "My name is",
        phonetic: "meh YAH-moh",
        example: "Me llamo Ana.",
      },
      {
        id: "es-v-mucho-gusto",
        word: "Mucho gusto",
        translation: "Nice to meet you",
        phonetic: "MOO-choh GOOS-toh",
      },
    ],
    phrases: [
      {
        id: "es-p-como-te-llamas",
        text: "¿Cómo te llamas?",
        translation: "What is your name?",
        phonetic: "KOH-moh teh YAH-mahs",
      },
    ],
    activities: [
      {
        id: "es-u1-l2-a1",
        type: "translate",
        prompt: 'Say: "My name is Ana"',
        answer: "Me llamo Ana",
      },
      {
        id: "es-u1-l2-a2",
        type: "multipleChoice",
        prompt: 'What does "¿Cómo te llamas?" mean?',
        options: [
          { id: "o1", text: "How are you?", correct: false },
          { id: "o2", text: "What is your name?", correct: true },
          { id: "o3", text: "Where are you from?", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Maria, a warm Spanish tutor who loves a friendly chat. Keep it to this lesson — introducing yourself with 'Me llamo ...', 'Mucho gusto', and asking '¿Cómo te llamas?'. Role-play a tiny introduction, listen to their reply, fix slips kindly, and have them try it again.",
  },

  // ============================================================ Spanish · U2
  {
    id: "es-unit-2-lesson-1",
    unitId: "es-unit-2",
    languageId: "es",
    title: "Polite Words",
    type: "audio",
    order: 1,
    xpReward: 10,
    goals: ["Say please and thank you", "Respond politely"],
    vocabulary: [
      {
        id: "es-v-por-favor",
        word: "Por favor",
        translation: "Please",
        phonetic: "pohr fah-VOHR",
      },
      {
        id: "es-v-gracias",
        word: "Gracias",
        translation: "Thank you",
        phonetic: "GRAH-syahs",
      },
      {
        id: "es-v-de-nada",
        word: "De nada",
        translation: "You're welcome",
        phonetic: "deh NAH-dah",
      },
    ],
    phrases: [
      {
        id: "es-p-muchas-gracias",
        text: "Muchas gracias",
        translation: "Thank you very much",
        phonetic: "MOO-chahs GRAH-syahs",
      },
    ],
    activities: [
      {
        id: "es-u2-l1-a1",
        type: "listen",
        prompt: 'Listen and choose: which word means "Thank you"?',
        options: [
          { id: "o1", text: "Por favor", correct: false },
          { id: "o2", text: "Gracias", correct: true },
        ],
      },
      {
        id: "es-u2-l1-a2",
        type: "speak",
        prompt: 'Say "You\'re welcome" out loud',
        answer: "De nada",
      },
    ],
    aiTeacherPrompt:
      "You're Maria, an upbeat Spanish pronunciation coach. Stay on this lesson's polite words only — Por favor, Gracias, De nada. Say each one slowly with its meaning, listen closely as they repeat, and react with real warmth, nudging the sounds until they nail it.",
  },
  {
    id: "es-unit-2-lesson-2",
    unitId: "es-unit-2",
    languageId: "es",
    title: "Daily Life",
    type: "vocabulary",
    order: 2,
    xpReward: 15,
    goals: ["Talk about everyday actions", "Use common verbs"],
    vocabulary: [
      { id: "es-v-comer", word: "Comer", translation: "To eat", phonetic: "koh-MEHR", example: "Quiero comer." },
      { id: "es-v-beber", word: "Beber", translation: "To drink", phonetic: "beh-BEHR" },
      { id: "es-v-dormir", word: "Dormir", translation: "To sleep", phonetic: "dor-MEER" },
      { id: "es-v-ir", word: "Ir", translation: "To go", phonetic: "eer" },
    ],
    phrases: [
      { id: "es-p-tengo-hambre", text: "Tengo hambre", translation: "I am hungry", phonetic: "TEN-goh AHM-breh" },
    ],
    activities: [
      {
        id: "es-u2-l2-a1",
        type: "multipleChoice",
        prompt: 'What does "Comer" mean?',
        options: [
          { id: "o1", text: "To sleep", correct: false },
          { id: "o2", text: "To eat", correct: true },
          { id: "o3", text: "To go", correct: false },
        ],
      },
      { id: "es-u2-l2-a2", type: "translate", prompt: 'Translate: "To drink"', answer: "Beber" },
    ],
    aiTeacherPrompt:
      "You're Maria, a warm Spanish teacher who makes practice feel easy. Stay on this lesson's everyday verbs — Comer, Beber, Dormir, Ir. Bring in one at a time slowly with its English meaning, then have the learner say it back and warmly cheer each try.",
  },
  {
    id: "es-unit-2-lesson-3",
    unitId: "es-unit-2",
    languageId: "es",
    title: "At the Café",
    type: "chat",
    order: 3,
    xpReward: 15,
    goals: ["Order a drink", "Ask for things politely"],
    vocabulary: [
      { id: "es-v-un-cafe", word: "Un café", translation: "A coffee", phonetic: "oon kah-FEH", example: "Un café, por favor." },
      { id: "es-v-agua", word: "Agua", translation: "Water", phonetic: "AH-gwah" },
      { id: "es-v-quiero", word: "Quiero", translation: "I want", phonetic: "KYEH-roh" },
    ],
    phrases: [
      { id: "es-p-un-cafe-por-favor", text: "Un café, por favor.", translation: "A coffee, please.", phonetic: "oon kah-FEH pohr fah-VOHR" },
    ],
    activities: [
      { id: "es-u2-l3-a1", type: "translate", prompt: 'Order: "A coffee, please"', answer: "Un café, por favor" },
      {
        id: "es-u2-l3-a2",
        type: "multipleChoice",
        prompt: 'What does "Agua" mean?',
        options: [
          { id: "o1", text: "Water", correct: true },
          { id: "o2", text: "Coffee", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Maria, a friendly Spanish tutor playing a kind café server. Stay in this café scene only — Un café, Agua, Quiero, and ordering 'Un café, por favor.'. Offer one phrase at a time slowly with its meaning, listen to their order, gently fix it, and invite them to try again.",
  },

  // ============================================================= French · U1
  {
    id: "fr-unit-1-lesson-1",
    unitId: "fr-unit-1",
    languageId: "fr",
    title: "Greetings",
    type: "vocabulary",
    order: 1,
    xpReward: 10,
    goals: ["Greet people in French", "Say goodbye politely"],
    vocabulary: [
      {
        id: "fr-v-bonjour",
        word: "Bonjour",
        translation: "Hello / Good morning",
        phonetic: "bohn-ZHOOR",
        example: "Bonjour, ça va?",
      },
      {
        id: "fr-v-au-revoir",
        word: "Au revoir",
        translation: "Goodbye",
        phonetic: "oh ruh-VWAHR",
      },
      {
        id: "fr-v-merci",
        word: "Merci",
        translation: "Thank you",
        phonetic: "mehr-SEE",
      },
    ],
    phrases: [
      {
        id: "fr-p-ca-va",
        text: "Ça va?",
        translation: "How's it going?",
        phonetic: "sah VAH",
      },
    ],
    activities: [
      {
        id: "fr-u1-l1-a1",
        type: "multipleChoice",
        prompt: 'How do you say "Hello" in French?',
        options: [
          { id: "o1", text: "Merci", correct: false },
          { id: "o2", text: "Bonjour", correct: true },
          { id: "o3", text: "Au revoir", correct: false },
        ],
      },
      {
        id: "fr-u1-l1-a2",
        type: "translate",
        prompt: 'Translate: "Thank you"',
        answer: "Merci",
      },
    ],
    aiTeacherPrompt:
      "You're Luc, a cheerful French teacher with a big smile in your voice. Stay on this greetings lesson — Bonjour, Au revoir, Merci. Say each one slowly with its meaning, then listen as they repeat and cheer the little wins, gently shaping those nasal sounds.",
  },
  {
    id: "fr-unit-1-lesson-2",
    unitId: "fr-unit-1",
    languageId: "fr",
    title: "Daily Life",
    type: "vocabulary",
    order: 2,
    xpReward: 15,
    goals: ["Talk about everyday actions", "Use common verbs"],
    vocabulary: [
      { id: "fr-v-manger", word: "Manger", translation: "To eat", phonetic: "mahn-ZHAY", example: "Je veux manger." },
      { id: "fr-v-boire", word: "Boire", translation: "To drink", phonetic: "BWAHR" },
      { id: "fr-v-dormir", word: "Dormir", translation: "To sleep", phonetic: "dor-MEER" },
      { id: "fr-v-travailler", word: "Travailler", translation: "To work", phonetic: "trah-vah-YAY" },
    ],
    phrases: [
      { id: "fr-p-jai-faim", text: "J'ai faim", translation: "I am hungry", phonetic: "zhay FAHN" },
    ],
    activities: [
      {
        id: "fr-u1-l2-a1",
        type: "multipleChoice",
        prompt: 'What does "Manger" mean?',
        options: [
          { id: "o1", text: "To sleep", correct: false },
          { id: "o2", text: "To eat", correct: true },
          { id: "o3", text: "To work", correct: false },
        ],
      },
      { id: "fr-u1-l2-a2", type: "translate", prompt: 'Translate: "To drink"', answer: "Boire" },
    ],
    aiTeacherPrompt:
      "You're Luc, a cheerful French teacher who makes practice feel easy. Stay on this lesson's everyday verbs — Manger, Boire, Dormir, Travailler. Introduce one at a time slowly with its English meaning, then have the learner say it back and react warmly to each try.",
  },
  {
    id: "fr-unit-1-lesson-3",
    unitId: "fr-unit-1",
    languageId: "fr",
    title: "At the Café",
    type: "chat",
    order: 3,
    xpReward: 15,
    goals: ["Order a drink", "Ask for the bill politely"],
    vocabulary: [
      { id: "fr-v-un-cafe", word: "Un café", translation: "A coffee", phonetic: "uhn kah-FAY", example: "Un café, s'il vous plaît." },
      { id: "fr-v-laddition", word: "L'addition", translation: "The bill", phonetic: "lah-dee-SYOHN" },
      { id: "fr-v-je-voudrais", word: "Je voudrais", translation: "I would like", phonetic: "zhuh voo-DREH" },
    ],
    phrases: [
      { id: "fr-p-je-voudrais-cafe", text: "Je voudrais un café, s'il vous plaît.", translation: "I would like a coffee, please.", phonetic: "zhuh voo-DREH uhn kah-FAY seel voo PLEH" },
    ],
    activities: [
      { id: "fr-u1-l3-a1", type: "translate", prompt: 'Order: "I would like a coffee"', answer: "Je voudrais un café" },
      {
        id: "fr-u1-l3-a2",
        type: "multipleChoice",
        prompt: 'What does "L\'addition" mean?',
        options: [
          { id: "o1", text: "The bill", correct: true },
          { id: "o2", text: "The menu", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Luc, a friendly French tutor playing a warm café waiter. Stay in this café scene only — ordering with 'Je voudrais ...', 'un café', and asking for 'l'addition'. Feed one phrase at a time slowly, listen to their order, gently fix it, and invite them to try again.",
  },
  {
    id: "fr-unit-1-lesson-4",
    unitId: "fr-unit-1",
    languageId: "fr",
    title: "Travel & Directions",
    type: "audio",
    order: 4,
    xpReward: 15,
    goals: ["Ask where something is", "Understand basic directions"],
    vocabulary: [
      { id: "fr-v-ou-est", word: "Où est...?", translation: "Where is...?", phonetic: "oo EH" },
      { id: "fr-v-a-gauche", word: "À gauche", translation: "To the left", phonetic: "ah GOHSH" },
      { id: "fr-v-a-droite", word: "À droite", translation: "To the right", phonetic: "ah DRWAHT" },
      { id: "fr-v-tout-droit", word: "Tout droit", translation: "Straight ahead", phonetic: "too DRWAH" },
    ],
    phrases: [
      { id: "fr-p-ou-est-la-gare", text: "Où est la gare?", translation: "Where is the station?", phonetic: "oo EH lah GAHR" },
    ],
    activities: [
      {
        id: "fr-u1-l4-a1",
        type: "listen",
        prompt: 'Listen and choose: which means "To the left"?',
        options: [
          { id: "o1", text: "À gauche", correct: true },
          { id: "o2", text: "À droite", correct: false },
        ],
      },
      { id: "fr-u1-l4-a2", type: "speak", prompt: 'Say "Straight ahead" out loud', answer: "Tout droit" },
    ],
    aiTeacherPrompt:
      "You're Luc, an upbeat French pronunciation coach. Stay on this directions lesson only — À gauche, À droite, Tout droit, and asking 'Où est...?'. Say each slowly with its meaning, listen closely as they repeat, and celebrate every good attempt while nudging the tricky sounds.",
  },
  {
    id: "fr-unit-1-lesson-5",
    unitId: "fr-unit-1",
    languageId: "fr",
    title: "Shopping",
    type: "vocabulary",
    order: 5,
    xpReward: 15,
    goals: ["Ask how much something costs", "Talk about buying things"],
    vocabulary: [
      { id: "fr-v-combien", word: "Combien", translation: "How much", phonetic: "kohn-BYAHN" },
      { id: "fr-v-acheter", word: "Acheter", translation: "To buy", phonetic: "ash-TAY" },
      { id: "fr-v-le-magasin", word: "Le magasin", translation: "The shop", phonetic: "luh mah-gah-ZAHN" },
      { id: "fr-v-largent", word: "L'argent", translation: "Money", phonetic: "lar-ZHAHN" },
    ],
    phrases: [
      { id: "fr-p-combien-ca-coute", text: "Combien ça coûte?", translation: "How much does it cost?", phonetic: "kohn-BYAHN sah KOOT" },
    ],
    activities: [
      {
        id: "fr-u1-l5-a1",
        type: "multipleChoice",
        prompt: 'How do you ask "How much"?',
        options: [
          { id: "o1", text: "Combien", correct: true },
          { id: "o2", text: "Acheter", correct: false },
        ],
      },
      { id: "fr-u1-l5-a2", type: "translate", prompt: 'Translate: "To buy"', answer: "Acheter" },
    ],
    aiTeacherPrompt:
      "You're Luc, a cheerful French teacher who makes shopping practice fun. Stay on this lesson's words — Combien, Acheter, Le magasin, L'argent, and asking 'Combien ça coûte?'. Bring in one at a time slowly with its meaning, then listen and warmly encourage each try.",
  },
  {
    id: "fr-unit-1-lesson-6",
    unitId: "fr-unit-1",
    languageId: "fr",
    title: "Family & Friends",
    type: "chat",
    order: 6,
    xpReward: 20,
    goals: ["Talk about your family", "Introduce friends"],
    vocabulary: [
      { id: "fr-v-la-famille", word: "La famille", translation: "The family", phonetic: "lah fah-MEE" },
      { id: "fr-v-un-ami", word: "Un ami", translation: "A friend", phonetic: "uhn ah-MEE" },
      { id: "fr-v-ma-mere", word: "Ma mère", translation: "My mother", phonetic: "mah MEHR" },
      { id: "fr-v-mon-pere", word: "Mon père", translation: "My father", phonetic: "mohn PEHR" },
    ],
    phrases: [
      { id: "fr-p-voici-ma-famille", text: "Voici ma famille.", translation: "This is my family.", phonetic: "vwah-SEE mah fah-MEE" },
    ],
    activities: [
      {
        id: "fr-u1-l6-a1",
        type: "multipleChoice",
        prompt: 'What does "Ma mère" mean?',
        options: [
          { id: "o1", text: "My father", correct: false },
          { id: "o2", text: "My mother", correct: true },
        ],
      },
      { id: "fr-u1-l6-a2", type: "translate", prompt: 'Translate: "A friend"', answer: "Un ami" },
    ],
    aiTeacherPrompt:
      "You're Luc, a friendly French tutor who loves hearing about people's families. Stay on this lesson — La famille, Un ami, Ma mère, Mon père, and 'Voici ma famille.'. Introduce one word at a time slowly, role-play a tiny family intro, listen, and warmly invite them to try again.",
  },

  // =========================================================== Japanese · U1
  {
    id: "ja-unit-1-lesson-1",
    unitId: "ja-unit-1",
    languageId: "ja",
    title: "First Greetings",
    type: "vocabulary",
    order: 1,
    xpReward: 10,
    goals: ["Say hello and thank you in Japanese", "Recognize basic greetings"],
    vocabulary: [
      {
        id: "ja-v-konnichiwa",
        word: "こんにちは",
        translation: "Hello / Good afternoon",
        phonetic: "kon-nee-chee-wah",
      },
      {
        id: "ja-v-arigatou",
        word: "ありがとう",
        translation: "Thank you",
        phonetic: "ah-ree-gah-toh",
      },
      {
        id: "ja-v-sayounara",
        word: "さようなら",
        translation: "Goodbye",
        phonetic: "sah-yoh-nah-rah",
      },
    ],
    phrases: [
      {
        id: "ja-p-ogenki",
        text: "お元気ですか？",
        translation: "How are you?",
        phonetic: "oh-gen-kee dess-kah",
      },
    ],
    activities: [
      {
        id: "ja-u1-l1-a1",
        type: "multipleChoice",
        prompt: 'Which word means "Thank you"?',
        options: [
          { id: "o1", text: "こんにちは", correct: false },
          { id: "o2", text: "ありがとう", correct: true },
          { id: "o3", text: "さようなら", correct: false },
        ],
      },
      {
        id: "ja-u1-l1-a2",
        type: "listen",
        prompt: 'Listen and choose the word for "Hello"',
        options: [
          { id: "o1", text: "こんにちは", correct: true },
          { id: "o2", text: "さようなら", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Yuki, a gentle, warm Japanese teacher who makes beginners feel safe. Stay on this greetings lesson — こんにちは, ありがとう, さようなら. Say each slowly with its romaji and meaning, then listen as they repeat and offer soft, genuine encouragement after every try.",
  },
  {
    id: "ja-unit-1-lesson-2",
    unitId: "ja-unit-1",
    languageId: "ja",
    title: "Daily Life",
    type: "vocabulary",
    order: 2,
    xpReward: 15,
    goals: ["Talk about everyday actions", "Use common verbs"],
    vocabulary: [
      { id: "ja-v-taberu", word: "食べる", translation: "To eat", phonetic: "tah-beh-roo", example: "ご飯を食べる。" },
      { id: "ja-v-nomu", word: "飲む", translation: "To drink", phonetic: "noh-moo" },
      { id: "ja-v-neru", word: "寝る", translation: "To sleep", phonetic: "neh-roo" },
      { id: "ja-v-iku", word: "行く", translation: "To go", phonetic: "ee-koo" },
    ],
    phrases: [
      { id: "ja-p-onaka-suita", text: "おなかすいた", translation: "I'm hungry", phonetic: "oh-nah-kah sue-ee-tah" },
    ],
    activities: [
      {
        id: "ja-u1-l2-a1",
        type: "multipleChoice",
        prompt: 'Which word means "To eat"?',
        options: [
          { id: "o1", text: "飲む", correct: false },
          { id: "o2", text: "食べる", correct: true },
          { id: "o3", text: "行く", correct: false },
        ],
      },
      { id: "ja-u1-l2-a2", type: "translate", prompt: 'Translate: "To drink"', answer: "飲む" },
    ],
    aiTeacherPrompt:
      "You're Yuki, a gentle, encouraging Japanese teacher. Stay on this lesson's everyday verbs — 食べる, 飲む, 寝る, 行く. Bring in one at a time slowly with its romaji and meaning, then have the learner say it back and warmly react to each attempt.",
  },
  {
    id: "ja-unit-1-lesson-3",
    unitId: "ja-unit-1",
    languageId: "ja",
    title: "At the Café",
    type: "chat",
    order: 3,
    xpReward: 15,
    goals: ["Order a drink", "Ask for things politely"],
    vocabulary: [
      { id: "ja-v-koohii", word: "コーヒー", translation: "Coffee", phonetic: "koh-hee", example: "コーヒーをください。" },
      { id: "ja-v-omizu", word: "お水", translation: "Water", phonetic: "oh-mee-zoo" },
      { id: "ja-v-kudasai", word: "ください", translation: "Please (give me)", phonetic: "koo-dah-sai" },
    ],
    phrases: [
      { id: "ja-p-koohii-kudasai", text: "コーヒーをください。", translation: "Coffee, please.", phonetic: "koh-hee oh koo-dah-sai" },
    ],
    activities: [
      { id: "ja-u1-l3-a1", type: "translate", prompt: 'Order: "Coffee, please"', answer: "コーヒーをください" },
      {
        id: "ja-u1-l3-a2",
        type: "multipleChoice",
        prompt: 'What does "お水" mean?',
        options: [
          { id: "o1", text: "Water", correct: true },
          { id: "o2", text: "Coffee", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Yuki, a friendly Japanese tutor playing a kind café server. Stay in this café scene only — コーヒー, お水, and ordering with '...をください'. Offer one phrase at a time slowly with its meaning, listen to their order, keep the polite tone, and gently invite them to try again.",
  },
  {
    id: "ja-unit-1-lesson-4",
    unitId: "ja-unit-1",
    languageId: "ja",
    title: "Travel & Directions",
    type: "audio",
    order: 4,
    xpReward: 15,
    goals: ["Ask where something is", "Understand basic directions"],
    vocabulary: [
      { id: "ja-v-doko", word: "どこ", translation: "Where", phonetic: "doh-koh" },
      { id: "ja-v-migi", word: "右", translation: "Right", phonetic: "mee-ghee" },
      { id: "ja-v-hidari", word: "左", translation: "Left", phonetic: "hee-dah-ree" },
      { id: "ja-v-massugu", word: "まっすぐ", translation: "Straight ahead", phonetic: "mahs-soo-goo" },
    ],
    phrases: [
      { id: "ja-p-eki-wa-doko", text: "駅はどこですか？", translation: "Where is the station?", phonetic: "eh-kee wah doh-koh dess-kah" },
    ],
    activities: [
      {
        id: "ja-u1-l4-a1",
        type: "listen",
        prompt: 'Listen and choose: which means "Right"?',
        options: [
          { id: "o1", text: "右", correct: true },
          { id: "o2", text: "左", correct: false },
        ],
      },
      { id: "ja-u1-l4-a2", type: "speak", prompt: 'Say "Straight ahead" out loud', answer: "まっすぐ" },
    ],
    aiTeacherPrompt:
      "You're Yuki, a calm, encouraging Japanese pronunciation coach. Stay on this directions lesson only — どこ, 右, 左, まっすぐ. Say each slowly with its meaning, listen closely as they repeat, and praise every good attempt while gently shaping the sounds.",
  },
  {
    id: "ja-unit-1-lesson-5",
    unitId: "ja-unit-1",
    languageId: "ja",
    title: "Shopping",
    type: "vocabulary",
    order: 5,
    xpReward: 15,
    goals: ["Ask how much something costs", "Talk about buying things"],
    vocabulary: [
      { id: "ja-v-ikura", word: "いくら", translation: "How much", phonetic: "ee-koo-rah" },
      { id: "ja-v-kau", word: "買う", translation: "To buy", phonetic: "kah-oo" },
      { id: "ja-v-omise", word: "お店", translation: "Shop", phonetic: "oh-mee-seh" },
      { id: "ja-v-okane", word: "お金", translation: "Money", phonetic: "oh-kah-neh" },
    ],
    phrases: [
      { id: "ja-p-ikura-desu-ka", text: "いくらですか？", translation: "How much is it?", phonetic: "ee-koo-rah dess-kah" },
    ],
    activities: [
      {
        id: "ja-u1-l5-a1",
        type: "multipleChoice",
        prompt: 'Which word means "How much"?',
        options: [
          { id: "o1", text: "いくら", correct: true },
          { id: "o2", text: "買う", correct: false },
        ],
      },
      { id: "ja-u1-l5-a2", type: "translate", prompt: 'Translate: "Money"', answer: "お金" },
    ],
    aiTeacherPrompt:
      "You're Yuki, a gentle, encouraging Japanese teacher. Stay on this lesson's shopping words — いくら, 買う, お店, お金, and asking 'いくらですか？'. Introduce one at a time slowly with its meaning, then listen and warmly cheer each try.",
  },
  {
    id: "ja-unit-1-lesson-6",
    unitId: "ja-unit-1",
    languageId: "ja",
    title: "Family & Friends",
    type: "chat",
    order: 6,
    xpReward: 20,
    goals: ["Talk about your family", "Introduce friends"],
    vocabulary: [
      { id: "ja-v-kazoku", word: "家族", translation: "Family", phonetic: "kah-zoh-koo" },
      { id: "ja-v-tomodachi", word: "友達", translation: "Friend", phonetic: "toh-moh-dah-chee" },
      { id: "ja-v-haha", word: "母", translation: "Mother", phonetic: "hah-hah" },
      { id: "ja-v-chichi", word: "父", translation: "Father", phonetic: "chee-chee" },
    ],
    phrases: [
      { id: "ja-p-kazoku-desu", text: "これは私の家族です。", translation: "This is my family.", phonetic: "koh-reh wah wah-tah-shee no kah-zoh-koo dess" },
    ],
    activities: [
      {
        id: "ja-u1-l6-a1",
        type: "multipleChoice",
        prompt: 'What does "友達" mean?',
        options: [
          { id: "o1", text: "Family", correct: false },
          { id: "o2", text: "Friend", correct: true },
        ],
      },
      { id: "ja-u1-l6-a2", type: "translate", prompt: 'Translate: "Mother"', answer: "母" },
    ],
    aiTeacherPrompt:
      "You're Yuki, a warm Japanese tutor who loves hearing about families. Stay on this lesson — 家族, 友達, 母, 父, and 'これは私の家族です。'. Introduce one word at a time slowly, role-play a tiny family intro, listen, and gently invite them to try again.",
  },

  // ============================================================ English · U1
  {
    id: "en-unit-1-lesson-1",
    unitId: "en-unit-1",
    languageId: "en",
    title: "Greetings",
    type: "vocabulary",
    order: 1,
    xpReward: 10,
    goals: ["Say hello and goodbye in English", "Recognize everyday greetings"],
    vocabulary: [
      { id: "en-v-hello", word: "Hello", translation: "A greeting", phonetic: "heh-LOH", example: "Hello! How are you?" },
      { id: "en-v-goodbye", word: "Goodbye", translation: "A farewell", phonetic: "good-BYE", example: "Goodbye, see you tomorrow." },
      { id: "en-v-good-morning", word: "Good morning", translation: "Morning greeting", phonetic: "good MOR-ning", example: "Good morning, teacher." },
    ],
    phrases: [
      { id: "en-p-how-are-you", text: "How are you?", translation: "A way to ask about someone's wellbeing", phonetic: "how ar yoo" },
    ],
    activities: [
      {
        id: "en-u1-l1-a1",
        type: "multipleChoice",
        prompt: "Which word is a greeting?",
        options: [
          { id: "o1", text: "Goodbye", correct: false },
          { id: "o2", text: "Hello", correct: true },
          { id: "o3", text: "Thanks", correct: false },
        ],
      },
      { id: "en-u1-l1-a2", type: "translate", prompt: 'Say the morning greeting', answer: "Good morning", hint: "Two words — starts with Good." },
    ],
    aiTeacherPrompt:
      "You're Emma, a warm, friendly English teacher who's genuinely happy to help. Stay on this greetings lesson — Hello, Goodbye, Good morning. Say each one slowly with its meaning, then listen as the learner repeats and cheer their progress with real warmth.",
  },
  {
    id: "en-unit-1-lesson-2",
    unitId: "en-unit-1",
    languageId: "en",
    title: "Introduce Yourself",
    type: "chat",
    order: 2,
    xpReward: 15,
    goals: ["Tell someone your name", "Ask for someone's name"],
    vocabulary: [
      { id: "en-v-my-name-is", word: "My name is", translation: "Used to say your name", phonetic: "my naym iz", example: "My name is Ana." },
      { id: "en-v-nice-to-meet-you", word: "Nice to meet you", translation: "A polite greeting when meeting someone", phonetic: "nys too meet yoo" },
    ],
    phrases: [
      { id: "en-p-whats-your-name", text: "What is your name?", translation: "A way to ask someone's name", phonetic: "wot iz yor naym" },
    ],
    activities: [
      { id: "en-u1-l2-a1", type: "translate", prompt: 'Introduce yourself: name is Ana', answer: "My name is Ana" },
      {
        id: "en-u1-l2-a2",
        type: "multipleChoice",
        prompt: 'What do you say when you meet someone?',
        options: [
          { id: "o1", text: "Goodbye", correct: false },
          { id: "o2", text: "Nice to meet you", correct: true },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Emma, a friendly English tutor who loves a warm chat. Stay on this lesson — introducing yourself with 'My name is ...', 'Nice to meet you', and asking 'What is your name?'. Role-play a tiny introduction, listen to their reply, fix slips kindly, and have them try it again.",
  },
  {
    id: "en-unit-1-lesson-3",
    unitId: "en-unit-1",
    languageId: "en",
    title: "Daily Life",
    type: "vocabulary",
    order: 3,
    xpReward: 15,
    goals: ["Talk about everyday actions", "Use common verbs"],
    vocabulary: [
      { id: "en-v-eat", word: "Eat", translation: "To have food", phonetic: "eet", example: "I eat breakfast." },
      { id: "en-v-drink", word: "Drink", translation: "To have a liquid", phonetic: "drink" },
      { id: "en-v-sleep", word: "Sleep", translation: "To rest at night", phonetic: "sleep" },
      { id: "en-v-go", word: "Go", translation: "To move somewhere", phonetic: "goh" },
    ],
    phrases: [
      { id: "en-p-im-hungry", text: "I am hungry", translation: "Said when you want to eat", phonetic: "I am HUNG-gree" },
    ],
    activities: [
      {
        id: "en-u1-l3-a1",
        type: "multipleChoice",
        prompt: 'Which word means "to have food"?',
        options: [
          { id: "o1", text: "Sleep", correct: false },
          { id: "o2", text: "Eat", correct: true },
          { id: "o3", text: "Go", correct: false },
        ],
      },
      { id: "en-u1-l3-a2", type: "translate", prompt: "Say the word for resting at night", answer: "Sleep" },
    ],
    aiTeacherPrompt:
      "You're Emma, a warm, friendly English teacher who makes practice feel easy. Stay on this lesson's everyday verbs — Eat, Drink, Sleep, Go. Say one at a time slowly with its meaning, then have the learner say it back and cheer each try.",
  },
  {
    id: "en-unit-1-lesson-4",
    unitId: "en-unit-1",
    languageId: "en",
    title: "At the Café",
    type: "chat",
    order: 4,
    xpReward: 15,
    goals: ["Order a drink", "Ask for things politely"],
    vocabulary: [
      { id: "en-v-coffee", word: "Coffee", translation: "A hot drink", phonetic: "KAW-fee", example: "A coffee, please." },
      { id: "en-v-water", word: "Water", translation: "A clear drink", phonetic: "WAH-ter" },
      { id: "en-v-please", word: "Please", translation: "A polite word when asking", phonetic: "pleez" },
    ],
    phrases: [
      { id: "en-p-coffee-please", text: "A coffee, please.", translation: "A polite way to order coffee", phonetic: "a KAW-fee pleez" },
    ],
    activities: [
      { id: "en-u1-l4-a1", type: "translate", prompt: "Order politely: ask for a coffee", answer: "A coffee, please" },
      {
        id: "en-u1-l4-a2",
        type: "multipleChoice",
        prompt: "Which word is the polite word when asking?",
        options: [
          { id: "o1", text: "Please", correct: true },
          { id: "o2", text: "Water", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Emma, a friendly English tutor playing a kind café server. Stay in this café scene only — Coffee, Water, Please, and ordering 'A coffee, please.'. Offer one phrase at a time slowly, listen to their order, fix slips kindly, and have them try again.",
  },
  {
    id: "en-unit-1-lesson-5",
    unitId: "en-unit-1",
    languageId: "en",
    title: "Travel & Directions",
    type: "audio",
    order: 5,
    xpReward: 15,
    goals: ["Ask where something is", "Understand basic directions"],
    vocabulary: [
      { id: "en-v-where", word: "Where", translation: "Asks about a place", phonetic: "wair" },
      { id: "en-v-left", word: "Left", translation: "The opposite of right", phonetic: "left" },
      { id: "en-v-right", word: "Right", translation: "The opposite of left", phonetic: "ryt" },
      { id: "en-v-straight", word: "Straight ahead", translation: "Directly in front of you", phonetic: "strayt uh-HED" },
    ],
    phrases: [
      { id: "en-p-where-station", text: "Where is the station?", translation: "Asks for the location of the station", phonetic: "wair iz thuh STAY-shun" },
    ],
    activities: [
      {
        id: "en-u1-l5-a1",
        type: "listen",
        prompt: "Listen and choose: which is the opposite of right?",
        options: [
          { id: "o1", text: "Left", correct: true },
          { id: "o2", text: "Right", correct: false },
        ],
      },
      { id: "en-u1-l5-a2", type: "speak", prompt: 'Say "Straight ahead" out loud', answer: "Straight ahead" },
    ],
    aiTeacherPrompt:
      "You're Emma, an upbeat English pronunciation coach. Stay on this directions lesson only — Where, Left, Right, Straight ahead, and asking 'Where is the station?'. Say each slowly with its meaning, listen as they repeat, and celebrate every good attempt.",
  },

  // ============================================================= German · U1
  {
    id: "de-unit-1-lesson-1",
    unitId: "de-unit-1",
    languageId: "de",
    title: "Greetings",
    type: "vocabulary",
    order: 1,
    xpReward: 10,
    goals: ["Greet people in German", "Say goodbye politely"],
    vocabulary: [
      { id: "de-v-hallo", word: "Hallo", translation: "Hello", phonetic: "HAH-loh", example: "Hallo! Wie geht's?" },
      { id: "de-v-tschuss", word: "Tschüss", translation: "Bye", phonetic: "CHUESS" },
      { id: "de-v-guten-morgen", word: "Guten Morgen", translation: "Good morning", phonetic: "GOO-ten MOR-gen" },
      { id: "de-v-danke", word: "Danke", translation: "Thank you", phonetic: "DAHN-kuh" },
    ],
    phrases: [
      { id: "de-p-wie-gehts", text: "Wie geht's?", translation: "How are you?", phonetic: "vee GAYTS" },
    ],
    activities: [
      {
        id: "de-u1-l1-a1",
        type: "multipleChoice",
        prompt: 'How do you say "Hello" in German?',
        options: [
          { id: "o1", text: "Tschüss", correct: false },
          { id: "o2", text: "Hallo", correct: true },
          { id: "o3", text: "Danke", correct: false },
        ],
      },
      { id: "de-u1-l1-a2", type: "translate", prompt: 'Translate: "Thank you"', answer: "Danke" },
    ],
    aiTeacherPrompt:
      "You're Lukas, a cheerful, energetic German teacher who makes learning feel fun. Stay on this greetings lesson — Hallo, Tschüss, Guten Morgen, Danke. Say each one slowly with its meaning, then listen as they repeat and warmly celebrate each try.",
  },
  {
    id: "de-unit-1-lesson-2",
    unitId: "de-unit-1",
    languageId: "de",
    title: "Introduce Yourself",
    type: "chat",
    order: 2,
    xpReward: 15,
    goals: ["Tell someone your name", "Ask for someone's name"],
    vocabulary: [
      { id: "de-v-ich-heisse", word: "Ich heiße", translation: "My name is", phonetic: "ikh HY-suh", example: "Ich heiße Ana." },
      { id: "de-v-freut-mich", word: "Freut mich", translation: "Nice to meet you", phonetic: "FROYT mikh" },
    ],
    phrases: [
      { id: "de-p-wie-heisst-du", text: "Wie heißt du?", translation: "What is your name?", phonetic: "vee HYST doo" },
    ],
    activities: [
      { id: "de-u1-l2-a1", type: "translate", prompt: 'Say: "My name is Ana"', answer: "Ich heiße Ana" },
      {
        id: "de-u1-l2-a2",
        type: "multipleChoice",
        prompt: 'What does "Wie heißt du?" mean?',
        options: [
          { id: "o1", text: "How are you?", correct: false },
          { id: "o2", text: "What is your name?", correct: true },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Lukas, a friendly German tutor with an easy, upbeat manner. Stay on this lesson — introducing yourself with 'Ich heiße ...', 'Freut mich', and asking 'Wie heißt du?'. Role-play a tiny introduction, listen to their reply, fix slips kindly, and invite them to try again.",
  },
  {
    id: "de-unit-1-lesson-3",
    unitId: "de-unit-1",
    languageId: "de",
    title: "Daily Life",
    type: "vocabulary",
    order: 3,
    xpReward: 15,
    goals: ["Talk about everyday actions", "Use common verbs"],
    vocabulary: [
      { id: "de-v-essen", word: "Essen", translation: "To eat", phonetic: "EH-sen", example: "Ich möchte essen." },
      { id: "de-v-trinken", word: "Trinken", translation: "To drink", phonetic: "TRIN-ken" },
      { id: "de-v-schlafen", word: "Schlafen", translation: "To sleep", phonetic: "SHLAH-fen" },
      { id: "de-v-gehen", word: "Gehen", translation: "To go", phonetic: "GAY-en" },
    ],
    phrases: [
      { id: "de-p-ich-habe-hunger", text: "Ich habe Hunger", translation: "I am hungry", phonetic: "ikh HAH-buh HOONG-er" },
    ],
    activities: [
      {
        id: "de-u1-l3-a1",
        type: "multipleChoice",
        prompt: 'What does "Essen" mean?',
        options: [
          { id: "o1", text: "To sleep", correct: false },
          { id: "o2", text: "To eat", correct: true },
          { id: "o3", text: "To go", correct: false },
        ],
      },
      { id: "de-u1-l3-a2", type: "translate", prompt: 'Translate: "To drink"', answer: "Trinken" },
    ],
    aiTeacherPrompt:
      "You're Lukas, a cheerful German teacher who makes practice feel easy. Stay on this lesson's everyday verbs — Essen, Trinken, Schlafen, Gehen. Bring in one at a time slowly with its English meaning, then have the learner say it back and warmly cheer each try.",
  },
  {
    id: "de-unit-1-lesson-4",
    unitId: "de-unit-1",
    languageId: "de",
    title: "At the Café",
    type: "chat",
    order: 4,
    xpReward: 15,
    goals: ["Order a drink", "Ask for things politely"],
    vocabulary: [
      { id: "de-v-kaffee", word: "Kaffee", translation: "Coffee", phonetic: "KAH-fey", example: "Einen Kaffee, bitte." },
      { id: "de-v-wasser", word: "Wasser", translation: "Water", phonetic: "VAH-ser" },
      { id: "de-v-ich-moechte", word: "Ich möchte", translation: "I would like", phonetic: "ikh MOOKH-tuh" },
    ],
    phrases: [
      { id: "de-p-einen-kaffee-bitte", text: "Einen Kaffee, bitte.", translation: "A coffee, please.", phonetic: "EYE-nen KAH-fey BIT-tuh" },
    ],
    activities: [
      { id: "de-u1-l4-a1", type: "translate", prompt: 'Order: "A coffee, please"', answer: "Einen Kaffee, bitte" },
      {
        id: "de-u1-l4-a2",
        type: "multipleChoice",
        prompt: 'What does "Wasser" mean?',
        options: [
          { id: "o1", text: "Water", correct: true },
          { id: "o2", text: "Coffee", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Lukas, a friendly German tutor playing a kind café server. Stay in this café scene only — Kaffee, Wasser, Ich möchte, and ordering 'Einen Kaffee, bitte.'. Offer one phrase at a time slowly with its meaning, listen to their order, gently fix it, and invite them to try again.",
  },
  {
    id: "de-unit-1-lesson-5",
    unitId: "de-unit-1",
    languageId: "de",
    title: "Travel & Directions",
    type: "audio",
    order: 5,
    xpReward: 15,
    goals: ["Ask where something is", "Understand basic directions"],
    vocabulary: [
      { id: "de-v-wo", word: "Wo", translation: "Where", phonetic: "voh" },
      { id: "de-v-links", word: "Links", translation: "Left", phonetic: "links" },
      { id: "de-v-rechts", word: "Rechts", translation: "Right", phonetic: "rekhts" },
      { id: "de-v-geradeaus", word: "Geradeaus", translation: "Straight ahead", phonetic: "geh-RAH-duh-ows" },
    ],
    phrases: [
      { id: "de-p-wo-ist-der-bahnhof", text: "Wo ist der Bahnhof?", translation: "Where is the station?", phonetic: "voh ist dair BAHN-hohf" },
    ],
    activities: [
      {
        id: "de-u1-l5-a1",
        type: "listen",
        prompt: 'Listen and choose: which means "Left"?',
        options: [
          { id: "o1", text: "Links", correct: true },
          { id: "o2", text: "Rechts", correct: false },
        ],
      },
      { id: "de-u1-l5-a2", type: "speak", prompt: 'Say "Straight ahead" out loud', answer: "Geradeaus" },
    ],
    aiTeacherPrompt:
      "You're Lukas, an upbeat German pronunciation coach. Stay on this directions lesson only — Wo, Links, Rechts, Geradeaus, and asking 'Wo ist der Bahnhof?'. Say each slowly with its meaning, listen closely as they repeat, and celebrate every good attempt while shaping the tricky sounds.",
  },

  // ========================================================= Indonesian · U1
  {
    id: "id-unit-1-lesson-1",
    unitId: "id-unit-1",
    languageId: "id",
    title: "Greetings",
    type: "vocabulary",
    order: 1,
    xpReward: 10,
    goals: ["Greet people in Indonesian", "Say thank you"],
    vocabulary: [
      { id: "id-v-halo", word: "Halo", translation: "Hello", phonetic: "HAH-loh", example: "Halo! Apa kabar?" },
      { id: "id-v-selamat-pagi", word: "Selamat pagi", translation: "Good morning", phonetic: "suh-LAH-mat PAH-gee" },
      { id: "id-v-terima-kasih", word: "Terima kasih", translation: "Thank you", phonetic: "tuh-REE-mah KAH-see" },
      { id: "id-v-sampai-jumpa", word: "Sampai jumpa", translation: "See you later", phonetic: "SAM-pai JOOM-pah" },
    ],
    phrases: [
      { id: "id-p-apa-kabar", text: "Apa kabar?", translation: "How are you?", phonetic: "AH-pah KAH-bar" },
    ],
    activities: [
      {
        id: "id-u1-l1-a1",
        type: "multipleChoice",
        prompt: 'How do you say "Thank you" in Indonesian?',
        options: [
          { id: "o1", text: "Halo", correct: false },
          { id: "o2", text: "Terima kasih", correct: true },
          { id: "o3", text: "Selamat pagi", correct: false },
        ],
      },
      { id: "id-u1-l1-a2", type: "translate", prompt: 'Translate: "Good morning"', answer: "Selamat pagi" },
    ],
    aiTeacherPrompt:
      "You're Dewi, a warm, friendly Indonesian teacher who's delighted to teach. Stay on this greetings lesson — Halo, Selamat pagi, Terima kasih, Sampai jumpa. Say each one slowly with its meaning, then listen as they repeat and cheer their progress kindly.",
  },
  {
    id: "id-unit-1-lesson-2",
    unitId: "id-unit-1",
    languageId: "id",
    title: "Introduce Yourself",
    type: "chat",
    order: 2,
    xpReward: 15,
    goals: ["Tell someone your name", "Ask for someone's name"],
    vocabulary: [
      { id: "id-v-nama-saya", word: "Nama saya", translation: "My name is", phonetic: "NAH-mah SAH-yah", example: "Nama saya Ana." },
      { id: "id-v-senang-bertemu", word: "Senang bertemu", translation: "Nice to meet you", phonetic: "suh-NANG buhr-TUH-moo" },
    ],
    phrases: [
      { id: "id-p-siapa-nama-kamu", text: "Siapa nama kamu?", translation: "What is your name?", phonetic: "see-AH-pah NAH-mah KAH-moo" },
    ],
    activities: [
      { id: "id-u1-l2-a1", type: "translate", prompt: 'Say: "My name is Ana"', answer: "Nama saya Ana" },
      {
        id: "id-u1-l2-a2",
        type: "multipleChoice",
        prompt: 'What does "Siapa nama kamu?" mean?',
        options: [
          { id: "o1", text: "How are you?", correct: false },
          { id: "o2", text: "What is your name?", correct: true },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Dewi, a friendly Indonesian tutor who loves a warm chat. Stay on this lesson — introducing yourself with 'Nama saya ...', 'Senang bertemu', and asking 'Siapa nama kamu?'. Role-play a tiny introduction, listen to their reply, fix slips kindly, and have them try again.",
  },
  {
    id: "id-unit-1-lesson-3",
    unitId: "id-unit-1",
    languageId: "id",
    title: "Daily Life",
    type: "vocabulary",
    order: 3,
    xpReward: 15,
    goals: ["Talk about everyday actions", "Use common verbs"],
    vocabulary: [
      { id: "id-v-makan", word: "Makan", translation: "To eat", phonetic: "MAH-kan", example: "Saya mau makan." },
      { id: "id-v-minum", word: "Minum", translation: "To drink", phonetic: "MEE-noom" },
      { id: "id-v-tidur", word: "Tidur", translation: "To sleep", phonetic: "TEE-door" },
      { id: "id-v-pergi", word: "Pergi", translation: "To go", phonetic: "PUHR-gee" },
    ],
    phrases: [
      { id: "id-p-saya-lapar", text: "Saya lapar", translation: "I am hungry", phonetic: "SAH-yah LAH-par" },
    ],
    activities: [
      {
        id: "id-u1-l3-a1",
        type: "multipleChoice",
        prompt: 'What does "Makan" mean?',
        options: [
          { id: "o1", text: "To sleep", correct: false },
          { id: "o2", text: "To eat", correct: true },
          { id: "o3", text: "To go", correct: false },
        ],
      },
      { id: "id-u1-l3-a2", type: "translate", prompt: 'Translate: "To drink"', answer: "Minum" },
    ],
    aiTeacherPrompt:
      "You're Dewi, a warm Indonesian teacher who makes practice feel easy. Stay on this lesson's everyday verbs — Makan, Minum, Tidur, Pergi. Bring in one at a time slowly with its English meaning, then have the learner say it back and warmly cheer each try.",
  },
  {
    id: "id-unit-1-lesson-4",
    unitId: "id-unit-1",
    languageId: "id",
    title: "At the Café",
    type: "chat",
    order: 4,
    xpReward: 15,
    goals: ["Order a drink", "Ask for things politely"],
    vocabulary: [
      { id: "id-v-kopi", word: "Kopi", translation: "Coffee", phonetic: "KOH-pee", example: "Saya mau kopi." },
      { id: "id-v-air", word: "Air", translation: "Water", phonetic: "AH-eer" },
      { id: "id-v-saya-mau", word: "Saya mau", translation: "I want", phonetic: "SAH-yah MAH-oo" },
    ],
    phrases: [
      { id: "id-p-saya-mau-kopi", text: "Saya mau kopi.", translation: "I want a coffee.", phonetic: "SAH-yah MAH-oo KOH-pee" },
    ],
    activities: [
      { id: "id-u1-l4-a1", type: "translate", prompt: 'Order: "I want a coffee"', answer: "Saya mau kopi" },
      {
        id: "id-u1-l4-a2",
        type: "multipleChoice",
        prompt: 'What does "Air" mean?',
        options: [
          { id: "o1", text: "Water", correct: true },
          { id: "o2", text: "Coffee", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Dewi, a friendly Indonesian tutor playing a kind café server. Stay in this café scene only — Kopi, Air, Saya mau, and ordering 'Saya mau kopi.'. Offer one phrase at a time slowly with its meaning, listen to their order, gently fix it, and invite them to try again.",
  },
  {
    id: "id-unit-1-lesson-5",
    unitId: "id-unit-1",
    languageId: "id",
    title: "Travel & Directions",
    type: "audio",
    order: 5,
    xpReward: 15,
    goals: ["Ask where something is", "Understand basic directions"],
    vocabulary: [
      { id: "id-v-di-mana", word: "Di mana", translation: "Where", phonetic: "dee MAH-nah" },
      { id: "id-v-kiri", word: "Kiri", translation: "Left", phonetic: "KEE-ree" },
      { id: "id-v-kanan", word: "Kanan", translation: "Right", phonetic: "KAH-nan" },
      { id: "id-v-lurus", word: "Lurus", translation: "Straight ahead", phonetic: "LOO-roos" },
    ],
    phrases: [
      { id: "id-p-di-mana-stasiun", text: "Di mana stasiun?", translation: "Where is the station?", phonetic: "dee MAH-nah stah-SEE-oon" },
    ],
    activities: [
      {
        id: "id-u1-l5-a1",
        type: "listen",
        prompt: 'Listen and choose: which means "Left"?',
        options: [
          { id: "o1", text: "Kiri", correct: true },
          { id: "o2", text: "Kanan", correct: false },
        ],
      },
      { id: "id-u1-l5-a2", type: "speak", prompt: 'Say "Straight ahead" out loud', answer: "Lurus" },
    ],
    aiTeacherPrompt:
      "You're Dewi, an upbeat Indonesian pronunciation coach. Stay on this directions lesson only — Di mana, Kiri, Kanan, Lurus, and asking 'Di mana stasiun?'. Say each slowly with its meaning, listen closely as they repeat, and celebrate every good attempt.",
  },

  // ============================================================ Chinese · U1
  {
    id: "zh-unit-1-lesson-1",
    unitId: "zh-unit-1",
    languageId: "zh",
    title: "First Greetings",
    type: "vocabulary",
    order: 1,
    xpReward: 10,
    goals: ["Say hello and thank you in Mandarin", "Recognize basic greetings"],
    vocabulary: [
      { id: "zh-v-nihao", word: "你好", translation: "Hello", phonetic: "nee-HOW", example: "你好！你好吗？" },
      { id: "zh-v-xiexie", word: "谢谢", translation: "Thank you", phonetic: "SHYEH-shyeh" },
      { id: "zh-v-zaijian", word: "再见", translation: "Goodbye", phonetic: "DZYE-jyen" },
    ],
    phrases: [
      { id: "zh-p-nihaoma", text: "你好吗？", translation: "How are you?", phonetic: "nee-HOW-mah" },
    ],
    activities: [
      {
        id: "zh-u1-l1-a1",
        type: "multipleChoice",
        prompt: 'Which word means "Thank you"?',
        options: [
          { id: "o1", text: "你好", correct: false },
          { id: "o2", text: "谢谢", correct: true },
          { id: "o3", text: "再见", correct: false },
        ],
      },
      {
        id: "zh-u1-l1-a2",
        type: "listen",
        prompt: 'Listen and choose the word for "Hello"',
        options: [
          { id: "o1", text: "你好", correct: true },
          { id: "o2", text: "再见", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Mei, a gentle, warm Mandarin teacher who makes tones feel approachable. Stay on this greetings lesson — 你好, 谢谢, 再见. Say each slowly with its pinyin, tone, and meaning, then listen as they repeat and offer calm, genuine encouragement.",
  },
  {
    id: "zh-unit-1-lesson-2",
    unitId: "zh-unit-1",
    languageId: "zh",
    title: "Introduce Yourself",
    type: "chat",
    order: 2,
    xpReward: 15,
    goals: ["Tell someone your name", "Ask for someone's name"],
    vocabulary: [
      { id: "zh-v-wojiao", word: "我叫", translation: "My name is (I am called)", phonetic: "waw JYOW", example: "我叫安娜。" },
      { id: "zh-v-zaoshanghao", word: "早上好", translation: "Good morning", phonetic: "DZAO-shang-how" },
    ],
    phrases: [
      { id: "zh-p-nijiao", text: "你叫什么名字？", translation: "What is your name?", phonetic: "nee JYOW shen-muh ming-dzuh" },
    ],
    activities: [
      { id: "zh-u1-l2-a1", type: "translate", prompt: 'Say: "My name is Anna" (我叫…)', answer: "我叫安娜" },
      {
        id: "zh-u1-l2-a2",
        type: "multipleChoice",
        prompt: 'What does "早上好" mean?',
        options: [
          { id: "o1", text: "Good morning", correct: true },
          { id: "o2", text: "Goodbye", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Mei, a friendly Mandarin tutor with a warm, patient touch. Stay on this lesson — introducing yourself with '我叫 ...', '早上好', and asking '你叫什么名字？'. Mind the tones, role-play a tiny introduction, listen to their reply, fix slips kindly, and invite them to try again.",
  },
  {
    id: "zh-unit-1-lesson-3",
    unitId: "zh-unit-1",
    languageId: "zh",
    title: "Daily Life",
    type: "vocabulary",
    order: 3,
    xpReward: 15,
    goals: ["Talk about everyday actions", "Use common verbs"],
    vocabulary: [
      { id: "zh-v-chi", word: "吃", translation: "To eat", phonetic: "chr", example: "我想吃饭。" },
      { id: "zh-v-he", word: "喝", translation: "To drink", phonetic: "huh" },
      { id: "zh-v-shuijiao", word: "睡觉", translation: "To sleep", phonetic: "shway-jyaow" },
      { id: "zh-v-qu", word: "去", translation: "To go", phonetic: "chyoo" },
    ],
    phrases: [
      { id: "zh-p-wo-e-le", text: "我饿了", translation: "I'm hungry", phonetic: "waw uh luh" },
    ],
    activities: [
      {
        id: "zh-u1-l3-a1",
        type: "multipleChoice",
        prompt: 'Which word means "To eat"?',
        options: [
          { id: "o1", text: "喝", correct: false },
          { id: "o2", text: "吃", correct: true },
          { id: "o3", text: "去", correct: false },
        ],
      },
      { id: "zh-u1-l3-a2", type: "translate", prompt: 'Translate: "To drink"', answer: "喝" },
    ],
    aiTeacherPrompt:
      "You're Mei, a gentle Mandarin teacher who makes practice feel easy. Stay on this lesson's everyday verbs — 吃, 喝, 睡觉, 去. Bring in one at a time slowly with its pinyin, tone, and meaning, then have the learner say it back and warmly cheer each try.",
  },
  {
    id: "zh-unit-1-lesson-4",
    unitId: "zh-unit-1",
    languageId: "zh",
    title: "At the Café",
    type: "chat",
    order: 4,
    xpReward: 15,
    goals: ["Order a drink", "Ask for things politely"],
    vocabulary: [
      { id: "zh-v-kafei", word: "咖啡", translation: "Coffee", phonetic: "kah-fey", example: "请给我咖啡。" },
      { id: "zh-v-shui", word: "水", translation: "Water", phonetic: "shway" },
      { id: "zh-v-qing-gei-wo", word: "请给我", translation: "Please give me", phonetic: "ching gay waw" },
    ],
    phrases: [
      { id: "zh-p-qing-gei-wo-kafei", text: "请给我咖啡。", translation: "Please give me a coffee.", phonetic: "ching gay waw kah-fey" },
    ],
    activities: [
      { id: "zh-u1-l4-a1", type: "translate", prompt: 'Order: "Please give me a coffee"', answer: "请给我咖啡" },
      {
        id: "zh-u1-l4-a2",
        type: "multipleChoice",
        prompt: 'What does "水" mean?',
        options: [
          { id: "o1", text: "Water", correct: true },
          { id: "o2", text: "Coffee", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Mei, a friendly Mandarin tutor playing a kind café server. Stay in this café scene only — 咖啡, 水, 请给我, and ordering '请给我咖啡。'. Mind the tones, offer one phrase at a time slowly with its meaning, listen to their order, and gently invite them to try again.",
  },
  {
    id: "zh-unit-1-lesson-5",
    unitId: "zh-unit-1",
    languageId: "zh",
    title: "Travel & Directions",
    type: "audio",
    order: 5,
    xpReward: 15,
    goals: ["Ask where something is", "Understand basic directions"],
    vocabulary: [
      { id: "zh-v-nali", word: "哪里", translation: "Where", phonetic: "nah-lee" },
      { id: "zh-v-zuo", word: "左", translation: "Left", phonetic: "dzwaw" },
      { id: "zh-v-you", word: "右", translation: "Right", phonetic: "yoh" },
      { id: "zh-v-yizhi-zou", word: "一直走", translation: "Straight ahead", phonetic: "ee-jr dzoh" },
    ],
    phrases: [
      { id: "zh-p-chezhan-zai-nali", text: "车站在哪里？", translation: "Where is the station?", phonetic: "chuh-jan dzai nah-lee" },
    ],
    activities: [
      {
        id: "zh-u1-l5-a1",
        type: "listen",
        prompt: 'Listen and choose: which means "Left"?',
        options: [
          { id: "o1", text: "左", correct: true },
          { id: "o2", text: "右", correct: false },
        ],
      },
      { id: "zh-u1-l5-a2", type: "speak", prompt: 'Say "Straight ahead" out loud', answer: "一直走" },
    ],
    aiTeacherPrompt:
      "You're Mei, a gentle Mandarin pronunciation coach. Stay on this directions lesson only — 哪里, 左, 右, 一直走, and asking '车站在哪里？'. Say each slowly with its pinyin, tone, and meaning, listen closely as they repeat, and celebrate every good attempt.",
  },

  // ============================================================ Italian · U1
  {
    id: "it-unit-1-lesson-1",
    unitId: "it-unit-1",
    languageId: "it",
    title: "Greetings",
    type: "vocabulary",
    order: 1,
    xpReward: 10,
    goals: ["Greet people in Italian", "Say thank you"],
    vocabulary: [
      { id: "it-v-ciao", word: "Ciao", translation: "Hi / Bye", phonetic: "CHOW", example: "Ciao! Come stai?" },
      { id: "it-v-buongiorno", word: "Buongiorno", translation: "Good morning", phonetic: "bwon-JOR-no" },
      { id: "it-v-grazie", word: "Grazie", translation: "Thank you", phonetic: "GRAH-tsyeh" },
      { id: "it-v-arrivederci", word: "Arrivederci", translation: "Goodbye", phonetic: "ah-ree-veh-DER-chee" },
    ],
    phrases: [
      { id: "it-p-come-stai", text: "Come stai?", translation: "How are you?", phonetic: "KOH-meh STAI" },
    ],
    activities: [
      {
        id: "it-u1-l1-a1",
        type: "multipleChoice",
        prompt: 'How do you say "Thank you" in Italian?',
        options: [
          { id: "o1", text: "Ciao", correct: false },
          { id: "o2", text: "Grazie", correct: true },
          { id: "o3", text: "Buongiorno", correct: false },
        ],
      },
      { id: "it-u1-l1-a2", type: "translate", prompt: 'Translate: "Good morning"', answer: "Buongiorno" },
    ],
    aiTeacherPrompt:
      "You're Marco, a cheerful, lively Italian teacher who brings real warmth to every word. Stay on this greetings lesson — Ciao, Buongiorno, Grazie, Arrivederci. Say each one slowly with its meaning, then listen as they repeat and celebrate the melody of their tries.",
  },
  {
    id: "it-unit-1-lesson-2",
    unitId: "it-unit-1",
    languageId: "it",
    title: "Introduce Yourself",
    type: "chat",
    order: 2,
    xpReward: 15,
    goals: ["Tell someone your name", "Ask for someone's name"],
    vocabulary: [
      { id: "it-v-mi-chiamo", word: "Mi chiamo", translation: "My name is", phonetic: "mee KYAH-mo", example: "Mi chiamo Ana." },
      { id: "it-v-piacere", word: "Piacere", translation: "Nice to meet you", phonetic: "pyah-CHEH-reh" },
    ],
    phrases: [
      { id: "it-p-come-ti-chiami", text: "Come ti chiami?", translation: "What is your name?", phonetic: "KOH-meh tee KYAH-mee" },
    ],
    activities: [
      { id: "it-u1-l2-a1", type: "translate", prompt: 'Say: "My name is Ana"', answer: "Mi chiamo Ana" },
      {
        id: "it-u1-l2-a2",
        type: "multipleChoice",
        prompt: 'What does "Come ti chiami?" mean?',
        options: [
          { id: "o1", text: "How are you?", correct: false },
          { id: "o2", text: "What is your name?", correct: true },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Marco, a friendly Italian tutor who loves a warm, lively chat. Stay on this lesson — introducing yourself with 'Mi chiamo ...', 'Piacere', and asking 'Come ti chiami?'. Role-play a tiny introduction, listen to their reply, fix slips kindly, and have them try again.",
  },
  {
    id: "it-unit-1-lesson-3",
    unitId: "it-unit-1",
    languageId: "it",
    title: "Daily Life",
    type: "vocabulary",
    order: 3,
    xpReward: 15,
    goals: ["Talk about everyday actions", "Use common verbs"],
    vocabulary: [
      { id: "it-v-mangiare", word: "Mangiare", translation: "To eat", phonetic: "man-JAH-reh", example: "Voglio mangiare." },
      { id: "it-v-bere", word: "Bere", translation: "To drink", phonetic: "BEH-reh" },
      { id: "it-v-dormire", word: "Dormire", translation: "To sleep", phonetic: "dor-MEE-reh" },
      { id: "it-v-andare", word: "Andare", translation: "To go", phonetic: "an-DAH-reh" },
    ],
    phrases: [
      { id: "it-p-ho-fame", text: "Ho fame", translation: "I am hungry", phonetic: "oh FAH-meh" },
    ],
    activities: [
      {
        id: "it-u1-l3-a1",
        type: "multipleChoice",
        prompt: 'What does "Mangiare" mean?',
        options: [
          { id: "o1", text: "To sleep", correct: false },
          { id: "o2", text: "To eat", correct: true },
          { id: "o3", text: "To go", correct: false },
        ],
      },
      { id: "it-u1-l3-a2", type: "translate", prompt: 'Translate: "To drink"', answer: "Bere" },
    ],
    aiTeacherPrompt:
      "You're Marco, a cheerful Italian teacher who makes practice feel easy. Stay on this lesson's everyday verbs — Mangiare, Bere, Dormire, Andare. Bring in one at a time slowly with its English meaning, then have the learner say it back and warmly cheer each try.",
  },
  {
    id: "it-unit-1-lesson-4",
    unitId: "it-unit-1",
    languageId: "it",
    title: "At the Café",
    type: "chat",
    order: 4,
    xpReward: 15,
    goals: ["Order a drink", "Ask for things politely"],
    vocabulary: [
      { id: "it-v-un-caffe", word: "Un caffè", translation: "A coffee", phonetic: "oon kaf-FEH", example: "Vorrei un caffè." },
      { id: "it-v-acqua", word: "Acqua", translation: "Water", phonetic: "AH-kwah" },
      { id: "it-v-vorrei", word: "Vorrei", translation: "I would like", phonetic: "vor-RAY" },
    ],
    phrases: [
      { id: "it-p-vorrei-un-caffe", text: "Vorrei un caffè, per favore.", translation: "I would like a coffee, please.", phonetic: "vor-RAY oon kaf-FEH pehr fah-VOH-reh" },
    ],
    activities: [
      { id: "it-u1-l4-a1", type: "translate", prompt: 'Order: "I would like a coffee"', answer: "Vorrei un caffè" },
      {
        id: "it-u1-l4-a2",
        type: "multipleChoice",
        prompt: 'What does "Acqua" mean?',
        options: [
          { id: "o1", text: "Water", correct: true },
          { id: "o2", text: "Coffee", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Marco, a friendly Italian tutor playing a kind café server. Stay in this café scene only — Un caffè, Acqua, Vorrei, and ordering 'Vorrei un caffè, per favore.'. Offer one phrase at a time slowly with its meaning, listen to their order, gently fix it, and invite them to try again.",
  },
  {
    id: "it-unit-1-lesson-5",
    unitId: "it-unit-1",
    languageId: "it",
    title: "Travel & Directions",
    type: "audio",
    order: 5,
    xpReward: 15,
    goals: ["Ask where something is", "Understand basic directions"],
    vocabulary: [
      { id: "it-v-dove", word: "Dove", translation: "Where", phonetic: "DOH-veh" },
      { id: "it-v-a-sinistra", word: "A sinistra", translation: "To the left", phonetic: "ah see-NEE-strah" },
      { id: "it-v-a-destra", word: "A destra", translation: "To the right", phonetic: "ah DEH-strah" },
      { id: "it-v-sempre-dritto", word: "Sempre dritto", translation: "Straight ahead", phonetic: "SEM-preh DREET-toh" },
    ],
    phrases: [
      { id: "it-p-dove-la-stazione", text: "Dov'è la stazione?", translation: "Where is the station?", phonetic: "doh-VEH lah stah-TSYOH-neh" },
    ],
    activities: [
      {
        id: "it-u1-l5-a1",
        type: "listen",
        prompt: 'Listen and choose: which means "To the left"?',
        options: [
          { id: "o1", text: "A sinistra", correct: true },
          { id: "o2", text: "A destra", correct: false },
        ],
      },
      { id: "it-u1-l5-a2", type: "speak", prompt: 'Say "Straight ahead" out loud', answer: "Sempre dritto" },
    ],
    aiTeacherPrompt:
      "You're Marco, an upbeat Italian pronunciation coach. Stay on this directions lesson only — Dove, A sinistra, A destra, Sempre dritto, and asking 'Dov'è la stazione?'. Say each slowly with its meaning, listen closely as they repeat, and celebrate every good attempt.",
  },

  // ========================================================= Portuguese · U1
  {
    id: "pt-unit-1-lesson-1",
    unitId: "pt-unit-1",
    languageId: "pt",
    title: "Greetings",
    type: "vocabulary",
    order: 1,
    xpReward: 10,
    goals: ["Greet people in Portuguese", "Say thank you"],
    vocabulary: [
      { id: "pt-v-ola", word: "Olá", translation: "Hello", phonetic: "oh-LAH", example: "Olá! Tudo bem?" },
      { id: "pt-v-bom-dia", word: "Bom dia", translation: "Good morning", phonetic: "bohn DEE-ah" },
      { id: "pt-v-obrigado", word: "Obrigado", translation: "Thank you", phonetic: "oh-bree-GAH-doo" },
      { id: "pt-v-tchau", word: "Tchau", translation: "Bye", phonetic: "CHOW" },
    ],
    phrases: [
      { id: "pt-p-tudo-bem", text: "Tudo bem?", translation: "How are you?", phonetic: "TOO-doo BENG" },
    ],
    activities: [
      {
        id: "pt-u1-l1-a1",
        type: "multipleChoice",
        prompt: 'How do you say "Hello" in Portuguese?',
        options: [
          { id: "o1", text: "Tchau", correct: false },
          { id: "o2", text: "Olá", correct: true },
          { id: "o3", text: "Obrigado", correct: false },
        ],
      },
      { id: "pt-u1-l1-a2", type: "translate", prompt: 'Translate: "Good morning"', answer: "Bom dia" },
    ],
    aiTeacherPrompt:
      "You're Rafael, a warm, sunny Brazilian Portuguese teacher who makes learners feel welcome. Stay on this greetings lesson — Olá, Bom dia, Obrigado, Tchau. Say each one slowly with its meaning, then listen as they repeat and cheer their progress kindly.",
  },
  {
    id: "pt-unit-1-lesson-2",
    unitId: "pt-unit-1",
    languageId: "pt",
    title: "Introduce Yourself",
    type: "chat",
    order: 2,
    xpReward: 15,
    goals: ["Tell someone your name", "Ask for someone's name"],
    vocabulary: [
      { id: "pt-v-meu-nome-e", word: "Meu nome é", translation: "My name is", phonetic: "MEH-oo NOH-mee eh", example: "Meu nome é Ana." },
      { id: "pt-v-prazer", word: "Prazer", translation: "Nice to meet you", phonetic: "prah-ZEHR" },
    ],
    phrases: [
      { id: "pt-p-qual-seu-nome", text: "Qual é o seu nome?", translation: "What is your name?", phonetic: "kwow eh oo SEH-oo NOH-mee" },
    ],
    activities: [
      { id: "pt-u1-l2-a1", type: "translate", prompt: 'Say: "My name is Ana"', answer: "Meu nome é Ana" },
      {
        id: "pt-u1-l2-a2",
        type: "multipleChoice",
        prompt: 'What does "Qual é o seu nome?" mean?',
        options: [
          { id: "o1", text: "How are you?", correct: false },
          { id: "o2", text: "What is your name?", correct: true },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Rafael, a friendly Brazilian Portuguese tutor with a warm, easy vibe. Stay on this lesson — introducing yourself with 'Meu nome é ...', 'Prazer', and asking 'Qual é o seu nome?'. Role-play a tiny introduction, listen to their reply, fix slips kindly, and invite them to try again.",
  },
  {
    id: "pt-unit-1-lesson-3",
    unitId: "pt-unit-1",
    languageId: "pt",
    title: "Daily Life",
    type: "vocabulary",
    order: 3,
    xpReward: 15,
    goals: ["Talk about everyday actions", "Use common verbs"],
    vocabulary: [
      { id: "pt-v-comer", word: "Comer", translation: "To eat", phonetic: "koh-MEHR", example: "Quero comer." },
      { id: "pt-v-beber", word: "Beber", translation: "To drink", phonetic: "beh-BEHR" },
      { id: "pt-v-dormir", word: "Dormir", translation: "To sleep", phonetic: "dor-MEER" },
      { id: "pt-v-ir", word: "Ir", translation: "To go", phonetic: "eer" },
    ],
    phrases: [
      { id: "pt-p-estou-com-fome", text: "Estou com fome", translation: "I am hungry", phonetic: "es-TOH kong FOH-mee" },
    ],
    activities: [
      {
        id: "pt-u1-l3-a1",
        type: "multipleChoice",
        prompt: 'What does "Comer" mean?',
        options: [
          { id: "o1", text: "To sleep", correct: false },
          { id: "o2", text: "To eat", correct: true },
          { id: "o3", text: "To go", correct: false },
        ],
      },
      { id: "pt-u1-l3-a2", type: "translate", prompt: 'Translate: "To drink"', answer: "Beber" },
    ],
    aiTeacherPrompt:
      "You're Rafael, a warm Brazilian Portuguese teacher who makes practice feel easy. Stay on this lesson's everyday verbs — Comer, Beber, Dormir, Ir. Bring in one at a time slowly with its English meaning, then have the learner say it back and warmly cheer each try.",
  },
  {
    id: "pt-unit-1-lesson-4",
    unitId: "pt-unit-1",
    languageId: "pt",
    title: "At the Café",
    type: "chat",
    order: 4,
    xpReward: 15,
    goals: ["Order a drink", "Ask for things politely"],
    vocabulary: [
      { id: "pt-v-um-cafe", word: "Um café", translation: "A coffee", phonetic: "oong kah-FEH", example: "Um café, por favor." },
      { id: "pt-v-agua", word: "Água", translation: "Water", phonetic: "AH-gwah" },
      { id: "pt-v-eu-quero", word: "Eu quero", translation: "I want", phonetic: "eh-oo KEH-roo" },
    ],
    phrases: [
      { id: "pt-p-um-cafe-por-favor", text: "Um café, por favor.", translation: "A coffee, please.", phonetic: "oong kah-FEH por fah-VOR" },
    ],
    activities: [
      { id: "pt-u1-l4-a1", type: "translate", prompt: 'Order: "A coffee, please"', answer: "Um café, por favor" },
      {
        id: "pt-u1-l4-a2",
        type: "multipleChoice",
        prompt: 'What does "Água" mean?',
        options: [
          { id: "o1", text: "Water", correct: true },
          { id: "o2", text: "Coffee", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Rafael, a friendly Brazilian Portuguese tutor playing a kind café server. Stay in this café scene only — Um café, Água, Eu quero, and ordering 'Um café, por favor.'. Offer one phrase at a time slowly with its meaning, listen to their order, gently fix it, and invite them to try again.",
  },
  {
    id: "pt-unit-1-lesson-5",
    unitId: "pt-unit-1",
    languageId: "pt",
    title: "Travel & Directions",
    type: "audio",
    order: 5,
    xpReward: 15,
    goals: ["Ask where something is", "Understand basic directions"],
    vocabulary: [
      { id: "pt-v-onde", word: "Onde", translation: "Where", phonetic: "OHN-jee" },
      { id: "pt-v-a-esquerda", word: "À esquerda", translation: "To the left", phonetic: "ah es-KEHR-dah" },
      { id: "pt-v-a-direita", word: "À direita", translation: "To the right", phonetic: "ah jee-RAY-tah" },
      { id: "pt-v-em-frente", word: "Em frente", translation: "Straight ahead", phonetic: "eng FREN-chee" },
    ],
    phrases: [
      { id: "pt-p-onde-fica-a-estacao", text: "Onde fica a estação?", translation: "Where is the station?", phonetic: "OHN-jee FEE-kah ah es-tah-SOWNG" },
    ],
    activities: [
      {
        id: "pt-u1-l5-a1",
        type: "listen",
        prompt: 'Listen and choose: which means "To the left"?',
        options: [
          { id: "o1", text: "À esquerda", correct: true },
          { id: "o2", text: "À direita", correct: false },
        ],
      },
      { id: "pt-u1-l5-a2", type: "speak", prompt: 'Say "Straight ahead" out loud', answer: "Em frente" },
    ],
    aiTeacherPrompt:
      "You're Rafael, an upbeat Brazilian Portuguese pronunciation coach. Stay on this directions lesson only — Onde, À esquerda, À direita, Em frente, and asking 'Onde fica a estação?'. Say each slowly with its meaning, listen closely as they repeat, and celebrate every good attempt.",
  },

  // ============================================================= Korean · U1
  {
    id: "ko-unit-1-lesson-1",
    unitId: "ko-unit-1",
    languageId: "ko",
    title: "First Greetings",
    type: "vocabulary",
    order: 1,
    xpReward: 10,
    goals: ["Say hello and thank you in Korean", "Recognize basic greetings"],
    vocabulary: [
      { id: "ko-v-annyeong", word: "안녕하세요", translation: "Hello", phonetic: "ahn-nyong-hah-SE-yo", example: "안녕하세요! 잘 지내세요?" },
      { id: "ko-v-gamsa", word: "감사합니다", translation: "Thank you", phonetic: "gam-sah-HAM-ni-da" },
      { id: "ko-v-annyeonghi", word: "안녕히 가세요", translation: "Goodbye (to someone leaving)", phonetic: "ahn-nyong-hee GAH-se-yo" },
    ],
    phrases: [
      { id: "ko-p-jaljinaeyo", text: "잘 지내세요?", translation: "How are you?", phonetic: "jal ji-NAE-se-yo" },
    ],
    activities: [
      {
        id: "ko-u1-l1-a1",
        type: "multipleChoice",
        prompt: 'Which word means "Thank you"?',
        options: [
          { id: "o1", text: "안녕하세요", correct: false },
          { id: "o2", text: "감사합니다", correct: true },
          { id: "o3", text: "안녕히 가세요", correct: false },
        ],
      },
      {
        id: "ko-u1-l1-a2",
        type: "listen",
        prompt: 'Listen and choose the word for "Hello"',
        options: [
          { id: "o1", text: "안녕하세요", correct: true },
          { id: "o2", text: "감사합니다", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Jisoo, a gentle, warm Korean teacher who puts beginners at ease. Stay on this greetings lesson — 안녕하세요, 감사합니다, 안녕히 가세요. Say each slowly with its romanization and meaning, then listen as they repeat and offer calm, genuine encouragement.",
  },
  {
    id: "ko-unit-1-lesson-2",
    unitId: "ko-unit-1",
    languageId: "ko",
    title: "Introduce Yourself",
    type: "chat",
    order: 2,
    xpReward: 15,
    goals: ["Tell someone your name", "Ask for someone's name"],
    vocabulary: [
      { id: "ko-v-ireum", word: "제 이름은", translation: "My name is", phonetic: "je ee-REU-meun", example: "제 이름은 안나입니다." },
      { id: "ko-v-bangapseumnida", word: "반갑습니다", translation: "Nice to meet you", phonetic: "ban-GAP-seum-ni-da" },
    ],
    phrases: [
      { id: "ko-p-ireumi-mwoyeyo", text: "이름이 뭐예요?", translation: "What is your name?", phonetic: "ee-REU-mee MWO-ye-yo" },
    ],
    activities: [
      { id: "ko-u1-l2-a1", type: "translate", prompt: 'Say: "My name is Anna"', answer: "제 이름은 안나입니다" },
      {
        id: "ko-u1-l2-a2",
        type: "multipleChoice",
        prompt: 'What does "이름이 뭐예요?" mean?',
        options: [
          { id: "o1", text: "How are you?", correct: false },
          { id: "o2", text: "What is your name?", correct: true },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Jisoo, a friendly Korean tutor with a warm, patient touch. Stay on this lesson — introducing yourself with '제 이름은 ...입니다', '반갑습니다', and asking '이름이 뭐예요?'. Role-play a tiny introduction, listen to their reply, fix slips kindly, and have them try again.",
  },
  {
    id: "ko-unit-1-lesson-3",
    unitId: "ko-unit-1",
    languageId: "ko",
    title: "Daily Life",
    type: "vocabulary",
    order: 3,
    xpReward: 15,
    goals: ["Talk about everyday actions", "Use common verbs"],
    vocabulary: [
      { id: "ko-v-meokda", word: "먹다", translation: "To eat", phonetic: "muhk-dah", example: "밥을 먹다." },
      { id: "ko-v-masida", word: "마시다", translation: "To drink", phonetic: "mah-shee-dah" },
      { id: "ko-v-jada", word: "자다", translation: "To sleep", phonetic: "jah-dah" },
      { id: "ko-v-gada", word: "가다", translation: "To go", phonetic: "gah-dah" },
    ],
    phrases: [
      { id: "ko-p-baegopayo", text: "배고파요", translation: "I'm hungry", phonetic: "bae-go-PAH-yo" },
    ],
    activities: [
      {
        id: "ko-u1-l3-a1",
        type: "multipleChoice",
        prompt: 'Which word means "To eat"?',
        options: [
          { id: "o1", text: "마시다", correct: false },
          { id: "o2", text: "먹다", correct: true },
          { id: "o3", text: "가다", correct: false },
        ],
      },
      { id: "ko-u1-l3-a2", type: "translate", prompt: 'Translate: "To drink"', answer: "마시다" },
    ],
    aiTeacherPrompt:
      "You're Jisoo, a gentle Korean teacher who makes practice feel easy. Stay on this lesson's everyday verbs — 먹다, 마시다, 자다, 가다. Bring in one at a time slowly with its romanization and meaning, then have the learner say it back and warmly cheer each try.",
  },
  {
    id: "ko-unit-1-lesson-4",
    unitId: "ko-unit-1",
    languageId: "ko",
    title: "At the Café",
    type: "chat",
    order: 4,
    xpReward: 15,
    goals: ["Order a drink", "Ask for things politely"],
    vocabulary: [
      { id: "ko-v-keopi", word: "커피", translation: "Coffee", phonetic: "kuh-pee", example: "커피 주세요." },
      { id: "ko-v-mul", word: "물", translation: "Water", phonetic: "mool" },
      { id: "ko-v-juseyo", word: "주세요", translation: "Please (give me)", phonetic: "joo-se-yo" },
    ],
    phrases: [
      { id: "ko-p-keopi-juseyo", text: "커피 주세요.", translation: "Coffee, please.", phonetic: "kuh-pee joo-se-yo" },
    ],
    activities: [
      { id: "ko-u1-l4-a1", type: "translate", prompt: 'Order: "Coffee, please"', answer: "커피 주세요" },
      {
        id: "ko-u1-l4-a2",
        type: "multipleChoice",
        prompt: 'What does "물" mean?',
        options: [
          { id: "o1", text: "Water", correct: true },
          { id: "o2", text: "Coffee", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Jisoo, a friendly Korean tutor playing a kind café server. Stay in this café scene only — 커피, 물, 주세요, and ordering '커피 주세요.'. Offer one phrase at a time slowly with its meaning, keep the polite tone, listen to their order, and gently invite them to try again.",
  },
  {
    id: "ko-unit-1-lesson-5",
    unitId: "ko-unit-1",
    languageId: "ko",
    title: "Travel & Directions",
    type: "audio",
    order: 5,
    xpReward: 15,
    goals: ["Ask where something is", "Understand basic directions"],
    vocabulary: [
      { id: "ko-v-eodi", word: "어디", translation: "Where", phonetic: "uh-dee" },
      { id: "ko-v-oenjjok", word: "왼쪽", translation: "Left", phonetic: "wen-jjok" },
      { id: "ko-v-oreunjjok", word: "오른쪽", translation: "Right", phonetic: "oh-reun-jjok" },
      { id: "ko-v-jikjin", word: "직진", translation: "Straight ahead", phonetic: "jik-jin" },
    ],
    phrases: [
      { id: "ko-p-yeogi-eodiyeyo", text: "역이 어디예요?", translation: "Where is the station?", phonetic: "yuh-gee uh-dee-ye-yo" },
    ],
    activities: [
      {
        id: "ko-u1-l5-a1",
        type: "listen",
        prompt: 'Listen and choose: which means "Left"?',
        options: [
          { id: "o1", text: "왼쪽", correct: true },
          { id: "o2", text: "오른쪽", correct: false },
        ],
      },
      { id: "ko-u1-l5-a2", type: "speak", prompt: 'Say "Straight ahead" out loud', answer: "직진" },
    ],
    aiTeacherPrompt:
      "You're Jisoo, a calm Korean pronunciation coach. Stay on this directions lesson only — 어디, 왼쪽, 오른쪽, 직진, and asking '역이 어디예요?'. Say each slowly with its romanization and meaning, listen closely as they repeat, and celebrate every good attempt.",
  },

  // ============================================================ Russian · U1
  {
    id: "ru-unit-1-lesson-1",
    unitId: "ru-unit-1",
    languageId: "ru",
    title: "First Greetings",
    type: "vocabulary",
    order: 1,
    xpReward: 10,
    goals: ["Say hello and thank you in Russian", "Recognize basic greetings"],
    vocabulary: [
      { id: "ru-v-privet", word: "Привет", translation: "Hi", phonetic: "pree-VYET", example: "Привет! Как дела?" },
      { id: "ru-v-spasibo", word: "Спасибо", translation: "Thank you", phonetic: "spah-SEE-bah" },
      { id: "ru-v-dosvidaniya", word: "До свидания", translation: "Goodbye", phonetic: "dah svee-DAH-nya" },
    ],
    phrases: [
      { id: "ru-p-kak-dela", text: "Как дела?", translation: "How are you?", phonetic: "kak dye-LAH" },
    ],
    activities: [
      {
        id: "ru-u1-l1-a1",
        type: "multipleChoice",
        prompt: 'Which word means "Thank you"?',
        options: [
          { id: "o1", text: "Привет", correct: false },
          { id: "o2", text: "Спасибо", correct: true },
          { id: "o3", text: "До свидания", correct: false },
        ],
      },
      {
        id: "ru-u1-l1-a2",
        type: "listen",
        prompt: 'Listen and choose the word for "Hi"',
        options: [
          { id: "o1", text: "Привет", correct: true },
          { id: "o2", text: "Спасибо", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Anna, a gentle, warm Russian teacher who makes hard sounds feel doable. Stay on this greetings lesson — Привет, Спасибо, До свидания. Say each slowly with its romanization and meaning, then listen as they repeat and offer calm, genuine encouragement.",
  },
  {
    id: "ru-unit-1-lesson-2",
    unitId: "ru-unit-1",
    languageId: "ru",
    title: "Introduce Yourself",
    type: "chat",
    order: 2,
    xpReward: 15,
    goals: ["Tell someone your name", "Ask for someone's name"],
    vocabulary: [
      { id: "ru-v-menya-zovut", word: "Меня зовут", translation: "My name is", phonetic: "me-NYA za-VOOT", example: "Меня зовут Анна." },
      { id: "ru-v-ochen-priyatno", word: "Очень приятно", translation: "Nice to meet you", phonetic: "OH-chen pree-YAT-na" },
    ],
    phrases: [
      { id: "ru-p-kak-tebya-zovut", text: "Как тебя зовут?", translation: "What is your name?", phonetic: "kak te-BYA za-VOOT" },
    ],
    activities: [
      { id: "ru-u1-l2-a1", type: "translate", prompt: 'Say: "My name is Anna"', answer: "Меня зовут Анна" },
      {
        id: "ru-u1-l2-a2",
        type: "multipleChoice",
        prompt: 'What does "Как тебя зовут?" mean?',
        options: [
          { id: "o1", text: "How are you?", correct: false },
          { id: "o2", text: "What is your name?", correct: true },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Anna, a friendly Russian tutor with a warm, patient manner. Stay on this lesson — introducing yourself with 'Меня зовут ...', 'Очень приятно', and asking 'Как тебя зовут?'. Role-play a tiny introduction, listen to their reply, fix slips kindly, and invite them to try again.",
  },
  {
    id: "ru-unit-1-lesson-3",
    unitId: "ru-unit-1",
    languageId: "ru",
    title: "Daily Life",
    type: "vocabulary",
    order: 3,
    xpReward: 15,
    goals: ["Talk about everyday actions", "Use common verbs"],
    vocabulary: [
      { id: "ru-v-est", word: "есть", translation: "To eat", phonetic: "yest", example: "Я хочу есть." },
      { id: "ru-v-pit", word: "пить", translation: "To drink", phonetic: "peet" },
      { id: "ru-v-spat", word: "спать", translation: "To sleep", phonetic: "spat" },
      { id: "ru-v-idti", word: "идти", translation: "To go", phonetic: "eed-TEE" },
    ],
    phrases: [
      { id: "ru-p-ya-goloden", text: "Я голоден", translation: "I am hungry", phonetic: "ya GOH-lah-den" },
    ],
    activities: [
      {
        id: "ru-u1-l3-a1",
        type: "multipleChoice",
        prompt: 'Which word means "To eat"?',
        options: [
          { id: "o1", text: "пить", correct: false },
          { id: "o2", text: "есть", correct: true },
          { id: "o3", text: "идти", correct: false },
        ],
      },
      { id: "ru-u1-l3-a2", type: "translate", prompt: 'Translate: "To drink"', answer: "пить" },
    ],
    aiTeacherPrompt:
      "You're Anna, a gentle Russian teacher who makes practice feel easy. Stay on this lesson's everyday verbs — есть, пить, спать, идти. Bring in one at a time slowly with its romanization and meaning, then have the learner say it back and warmly cheer each try.",
  },
  {
    id: "ru-unit-1-lesson-4",
    unitId: "ru-unit-1",
    languageId: "ru",
    title: "At the Café",
    type: "chat",
    order: 4,
    xpReward: 15,
    goals: ["Order a drink", "Ask for things politely"],
    vocabulary: [
      { id: "ru-v-kofe", word: "кофе", translation: "Coffee", phonetic: "KOH-feh", example: "Кофе, пожалуйста." },
      { id: "ru-v-voda", word: "вода", translation: "Water", phonetic: "vah-DAH" },
      { id: "ru-v-ya-hochu", word: "Я хочу", translation: "I want", phonetic: "ya khah-CHOO" },
    ],
    phrases: [
      { id: "ru-p-kofe-pozhaluysta", text: "Кофе, пожалуйста.", translation: "Coffee, please.", phonetic: "KOH-feh pah-ZHAH-loo-stah" },
    ],
    activities: [
      { id: "ru-u1-l4-a1", type: "translate", prompt: 'Order: "Coffee, please"', answer: "Кофе, пожалуйста" },
      {
        id: "ru-u1-l4-a2",
        type: "multipleChoice",
        prompt: 'What does "вода" mean?',
        options: [
          { id: "o1", text: "Water", correct: true },
          { id: "o2", text: "Coffee", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Anna, a friendly Russian tutor playing a kind café server. Stay in this café scene only — кофе, вода, Я хочу, and ordering 'Кофе, пожалуйста.'. Offer one phrase at a time slowly with its meaning, listen to their order, gently fix it, and invite them to try again.",
  },
  {
    id: "ru-unit-1-lesson-5",
    unitId: "ru-unit-1",
    languageId: "ru",
    title: "Travel & Directions",
    type: "audio",
    order: 5,
    xpReward: 15,
    goals: ["Ask where something is", "Understand basic directions"],
    vocabulary: [
      { id: "ru-v-gde", word: "где", translation: "Where", phonetic: "gdyeh" },
      { id: "ru-v-nalevo", word: "налево", translation: "To the left", phonetic: "nah-LYEH-vah" },
      { id: "ru-v-napravo", word: "направо", translation: "To the right", phonetic: "nah-PRAH-vah" },
      { id: "ru-v-pryamo", word: "прямо", translation: "Straight ahead", phonetic: "PRYAH-mah" },
    ],
    phrases: [
      { id: "ru-p-gde-vokzal", text: "Где вокзал?", translation: "Where is the station?", phonetic: "gdyeh vahk-ZAHL" },
    ],
    activities: [
      {
        id: "ru-u1-l5-a1",
        type: "listen",
        prompt: 'Listen and choose: which means "To the left"?',
        options: [
          { id: "o1", text: "налево", correct: true },
          { id: "o2", text: "направо", correct: false },
        ],
      },
      { id: "ru-u1-l5-a2", type: "speak", prompt: 'Say "Straight ahead" out loud', answer: "прямо" },
    ],
    aiTeacherPrompt:
      "You're Anna, a calm Russian pronunciation coach. Stay on this directions lesson only — где, налево, направо, прямо, and asking 'Где вокзал?'. Say each slowly with its romanization and meaning, listen closely as they repeat, and celebrate every good attempt.",
  },

  // ============================================================= Arabic · U1
  {
    id: "ar-unit-1-lesson-1",
    unitId: "ar-unit-1",
    languageId: "ar",
    title: "First Greetings",
    type: "vocabulary",
    order: 1,
    xpReward: 10,
    goals: ["Say hello and thank you in Arabic", "Recognize basic greetings"],
    vocabulary: [
      { id: "ar-v-marhaba", word: "مرحبا", translation: "Hello", phonetic: "MAR-ha-ba", example: "مرحبا! كيف حالك؟" },
      { id: "ar-v-shukran", word: "شكرا", translation: "Thank you", phonetic: "SHOOK-ran" },
      { id: "ar-v-maa-salama", word: "مع السلامة", translation: "Goodbye", phonetic: "ma-as-sa-LA-ma" },
    ],
    phrases: [
      { id: "ar-p-kayf-halak", text: "كيف حالك؟", translation: "How are you?", phonetic: "kayf HA-lak" },
    ],
    activities: [
      {
        id: "ar-u1-l1-a1",
        type: "multipleChoice",
        prompt: 'Which word means "Thank you"?',
        options: [
          { id: "o1", text: "مرحبا", correct: false },
          { id: "o2", text: "شكرا", correct: true },
          { id: "o3", text: "مع السلامة", correct: false },
        ],
      },
      {
        id: "ar-u1-l1-a2",
        type: "listen",
        prompt: 'Listen and choose the word for "Hello"',
        options: [
          { id: "o1", text: "مرحبا", correct: true },
          { id: "o2", text: "شكرا", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Layla, a gentle, warm Arabic teacher who makes new sounds feel friendly. Stay on this greetings lesson — مرحبا, شكرا, مع السلامة. Say each slowly with its romanization and meaning, then listen as they repeat and offer calm, genuine encouragement.",
  },
  {
    id: "ar-unit-1-lesson-2",
    unitId: "ar-unit-1",
    languageId: "ar",
    title: "Introduce Yourself",
    type: "chat",
    order: 2,
    xpReward: 15,
    goals: ["Tell someone your name", "Ask for someone's name"],
    vocabulary: [
      { id: "ar-v-ismi", word: "اسمي", translation: "My name is", phonetic: "IS-mee", example: "اسمي آنا." },
      { id: "ar-v-sabah-alkhayr", word: "صباح الخير", translation: "Good morning", phonetic: "sa-BAH al-KHAYR" },
    ],
    phrases: [
      { id: "ar-p-ma-ismuka", text: "ما اسمك؟", translation: "What is your name?", phonetic: "ma IS-mu-ka" },
    ],
    activities: [
      { id: "ar-u1-l2-a1", type: "translate", prompt: 'Say: "My name is Anna" (اسمي…)', answer: "اسمي آنا" },
      {
        id: "ar-u1-l2-a2",
        type: "multipleChoice",
        prompt: 'What does "صباح الخير" mean?',
        options: [
          { id: "o1", text: "Good morning", correct: true },
          { id: "o2", text: "Goodbye", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Layla, a friendly Arabic tutor with a warm, patient touch. Stay on this lesson — introducing yourself with 'اسمي ...', 'صباح الخير', and asking 'ما اسمك؟'. Role-play a tiny introduction, listen to their reply, fix slips kindly, and have them try again.",
  },
  {
    id: "ar-unit-1-lesson-3",
    unitId: "ar-unit-1",
    languageId: "ar",
    title: "Daily Life",
    type: "vocabulary",
    order: 3,
    xpReward: 15,
    goals: ["Talk about everyday actions", "Use common verbs"],
    vocabulary: [
      { id: "ar-v-yakul", word: "يأكل", translation: "To eat", phonetic: "YAH-kul", example: "أريد أن آكل." },
      { id: "ar-v-yashrab", word: "يشرب", translation: "To drink", phonetic: "YASH-rab" },
      { id: "ar-v-yanam", word: "ينام", translation: "To sleep", phonetic: "ya-NAAM" },
      { id: "ar-v-yadhhab", word: "يذهب", translation: "To go", phonetic: "YADH-hab" },
    ],
    phrases: [
      { id: "ar-p-ana-jaie", text: "أنا جائع", translation: "I am hungry", phonetic: "ana JAA-i" },
    ],
    activities: [
      {
        id: "ar-u1-l3-a1",
        type: "multipleChoice",
        prompt: 'Which word means "To eat"?',
        options: [
          { id: "o1", text: "يشرب", correct: false },
          { id: "o2", text: "يأكل", correct: true },
          { id: "o3", text: "يذهب", correct: false },
        ],
      },
      { id: "ar-u1-l3-a2", type: "translate", prompt: 'Translate: "To drink"', answer: "يشرب" },
    ],
    aiTeacherPrompt:
      "You're Layla, a gentle Arabic teacher who makes practice feel easy. Stay on this lesson's everyday verbs — يأكل, يشرب, ينام, يذهب. Bring in one at a time slowly with its romanization and meaning, then have the learner say it back and warmly cheer each try.",
  },
  {
    id: "ar-unit-1-lesson-4",
    unitId: "ar-unit-1",
    languageId: "ar",
    title: "At the Café",
    type: "chat",
    order: 4,
    xpReward: 15,
    goals: ["Order a drink", "Ask for things politely"],
    vocabulary: [
      { id: "ar-v-qahwa", word: "قهوة", translation: "Coffee", phonetic: "QAH-wa", example: "قهوة من فضلك." },
      { id: "ar-v-maa", word: "ماء", translation: "Water", phonetic: "maa" },
      { id: "ar-v-min-fadlik", word: "من فضلك", translation: "Please", phonetic: "min FAD-lik" },
    ],
    phrases: [
      { id: "ar-p-qahwa-min-fadlik", text: "قهوة من فضلك.", translation: "Coffee, please.", phonetic: "QAH-wa min FAD-lik" },
    ],
    activities: [
      { id: "ar-u1-l4-a1", type: "translate", prompt: 'Order: "Coffee, please"', answer: "قهوة من فضلك" },
      {
        id: "ar-u1-l4-a2",
        type: "multipleChoice",
        prompt: 'What does "ماء" mean?',
        options: [
          { id: "o1", text: "Water", correct: true },
          { id: "o2", text: "Coffee", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Layla, a friendly Arabic tutor playing a kind café server. Stay in this café scene only — قهوة, ماء, من فضلك, and ordering 'قهوة من فضلك.'. Offer one phrase at a time slowly with its meaning, listen to their order, gently fix it, and invite them to try again.",
  },
  {
    id: "ar-unit-1-lesson-5",
    unitId: "ar-unit-1",
    languageId: "ar",
    title: "Travel & Directions",
    type: "audio",
    order: 5,
    xpReward: 15,
    goals: ["Ask where something is", "Understand basic directions"],
    vocabulary: [
      { id: "ar-v-ayna", word: "أين", translation: "Where", phonetic: "AY-na" },
      { id: "ar-v-yasar", word: "يسار", translation: "Left", phonetic: "ya-SAAR" },
      { id: "ar-v-yamin", word: "يمين", translation: "Right", phonetic: "ya-MEEN" },
      { id: "ar-v-ala-tul", word: "على طول", translation: "Straight ahead", phonetic: "a-la TOOL" },
    ],
    phrases: [
      { id: "ar-p-ayna-almahatta", text: "أين المحطة؟", translation: "Where is the station?", phonetic: "AY-na al-ma-HAT-ta" },
    ],
    activities: [
      {
        id: "ar-u1-l5-a1",
        type: "listen",
        prompt: 'Listen and choose: which means "Left"?',
        options: [
          { id: "o1", text: "يسار", correct: true },
          { id: "o2", text: "يمين", correct: false },
        ],
      },
      { id: "ar-u1-l5-a2", type: "speak", prompt: 'Say "Straight ahead" out loud', answer: "على طول" },
    ],
    aiTeacherPrompt:
      "You're Layla, a calm Arabic pronunciation coach. Stay on this directions lesson only — أين, يسار, يمين, على طول, and asking 'أين المحطة؟'. Say each slowly with its romanization and meaning, listen closely as they repeat, and celebrate every good attempt.",
  },

  // ============================================================== Hindi · U1
  {
    id: "hi-unit-1-lesson-1",
    unitId: "hi-unit-1",
    languageId: "hi",
    title: "First Greetings",
    type: "vocabulary",
    order: 1,
    xpReward: 10,
    goals: ["Say hello and thank you in Hindi", "Recognize basic greetings"],
    vocabulary: [
      { id: "hi-v-namaste", word: "नमस्ते", translation: "Hello", phonetic: "nuh-mus-TAY", example: "नमस्ते! आप कैसे हैं?" },
      { id: "hi-v-dhanyavaad", word: "धन्यवाद", translation: "Thank you", phonetic: "DHUN-yuh-vaad" },
      { id: "hi-v-alvida", word: "अलविदा", translation: "Goodbye", phonetic: "ul-vee-DAH" },
    ],
    phrases: [
      { id: "hi-p-aap-kaise-hain", text: "आप कैसे हैं?", translation: "How are you?", phonetic: "aap KAI-se hain" },
    ],
    activities: [
      {
        id: "hi-u1-l1-a1",
        type: "multipleChoice",
        prompt: 'Which word means "Thank you"?',
        options: [
          { id: "o1", text: "नमस्ते", correct: false },
          { id: "o2", text: "धन्यवाद", correct: true },
          { id: "o3", text: "अलविदा", correct: false },
        ],
      },
      {
        id: "hi-u1-l1-a2",
        type: "listen",
        prompt: 'Listen and choose the word for "Hello"',
        options: [
          { id: "o1", text: "नमस्ते", correct: true },
          { id: "o2", text: "अलविदा", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Priya, a gentle, warm Hindi teacher who makes beginners feel encouraged. Stay on this greetings lesson — नमस्ते, धन्यवाद, अलविदा. Say each slowly with its romanization and meaning, then listen as they repeat and offer calm, genuine encouragement.",
  },
  {
    id: "hi-unit-1-lesson-2",
    unitId: "hi-unit-1",
    languageId: "hi",
    title: "Introduce Yourself",
    type: "chat",
    order: 2,
    xpReward: 15,
    goals: ["Tell someone your name", "Ask for someone's name"],
    vocabulary: [
      { id: "hi-v-mera-naam", word: "मेरा नाम", translation: "My name (is)", phonetic: "MAY-ra naam", example: "मेरा नाम आना है।" },
      { id: "hi-v-suprabhat", word: "सुप्रभात", translation: "Good morning", phonetic: "su-pruh-BHAAT" },
    ],
    phrases: [
      { id: "hi-p-aapka-naam", text: "आपका नाम क्या है?", translation: "What is your name?", phonetic: "AAP-ka naam kya hai" },
    ],
    activities: [
      { id: "hi-u1-l2-a1", type: "translate", prompt: 'Say: "My name is Ana" (मेरा नाम … है)', answer: "मेरा नाम आना है" },
      {
        id: "hi-u1-l2-a2",
        type: "multipleChoice",
        prompt: 'What does "आपका नाम क्या है?" mean?',
        options: [
          { id: "o1", text: "How are you?", correct: false },
          { id: "o2", text: "What is your name?", correct: true },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Priya, a friendly Hindi tutor with a warm, patient manner. Stay on this lesson — introducing yourself with 'मेरा नाम ... है', 'सुप्रभात', and asking 'आपका नाम क्या है?'. Role-play a tiny introduction, listen to their reply, fix slips kindly, and invite them to try again.",
  },
  {
    id: "hi-unit-1-lesson-3",
    unitId: "hi-unit-1",
    languageId: "hi",
    title: "Daily Life",
    type: "vocabulary",
    order: 3,
    xpReward: 15,
    goals: ["Talk about everyday actions", "Use common verbs"],
    vocabulary: [
      { id: "hi-v-khana", word: "खाना", translation: "To eat", phonetic: "KHAH-naa", example: "मुझे खाना है।" },
      { id: "hi-v-peena", word: "पीना", translation: "To drink", phonetic: "PEE-naa" },
      { id: "hi-v-sona", word: "सोना", translation: "To sleep", phonetic: "SOH-naa" },
      { id: "hi-v-jana", word: "जाना", translation: "To go", phonetic: "JAH-naa" },
    ],
    phrases: [
      { id: "hi-p-mujhe-bhookh-lagi-hai", text: "मुझे भूख लगी है", translation: "I am hungry", phonetic: "MOO-jhe bhook lah-GEE hai" },
    ],
    activities: [
      {
        id: "hi-u1-l3-a1",
        type: "multipleChoice",
        prompt: 'Which word means "To eat"?',
        options: [
          { id: "o1", text: "पीना", correct: false },
          { id: "o2", text: "खाना", correct: true },
          { id: "o3", text: "जाना", correct: false },
        ],
      },
      { id: "hi-u1-l3-a2", type: "translate", prompt: 'Translate: "To drink"', answer: "पीना" },
    ],
    aiTeacherPrompt:
      "You're Priya, a gentle Hindi teacher who makes practice feel easy. Stay on this lesson's everyday verbs — खाना, पीना, सोना, जाना. Bring in one at a time slowly with its romanization and meaning, then have the learner say it back and warmly cheer each try.",
  },
  {
    id: "hi-unit-1-lesson-4",
    unitId: "hi-unit-1",
    languageId: "hi",
    title: "At the Café",
    type: "chat",
    order: 4,
    xpReward: 15,
    goals: ["Order a drink", "Ask for things politely"],
    vocabulary: [
      { id: "hi-v-coffee", word: "कॉफ़ी", translation: "Coffee", phonetic: "KAW-fee", example: "मुझे कॉफ़ी चाहिए।" },
      { id: "hi-v-paani", word: "पानी", translation: "Water", phonetic: "PAH-nee" },
      { id: "hi-v-chahiye", word: "चाहिए", translation: "I want / I need", phonetic: "CHAH-hi-ye" },
    ],
    phrases: [
      { id: "hi-p-mujhe-coffee-chahiye", text: "मुझे कॉफ़ी चाहिए।", translation: "I would like a coffee.", phonetic: "MOO-jhe KAW-fee CHAH-hi-ye" },
    ],
    activities: [
      { id: "hi-u1-l4-a1", type: "translate", prompt: 'Order: "I would like a coffee"', answer: "मुझे कॉफ़ी चाहिए" },
      {
        id: "hi-u1-l4-a2",
        type: "multipleChoice",
        prompt: 'What does "पानी" mean?',
        options: [
          { id: "o1", text: "Water", correct: true },
          { id: "o2", text: "Coffee", correct: false },
        ],
      },
    ],
    aiTeacherPrompt:
      "You're Priya, a friendly Hindi tutor playing a kind café server. Stay in this café scene only — कॉफ़ी, पानी, चाहिए, and ordering 'मुझे कॉफ़ी चाहिए।'. Offer one phrase at a time slowly with its meaning, listen to their order, gently fix it, and invite them to try again.",
  },
  {
    id: "hi-unit-1-lesson-5",
    unitId: "hi-unit-1",
    languageId: "hi",
    title: "Travel & Directions",
    type: "audio",
    order: 5,
    xpReward: 15,
    goals: ["Ask where something is", "Understand basic directions"],
    vocabulary: [
      { id: "hi-v-kahan", word: "कहाँ", translation: "Where", phonetic: "kah-HAAN" },
      { id: "hi-v-baayen", word: "बाएँ", translation: "Left", phonetic: "BAH-en" },
      { id: "hi-v-daayen", word: "दाएँ", translation: "Right", phonetic: "DAH-en" },
      { id: "hi-v-seedhe", word: "सीधे", translation: "Straight ahead", phonetic: "SEE-dhe" },
    ],
    phrases: [
      { id: "hi-p-station-kahan-hai", text: "स्टेशन कहाँ है?", translation: "Where is the station?", phonetic: "STAY-shun kah-HAAN hai" },
    ],
    activities: [
      {
        id: "hi-u1-l5-a1",
        type: "listen",
        prompt: 'Listen and choose: which means "Left"?',
        options: [
          { id: "o1", text: "बाएँ", correct: true },
          { id: "o2", text: "दाएँ", correct: false },
        ],
      },
      { id: "hi-u1-l5-a2", type: "speak", prompt: 'Say "Straight ahead" out loud', answer: "सीधे" },
    ],
    aiTeacherPrompt:
      "You're Priya, a calm Hindi pronunciation coach. Stay on this directions lesson only — कहाँ, बाएँ, दाएँ, सीधे, and asking 'स्टेशन कहाँ है?'. Say each slowly with its romanization and meaning, listen closely as they repeat, and celebrate every good attempt.",
  },
];

/** All lessons in a unit, sorted by their display order. */
export const getLessonsByUnit = (unitId: string): Lesson[] =>
  lessons
    .filter((lesson) => lesson.unitId === unitId)
    .sort((a, b) => a.order - b.order);

/** All lessons for a language. */
export const getLessonsByLanguage = (languageId: LanguageCode): Lesson[] =>
  lessons.filter((lesson) => lesson.languageId === languageId);

/** Find a single lesson by id. */
export const getLesson = (id: string): Lesson | undefined =>
  lessons.find((lesson) => lesson.id === id);

/**
 * Image to show for a lesson card/hero.
 *
 * Uses the lesson's own `image` when set, otherwise a stable Picsum
 * placeholder seeded by the lesson id (so the same lesson always gets the
 * same picture). Pass a `size` to control the square dimensions.
 */
export const getLessonImage = (lesson: Lesson, size: number = 240): string =>
  lesson.image ?? `https://picsum.photos/seed/${lesson.id}/${size}/${size}`;
