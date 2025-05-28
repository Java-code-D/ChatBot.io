const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');
const languageSelect = document.getElementById('languageSelect');

let recognition;
let isListening = false;

// Simple FAQ answers (expand as needed)
const faq = {
  en: {
    "what is a browser": "A browser is like a window that lets you look at websites on the internet. Examples: Chrome, Firefox, Safari 🌐",
    "why is my wifi not working": "Try turning off your Wi-Fi and router for a minute, then turn them back on. It's like giving your Wi-Fi a little nap 😴",
    "hello": "Hello! How can I help you today? 😊",
    "how to set up an email account": "To set up an email, you need to go to an email provider like Gmail, choose a username, and create a password. Simple, right? 📧",
    "how do i change my profile picture": "Go to settings > Profile > Change Picture, and upload your favorite photo! It's like changing your avatar in a game! 🎮",
    "how can i reset my phone": "Go to settings > System > Reset options > Erase all data. But make sure you backup your stuff before! 🔄",
    "what is a download": "A download is like getting a package from the internet to your phone or computer. 📦",
    "what is a website": "A website is like a book that you can read online. It contains pages with different information. 📖",
    "how to send an email": "Just open your email app, click 'Compose', write your message, and hit 'Send'. It's like writing a letter but faster! ✉️",
    "what is a link": "A link is like a road that leads you from one place to another on the internet. 🌍",
    "how to check internet speed": "You can check your internet speed by visiting websites like Speedtest. It's like checking how fast your car is going! 🚗💨",
    "what is a password": "A password is like a secret code that keeps your online stuff safe, like a lock on a door. 🔐",
    "how can i make a video call": "Open WhatsApp or Skype, tap the video call button, and choose someone to call. It's like having a face-to-face chat! 🎥",
    "why is my phone slow": "Try closing unused apps and clearing storage. It's like cleaning your room to make space for new stuff! 🧹",
    "how can i update my apps": "Go to the app store, tap on 'Updates', and click 'Update All'. It's like giving your apps a makeover! 💅",
    "what is a browser cache": "Browser cache is like a storage box where your browser keeps old versions of websites to make them load faster. 📦",
    "how can i use whatsApp": "Open WhatsApp, tap on the chat icon, select a contact, and start typing. It's like texting your friend! 💬",
    "why isn’t my wi-fi working": "Check if your Wi-Fi is on, restart the router, or check if other devices are connecting. 🌐",
    "how can i change my username": "Go to your profile settings, tap 'Edit' and change your username. It’s like changing your nickname! 👤",
    "how do i log out of an account": "Go to settings > Account > Log Out. It's like closing the door behind you when you leave. 🚪",
  },
  hi: {
    "ब्राउज़र क्या है": "ब्राउज़र एक खिड़की की तरह होता है जिससे आप इंटरनेट पर वेबसाइट्स देख सकते हैं। जैसे: Chrome, Firefox, Safari 🌍",
    "मेरा वाईफाई काम क्यों नहीं कर रहा": "जांचें कि आपका वाईफाई चालू है, राउटर को रीस्टार्ट करें, या देखें कि दूसरे डिवाइस जुड़ रहे हैं या नहीं। 🔄",
    "नमस्ते": "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ? 😊",
    "ईमेल खाता कैसे सेट करें": "ईमेल बनाने के लिए, आपको Gmail जैसे सर्विस पर जाना होगा, एक यूज़रनेम और पासवर्ड बनाना होगा। आसान है न? 📧",
    "प्रोफाइल पिक्चर कैसे बदलें": "सेटिंग्स > प्रोफ़ाइल > तस्वीर बदलें, और अपनी पसंदीदा तस्वीर अपलोड करें! 📸",
    "फोन रिसेट कैसे करें": "सेटिंग्स > सिस्टम > रीसेट विकल्प > सभी डेटा हटाएं। लेकिन पहले बैकअप लेना न भूलें! 🔄",
    "डाउनलोड क्या है": "डाउनलोड एक पैकेज जैसा होता है जो इंटरनेट से आपके फोन या कंप्यूटर पर आता है। 📦",
    "वेबसाइट क्या है": "वेबसाइट एक किताब की तरह होती है जिसे आप ऑनलाइन पढ़ सकते हैं। 📚",
    "ईमेल कैसे भेजें": "बस अपने ईमेल ऐप को खोलें, 'कंपोज' पर क्लिक करें, संदेश लिखें और 'सेंड' दबाएं। ✉️",
    "लिंक क्या है": "लिंक एक रास्ता होता है जो आपको इंटरनेट पर एक स्थान से दूसरे स्थान पर ले जाता है। 🌍",
    "इंटरनेट स्पीड कैसे चेक करें": "आप Speedtest जैसी वेबसाइट पर जाकर अपनी इंटरनेट स्पीड चेक कर सकते हैं। 🚗💨",
    "पासवर्ड क्या है": "पासवर्ड एक गुप्त कोड की तरह होता है जो आपके ऑनलाइन डेटा को सुरक्षित रखता है, जैसे दरवाजे पर ताला। 🔒",
    "वीडियो कॉल कैसे करें": "WhatsApp या Skype खोलें, वीडियो कॉल बटन दबाएं और किसी को कॉल करें। 🎥",
    "मेरा फोन क्यों स्लो है": "आप बेमतलब के ऐप्स को बंद करके और स्टोरेज क्लियर करके इसे हल कर सकते हैं। 🧹",
    "एप्स कैसे अपडेट करें": "एप स्टोर पर जाएं, 'अपडेट्स' पर क्लिक करें और 'अपडेट ऑल' दबाएं। 📱",
    "ब्राउज़र कैश क्या है": "ब्राउज़र कैश वह जगह होती है जहाँ आपका ब्राउज़र वेबसाइट्स के पुराने संस्करणों को रखता है ताकि वे जल्दी लोड हो सकें। 🗂️",
    "व्हाट्सएप कैसे इस्तेमाल करेंं": "WhatsApp खोलें, चैट आइकन दबाएं, संपर्क का चयन करें और संदेश लिखें। 💬",
    "वाईफाई क्यों काम नहीं कर रहा": "जांचें कि आपका वाईफाई ऑन है, राउटर को रीस्टार्ट करें, या देखें कि अन्य डिवाइस कनेक्ट हो रहे हैं या नहीं। 🌐",
    "यूज़रनेम कैसे बदलें": "अपने प्रोफ़ाइल सेटिंग्स में जाएं, 'एडिट' पर क्लिक करें और अपना यूज़रनेम बदलें। 👤",
    "एकाउंट से लॉग आउट कैसे करें": "सेटिंग्स > अकाउंट > लॉग आउट पर जाएं। 🚪",
  },
  hinglish: {
    "ब्राउज़र क्या है": "Browser ek window ki tarah hota hai, jisme aap internet par websites dekh sakte ho. Jaise Chrome, Firefox, Safari 🌍, Using this will allow you to do jagat panchayti",
    "मेरा wifi काम क्यों नहीं कर रहा है": "Check karo ki aapka wifi on hai, router ko restart karo, ya dekho ki dusre devices connect ho rahe hain ya nahi. 🔄",
    "नमस्ते": "Hello! Main aapki kaise madad kar sakti hoon? 😊",
    "ईमेल खाता कैसे सेट करें": "Email setup karne ke liye, Gmail jaise provider par jao, ek username choose karo, aur password banao. Bas, ho gaya! 📧",
    "प्रोफ़ाइल पिक्चर कैसे बदलें": "Settings > Profile > Change Picture par jao, aur apni pasand ki photo upload karo! 📸",
    "फोन रिसेट कैसे करें": "Settings > System > Reset options > Erase all data. Par pehle apna data backup kar lo! 🔄",
    "डाउनलोड क्या है": "Download ek package hota hai jo internet se aapke phone ya computer pe aata hai. 📦",
    "वेबसाइट क्या है": "Website ek book ki tarah hoti hai, jisme alag-alag pages hote hain. 📚",
    "ईमेल कैसे भेजें": "Bas apne email app ko kholo, 'Compose' par click karo, message likho aur 'Send' dabao! ✉️",
    "लिंक क्या है": "Link ek rasta hota hai jo aapko internet par ek jagah se doosri jagah le jata hai. 🌍",
    "इंटरनेट स्पीड कैसे चेक करें": "Speedtest website par jao aur apni internet speed check karo! 🚗💨",
    "पासवर्ड क्या है": "Password ek secret code hota hai jo aapke online data ko safe rakhta hai. 🔐",
    "वीडियो कॉल कैसे करें": "WhatsApp ya Skype kholo, video call button dabao, aur kisi ko call karo! 🎥",
    "मेरा फोन क्यों स्लो है": "Be-reh apps band kar lo aur storage clear kar lo. Jaise apna kamra safai kar rahe ho! 🧹",
    "एप्स कैसे अपडेट करें": "App store me jao, 'Updates' par click karo, aur 'Update All' dabao! 📱",
    "ब्राउज़र कैश क्या है": "Browser cache ek storage box hota hai jahan aapka browser purani website versions rakhta hai taaki website jaldi load ho. 🗂️",
    "whatsApp कैसे use करें": "WhatsApp kholo, chat icon dabao, contact select karo aur message likho! 💬",
    "वाईफाई क्यों काम नहीं कर रहा": "Check karo ki aapka wifi on hai, router ko restart karo, ya dekho ki dusre devices connect ho rahe hain ya nahi. 🌐",
    "यूज़रनेम कैसे change करें": "Profile settings me jaa kar, 'Edit' pe click karo aur apna username change karo! 👤",
    "एकाउंट से log out कैसे करें": "Settings > Account > Log Out pe jao. 🚪",
  }
};

// Add message to chat
function addMessage(message, isUser = false) {
  const div = document.createElement('div');
  div.className = isUser ? 'user-message' : 'bot-message';
  div.textContent = message;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollTop + 100;
}

// Get answer from FAQ with exact string matching
function getAnswer(question, lang) {
  question = question.toLowerCase().trim(); // Normalize input

  // Check for an exact match first
  for (const key in faq[lang]) {
    if (question === key.toLowerCase().trim()) {
      return faq[lang][key];
    }
  }

  // If no exact match, fall back to the keyword matching
  for (const key in faq[lang]) {
    if (question.includes(key.toLowerCase().trim())) {
      return faq[lang][key];
    }
  }

  // If no match is found, return a default message
  return lang === 'en' ? "Sorry, I don't understand. Can you rephrase?" :
         lang === 'hi' ? "माफ़ कीजिए, मैं समझ नहीं पाया। कृपया दोबारा बताएं।" :
         "Sorry, samajh nahi aaya, Mere pass OpenAI ka subscription nahi hai, please baat samjho";
}

// Handle user input
function handleInput() {
  const text = userInput.value;
  if (!text) return;
  const lang = languageSelect.value;
  addMessage(text, true);
  userInput.value = '';
  const answer = getAnswer(text, lang);
  addMessage(answer);
  speak(answer, lang);
}

// Function to remove emojis from the text
function removeEmojis(text) {
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{1F004}-\u{1F0CF}\u{1F3C0}-\u{1F3FF}\u{1F004}-\u{1F0CF}\u{1F600}-\u{1F64F}]/gu, '');
}

// Speak the answer
function speak(text, lang) {
  // Remove emojis before speaking
  const cleanText = removeEmojis(text);

  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'en' ? 'en-US' : 'hi-IN';
    window.speechSynthesis.speak(utterance);
  }
}

// Initialize speech recognition
function initSpeechRecognition() {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = languageSelect.value === 'en' ? 'en-US' : 'hi-IN';
  recognition.interimResults = false;
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    handleInput();
  };
  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
  };
  recognition.onend = () => {
    isListening = false;
    micBtn.textContent = '🎤 Speak';
  };
}

// Toggle speech recognition
micBtn.addEventListener('click', () => {
  if (!isListening) {
    initSpeechRecognition();
    recognition.start();
    isListening = true;
    micBtn.textContent = 'Listening...';
  } else {
    recognition.stop();
    isListening = false;
    micBtn.textContent = '🎤 Speak';
  }
});

// Send on button click or Enter
sendBtn.addEventListener('click', handleInput);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleInput();
});

// Initial greeting
addMessage("Hello! How can I help you today?");
