export interface Quote {
  text: string;
  author: string;
}

export const EVENT_QUOTES: Quote[] = [
  {
    text: "उठो, जागो और तब तक मत रुको जब तक लक्ष्य प्राप्त न हो जाए।",
    author: "स्वामी विवेकानंद"
  },
  {
    text: "व्यक्तिगत चरित्र ही वह नींव है जिस पर राष्ट्रीय महानता का निर्माण होता है।",
    author: "डॉ. के. बी. हेडगेवार"
  },
  {
    text: "हमारा लक्ष्य एक अनुशासित, स्वाभिमानी और एकजुट राष्ट्र का निर्माण करना है।",
    author: "डॉ. के. बी. हेडगेवार"
  },
  {
    text: "राष्ट्र एक साझा विरासत से जुड़ी एक जीवंत सांस्कृतिक इकाई है।",
    author: "श्री गुरुजी"
  },
  {
    text: "समाज की सेवा मानवता में प्रकट ईश्वर की सेवा है।",
    author: "श्री गुरुजी"
  },
  {
    text: "संस्कृति एक राष्ट्र की आत्मा और जीवन-सांस है।",
    author: "पं. दीनदयाल उपाध्याय"
  },
  {
    text: "स्वराज मेरा जन्मसिद्ध अधिकार है और मैं इसे लेकर रहूँगा।",
    author: "लोकमान्य तिलक"
  },
  {
    text: "सनातन धर्म ही हमारे लिए राष्ट्रवाद है।",
    author: "महर्षि अरविन्द"
  },
  {
    text: "सच्ची देशभक्ति की शुरुआत दैनिक अनुशासन और निस्वार्थ सेवा से होती है।",
    author: "डॉ. के. बी. हेडगेवार"
  },
  {
    text: "संस्कृति वह चिरस्थायी सूत्र है जो पीढ़ियों को एक राष्ट्र में बांधता है।",
    author: "श्री गुरुजी"
  },
  {
    text: "संगठित एकता में ही समाज की अजेय शक्ति निहित है।",
    author: "डॉ. के. बी. हेडगेवार"
  },
  {
    text: "पहला भारतीय, अंतिम भारतीय, हमेशा भारतीय।",
    author: "वीर सावरकर"
  }
];

export function getQuoteForTicket(ticketId?: string): Quote {
  if (!ticketId) {
    const randomIndex = Math.floor(Math.random() * EVENT_QUOTES.length);
    return EVENT_QUOTES[randomIndex];
  }
  let hash = 0;
  for (let i = 0; i < ticketId.length; i++) {
    hash = (hash << 5) - hash + ticketId.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % EVENT_QUOTES.length;
  return EVENT_QUOTES[index];
}
