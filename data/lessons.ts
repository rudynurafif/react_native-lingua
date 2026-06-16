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
      "You are Maria, a warm and patient Spanish teacher. In this lesson, drill the greetings Hola, Adiós, and Buenos días. Speak slowly, model the pronunciation, ask the learner to repeat each word, and give gentle encouragement. Keep replies short.",
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
      "You are Maria, a friendly Spanish tutor. Help the learner introduce themselves using 'Me llamo ...' and ask names with '¿Cómo te llamas?'. Role-play a short introduction, correct mistakes kindly, and keep the conversation simple and slow.",
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
      "You are Maria, a Spanish pronunciation coach for an audio lesson. Focus on polite words: Por favor, Gracias, De nada. Pronounce each clearly, ask the learner to repeat, and listen for the rolled sounds. Praise good attempts and keep instructions brief.",
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
      "You are Luc, a cheerful French teacher. Drill the greetings Bonjour, Au revoir, and Merci. Model the nasal sounds slowly, ask the learner to repeat, and offer light encouragement. Keep responses short and clear.",
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
      "You are Luc, a cheerful French teacher. Drill the everyday verbs Manger, Boire, Dormir, and Travailler. Model the pronunciation slowly, ask the learner to repeat, and keep replies short.",
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
      "You are Luc, a friendly French tutor role-playing a waiter at a café. Help the learner order with 'Je voudrais ...' and ask for 'l'addition'. Keep the conversation simple, slow, and encouraging.",
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
      "You are Luc, a French pronunciation coach for an audio lesson. Focus on directions: À gauche, À droite, Tout droit, and asking 'Où est...?'. Pronounce each clearly, ask the learner to repeat, and praise good attempts.",
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
      "You are Luc, a cheerful French teacher. Drill shopping words: Combien, Acheter, Le magasin, L'argent, and asking 'Combien ça coûte?'. Keep replies short and encouraging.",
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
      "You are Luc, a friendly French tutor. Help the learner talk about family and friends with La famille, Un ami, Ma mère, Mon père. Role-play a short introduction of family members and keep it simple and slow.",
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
      "You are Yuki, a gentle Japanese teacher. Teach the greetings こんにちは, ありがとう, and さようなら. Pronounce each syllable clearly, explain the romaji, ask the learner to repeat, and give calm encouragement. Keep replies very short.",
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
      "You are Yuki, a gentle Japanese teacher. Drill the everyday verbs 食べる, 飲む, 寝る, and 行く. Pronounce each clearly, explain the romaji, ask the learner to repeat, and keep replies very short.",
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
      "You are Yuki, a friendly Japanese tutor role-playing a café server. Help the learner order with '...をください'. Mind the polite tone, keep the conversation simple, slow, and encouraging.",
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
      "You are Yuki, a Japanese pronunciation coach for an audio lesson. Focus on directions: どこ, 右, 左, まっすぐ. Pronounce each clearly, ask the learner to repeat, and praise good attempts.",
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
      "You are Yuki, a gentle Japanese teacher. Drill shopping words: いくら, 買う, お店, お金, and asking 'いくらですか？'. Keep replies short and encouraging.",
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
      "You are Yuki, a friendly Japanese tutor. Help the learner talk about family and friends with 家族, 友達, 母, 父. Role-play a short introduction of family members and keep it simple and slow.",
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
      "You are Emma, a warm and patient English teacher. Drill the greetings Hello, Goodbye, and Good morning. Speak slowly, model the pronunciation, ask the learner to repeat each word, and give gentle encouragement. Keep replies short.",
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
      "You are Emma, a friendly English tutor. Help the learner introduce themselves with 'My name is ...' and ask names with 'What is your name?'. Role-play a short introduction, correct mistakes kindly, and keep it simple and slow.",
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
      "You are Lukas, a cheerful German teacher. Drill the greetings Hallo, Tschüss, Guten Morgen, and Danke. Model the sounds slowly, ask the learner to repeat, and offer light encouragement. Keep responses short and clear.",
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
      "You are Lukas, a friendly German tutor. Help the learner introduce themselves with 'Ich heiße ...' and ask names with 'Wie heißt du?'. Role-play a short introduction, correct mistakes kindly, and keep it simple and slow.",
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
      "You are Dewi, a warm Indonesian teacher. Drill the greetings Halo, Selamat pagi, Terima kasih, and Sampai jumpa. Speak slowly, model the pronunciation, ask the learner to repeat, and encourage them kindly. Keep replies short.",
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
      "You are Dewi, a friendly Indonesian tutor. Help the learner introduce themselves with 'Nama saya ...' and ask names with 'Siapa nama kamu?'. Role-play a short introduction, correct mistakes kindly, and keep it simple and slow.",
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
      "You are Mei, a gentle Mandarin teacher. Teach the greetings 你好, 谢谢, and 再见. Pronounce each syllable with the correct tone, explain the pinyin, ask the learner to repeat, and give calm encouragement. Keep replies very short.",
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
      "You are Mei, a friendly Mandarin tutor. Help the learner introduce themselves with '我叫 ...' and ask names with '你叫什么名字？'. Mind the tones, role-play a short introduction, correct mistakes kindly, and keep it simple and slow.",
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
      "You are Marco, a cheerful Italian teacher. Drill the greetings Ciao, Buongiorno, Grazie, and Arrivederci. Model the melodic sounds slowly, ask the learner to repeat, and offer light encouragement. Keep responses short and clear.",
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
      "You are Marco, a friendly Italian tutor. Help the learner introduce themselves with 'Mi chiamo ...' and ask names with 'Come ti chiami?'. Role-play a short introduction, correct mistakes kindly, and keep it simple and slow.",
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
      "You are Rafael, a warm Brazilian Portuguese teacher. Drill the greetings Olá, Bom dia, Obrigado, and Tchau. Speak slowly, model the pronunciation, ask the learner to repeat, and encourage them kindly. Keep replies short.",
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
      "You are Rafael, a friendly Brazilian Portuguese tutor. Help the learner introduce themselves with 'Meu nome é ...' and ask names with 'Qual é o seu nome?'. Role-play a short introduction, correct mistakes kindly, and keep it simple and slow.",
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
      "You are Jisoo, a gentle Korean teacher. Teach the greetings 안녕하세요, 감사합니다, and 안녕히 가세요. Pronounce each syllable clearly, explain the romanization, ask the learner to repeat, and give calm encouragement. Keep replies very short.",
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
      "You are Jisoo, a friendly Korean tutor. Help the learner introduce themselves with '제 이름은 ...입니다' and ask names with '이름이 뭐예요?'. Role-play a short introduction, correct mistakes kindly, and keep it simple and slow.",
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
      "You are Anna, a gentle Russian teacher. Teach the greetings Привет, Спасибо, and До свидания. Pronounce each syllable clearly, explain the romanization, ask the learner to repeat, and give calm encouragement. Keep replies very short.",
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
      "You are Anna, a friendly Russian tutor. Help the learner introduce themselves with 'Меня зовут ...' and ask names with 'Как тебя зовут?'. Role-play a short introduction, correct mistakes kindly, and keep it simple and slow.",
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
      "You are Layla, a gentle Arabic teacher. Teach the greetings مرحبا, شكرا, and مع السلامة. Pronounce each syllable clearly, explain the romanization, ask the learner to repeat, and give calm encouragement. Keep replies very short.",
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
      "You are Layla, a friendly Arabic tutor. Help the learner introduce themselves with 'اسمي ...' and ask names with 'ما اسمك؟'. Role-play a short introduction, correct mistakes kindly, and keep it simple and slow.",
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
      "You are Priya, a gentle Hindi teacher. Teach the greetings नमस्ते, धन्यवाद, and अलविदा. Pronounce each syllable clearly, explain the romanization, ask the learner to repeat, and give calm encouragement. Keep replies very short.",
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
      "You are Priya, a friendly Hindi tutor. Help the learner introduce themselves with 'मेरा नाम ... है' and ask names with 'आपका नाम क्या है?'. Role-play a short introduction, correct mistakes kindly, and keep it simple and slow.",
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
