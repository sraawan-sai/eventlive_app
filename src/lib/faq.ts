import type { Lang } from "@/lib/i18n";

export interface FaqItem {
  q: Record<Lang, string>;
  a: Record<Lang, string>;
}

/**
 * Frequently asked questions in English, Telugu and Hindi.
 * Numbers (prices, limits) match src/lib/packages.ts, src/lib/plan-limits.ts and src/lib/media.ts. Update them together.
 */
export const FAQ: FaqItem[] = [
  {
    q: { en: "What is Eventra?", te: "Eventra అంటే ఏమిటి?", hi: "Eventra क्या है?" },
    a: {
      en: "Eventra lets you create a beautiful website for your wedding, birthday, pooja or any celebration in minutes. You share one link or QR code with your guests, and you can even go live from your phone so people who cannot come can watch.",
      te: "Eventra తో మీ పెళ్లి, పుట్టినరోజు, పూజ లేదా ఏదైనా వేడుక కోసం అందమైన వెబ్‌సైట్‌ను నిమిషాల్లో తయారు చేయవచ్చు. ఒక లింక్ లేదా QR కోడ్‌ను అతిథులతో పంచుకోండి. రాలేనివారు చూడటానికి మీ ఫోన్ నుండే లైవ్ కూడా చేయవచ్చు.",
      hi: "Eventra से आप अपनी शादी, जन्मदिन, पूजा या किसी भी उत्सव के लिए मिनटों में सुंदर वेबसाइट बना सकते हैं। एक लिंक या QR कोड मेहमानों के साथ साझा करें। जो लोग नहीं आ सकते, वे देख सकें इसलिए आप अपने फ़ोन से लाइव भी जा सकते हैं।",
    },
  },
  {
    q: {
      en: "Do my guests need an account or an app?",
      te: "అతిథులకు ఖాతా లేదా యాప్ కావాలా?",
      hi: "क्या मेहमानों को खाता या ऐप चाहिए?",
    },
    a: {
      en: "No. Guests open your link in their phone or computer browser and watch. They do not sign up and do not install anything.",
      te: "అవసరం లేదు. అతిథులు మీ లింక్‌ను ఫోన్ లేదా కంప్యూటర్ బ్రౌజర్‌లో తెరిచి చూడవచ్చు. సైన్ అప్ చేయాల్సిన పనిలేదు, ఏమీ ఇన్‌స్టాల్ చేయాల్సిన పనిలేదు.",
      hi: "नहीं। मेहमान आपका लिंक फ़ोन या कंप्यूटर के ब्राउज़र में खोलकर देख सकते हैं। न साइन अप करना है, न कुछ इंस्टॉल करना है।",
    },
  },
  {
    q: {
      en: "Is it really free to start?",
      te: "ప్రారంభించడం నిజంగా ఉచితమా?",
      hi: "क्या शुरू करना सच में मुफ़्त है?",
    },
    a: {
      en: "Yes. The Free package gives you the event website, share link, QR code, a live stream for up to 20 viewers for 1 hour, and 1 GB for photos and your invitation card. Paid packages add more viewers, more live time and more storage.",
      te: "అవును. ఉచిత ప్యాకేజీలో ఈవెంట్ వెబ్‌సైట్, షేర్ లింక్, QR కోడ్, 20 మంది వీక్షకులకు 1 గంట లైవ్ స్ట్రీమ్, ఫోటోలు మరియు ఆహ్వాన పత్రికకు 1 GB స్థలం లభిస్తాయి. చెల్లింపు ప్యాకేజీలలో ఎక్కువ వీక్షకులు, ఎక్కువ లైవ్ సమయం, ఎక్కువ స్థలం ఉంటాయి.",
      hi: "हाँ। मुफ़्त पैकेज में इवेंट वेबसाइट, शेयर लिंक, QR कोड, 20 दर्शकों के लिए 1 घंटे की लाइव स्ट्रीम, और फ़ोटो व निमंत्रण पत्र के लिए 1 GB जगह मिलती है। सशुल्क पैकेज में ज़्यादा दर्शक, ज़्यादा लाइव समय और ज़्यादा जगह मिलती है।",
    },
  },
  {
    q: {
      en: "How much do the paid packages cost?",
      te: "చెల్లింపు ప్యాకేజీల ధర ఎంత?",
      hi: "सशुल्क पैकेज की कीमत क्या है?",
    },
    a: {
      en: "Per event, before 18% GST: Starter ₹499, Basic ₹999, Pro ₹2,999 and Premium ₹7,999. For very large events such as festivals and temples, we send a quote. See the Pricing page for what each package includes.",
      te: "ఒక్కో ఈవెంట్‌కు, 18% GST కాకుండా: స్టార్టర్ ₹499, బేసిక్ ₹999, ప్రో ₹2,999, ప్రీమియం ₹7,999. ఉత్సవాలు, దేవాలయాల వంటి చాలా పెద్ద ఈవెంట్లకు మేము కోట్ పంపుతాము. ప్రతి ప్యాకేజీలో ఏముందో ధరల పేజీలో చూడండి.",
      hi: "प्रति इवेंट, 18% GST अलग: स्टार्टर ₹499, बेसिक ₹999, प्रो ₹2,999 और प्रीमियम ₹7,999। त्योहारों और मंदिरों जैसे बहुत बड़े आयोजनों के लिए हम कोटेशन भेजते हैं। हर पैकेज में क्या है, यह कीमतें पेज पर देखें।",
    },
  },
  {
    q: {
      en: "How do I pay, and when does my package start?",
      te: "ఎలా చెల్లించాలి, ప్యాకేజీ ఎప్పుడు మొదలవుతుంది?",
      hi: "भुगतान कैसे करें और पैकेज कब शुरू होगा?",
    },
    a: {
      en: "Choose a package on the Pricing page and message us on WhatsApp. We share the payment details, you pay by UPI, and once we confirm your payment we switch on the package on your account. There is no online card payment yet, so we do this by hand.",
      te: "ధరల పేజీలో ప్యాకేజీ ఎంచుకుని WhatsApp లో మాకు సందేశం పంపండి. మేము చెల్లింపు వివరాలు ఇస్తాము, మీరు UPI తో చెల్లించండి, మీ చెల్లింపు నిర్ధారణ అయ్యాక మేము మీ ఖాతాలో ప్యాకేజీని ఆన్ చేస్తాము. ఇంకా ఆన్‌లైన్ కార్డ్ చెల్లింపు లేదు, కాబట్టి ఇది మేము చేతితో చేస్తాము.",
      hi: "कीमतें पेज पर पैकेज चुनें और WhatsApp पर हमें संदेश भेजें। हम भुगतान की जानकारी देंगे, आप UPI से भुगतान करें, और भुगतान की पुष्टि होते ही हम आपके खाते में पैकेज चालू कर देंगे। अभी ऑनलाइन कार्ड भुगतान नहीं है, इसलिए यह हम हाथ से करते हैं।",
    },
  },
  {
    q: { en: "How do I go live?", te: "లైవ్‌లోకి ఎలా వెళ్లాలి?", hi: "लाइव कैसे जाएँ?" },
    a: {
      en: "In your dashboard, tap Go Live on your event, then press Start Live. Allow the camera and microphone when your browser asks. Guests watch on your event page. On a phone, open the secure (https) link so the camera works.",
      te: "డాష్‌బోర్డ్‌లో మీ ఈవెంట్‌పై Go Live నొక్కి, ఆపై Start Live నొక్కండి. బ్రౌజర్ అడిగినప్పుడు కెమెరా, మైక్రోఫోన్‌కు అనుమతి ఇవ్వండి. అతిథులు మీ ఈవెంట్ పేజీలో చూస్తారు. ఫోన్‌లో కెమెరా పనిచేయడానికి సురక్షితమైన (https) లింక్ వాడండి.",
      hi: "डैशबोर्ड में अपने इवेंट पर Go Live दबाएँ, फिर Start Live दबाएँ। ब्राउज़र पूछे तो कैमरा और माइक्रोफ़ोन की अनुमति दें। मेहमान आपके इवेंट पेज पर देखेंगे। फ़ोन पर कैमरा चलाने के लिए सुरक्षित (https) लिंक खोलें।",
    },
  },
  {
    q: {
      en: "What happens when my live time or viewer limit is used up?",
      te: "లైవ్ సమయం లేదా వీక్షకుల పరిమితి అయిపోతే ఏమవుతుంది?",
      hi: "लाइव समय या दर्शकों की सीमा पूरी हो जाए तो क्या होता है?",
    },
    a: {
      en: "Each package has a live-time limit for every event. When it is used up, the stream stops and you can upgrade to continue. If the number of viewers reaches your limit, new guests see a message asking them to try again in a few minutes.",
      te: "ప్రతి ప్యాకేజీలో ఒక్కో ఈవెంట్‌కు లైవ్ సమయ పరిమితి ఉంటుంది. అది అయిపోతే స్ట్రీమ్ ఆగుతుంది, కొనసాగించడానికి మీరు ప్యాకేజీని అప్‌గ్రేడ్ చేయవచ్చు. వీక్షకుల సంఖ్య పరిమితికి చేరితే, కొత్త అతిథులకు కొన్ని నిమిషాల తర్వాత మళ్లీ ప్రయత్నించమని సందేశం కనిపిస్తుంది.",
      hi: "हर पैकेज में प्रति इवेंट लाइव समय की सीमा होती है। वह पूरी होने पर स्ट्रीम रुक जाती है और आगे जारी रखने के लिए आप पैकेज अपग्रेड कर सकते हैं। दर्शकों की संख्या सीमा तक पहुँचने पर नए मेहमानों को कुछ मिनट बाद फिर कोशिश करने का संदेश दिखता है।",
    },
  },
  {
    q: {
      en: "What if my guests have slow internet?",
      te: "అతిథులకు ఇంటర్నెట్ నెమ్మదిగా ఉంటే?",
      hi: "अगर मेहमानों का इंटरनेट धीमा हो?",
    },
    a: {
      en: "The video quality adjusts by itself so the stream keeps playing, and guests can switch to audio only to save data.",
      te: "స్ట్రీమ్ ఆగకుండా ఉండేలా వీడియో నాణ్యత ఆటోమేటిక్‌గా సర్దుబాటు అవుతుంది. డేటా ఆదా కోసం అతిథులు 'ఆడియో మాత్రమే' కు మారవచ్చు.",
      hi: "स्ट्रीम चलती रहे, इसके लिए वीडियो की गुणवत्ता अपने आप ठीक हो जाती है। डेटा बचाने के लिए मेहमान 'केवल ऑडियो' पर जा सकते हैं।",
    },
  },
  {
    q: {
      en: "Is the live stream recorded?",
      te: "లైవ్ స్ట్రీమ్ రికార్డ్ అవుతుందా?",
      hi: "क्या लाइव स्ट्रीम रिकॉर्ड होती है?",
    },
    a: {
      en: "Not yet. Recording and replay are not available, so guests can watch only while you are live.",
      te: "ఇంకా లేదు. రికార్డింగ్, రీప్లే అందుబాటులో లేవు, కాబట్టి మీరు లైవ్‌లో ఉన్నప్పుడే అతిథులు చూడగలరు.",
      hi: "अभी नहीं। रिकॉर्डिंग और रीप्ले उपलब्ध नहीं हैं, इसलिए मेहमान तभी देख सकते हैं जब आप लाइव हों।",
    },
  },
  {
    q: {
      en: "Can I change my event after I publish it?",
      te: "ప్రచురించిన తర్వాత ఈవెంట్‌ను మార్చవచ్చా?",
      hi: "क्या प्रकाशित करने के बाद इवेंट बदल सकते हैं?",
    },
    a: {
      en: "Yes. You can edit the details, photos, schedule, template and your link at any time from the dashboard. Guests always see the latest version.",
      te: "అవును. డాష్‌బోర్డ్ నుండి వివరాలు, ఫోటోలు, షెడ్యూల్, టెంప్లేట్, లింక్ ఎప్పుడైనా మార్చవచ్చు. అతిథులకు ఎప్పుడూ తాజా వెర్షన్ కనిపిస్తుంది.",
      hi: "हाँ। डैशबोर्ड से विवरण, फ़ोटो, कार्यक्रम सूची, टेम्पलेट और लिंक कभी भी बदल सकते हैं। मेहमानों को हमेशा नया संस्करण दिखता है।",
    },
  },
  {
    q: {
      en: "Can the website show Telugu and Hindi?",
      te: "వెబ్‌సైట్ తెలుగు, హిందీలో కనిపిస్తుందా?",
      hi: "क्या वेबसाइट तेलुगु और हिंदी में दिख सकती है?",
    },
    a: {
      en: "Yes. Guests can switch between English, Telugu and Hindi. You can type your title, names and description in each language so guests see your own words.",
      te: "అవును. అతిథులు ఇంగ్లీష్, తెలుగు, హిందీ మధ్య మారవచ్చు. మీ శీర్షిక, పేర్లు, వివరణను ప్రతి భాషలో మీరే టైప్ చేయవచ్చు, అప్పుడు అతిథులు మీ స్వంత మాటలు చూస్తారు.",
      hi: "हाँ। मेहमान अंग्रेज़ी, तेलुगु और हिंदी के बीच बदल सकते हैं। आप अपना शीर्षक, नाम और विवरण हर भाषा में खुद लिख सकते हैं, ताकि मेहमान आपके अपने शब्द देखें।",
    },
  },
  {
    q: {
      en: "How many photos and videos can I add?",
      te: "ఎన్ని ఫోటోలు, వీడియోలు జోడించవచ్చు?",
      hi: "कितनी फ़ोटो और वीडियो जोड़ सकते हैं?",
    },
    a: {
      en: "Up to 30 photos (10 MB each), one invitation card, up to 3 videos (500 MB each) and one background music track. The storage limit of your package also applies.",
      te: "30 ఫోటోల వరకు (ఒక్కోటి 10 MB), ఒక ఆహ్వాన పత్రిక, 3 వీడియోల వరకు (ఒక్కోటి 500 MB), ఒక నేపథ్య సంగీతం. మీ ప్యాకేజీ స్థల పరిమితి కూడా వర్తిస్తుంది.",
      hi: "30 फ़ोटो तक (हर एक 10 MB), एक निमंत्रण पत्र, 3 वीडियो तक (हर एक 500 MB) और एक बैकग्राउंड संगीत। आपके पैकेज की जगह की सीमा भी लागू होती है।",
    },
  },
  {
    q: {
      en: "Can I delete my account and my data?",
      te: "నా ఖాతా, డేటాను తొలగించవచ్చా?",
      hi: "क्या मैं अपना खाता और डेटा हटा सकता हूँ?",
    },
    a: {
      en: "Yes. Open Profile & Settings and choose Delete account. Your events and uploaded files are removed permanently.",
      te: "అవును. ప్రొఫైల్ & సెట్టింగ్స్ తెరిచి ఖాతా తొలగించండి ఎంచుకోండి. మీ ఈవెంట్లు, అప్‌లోడ్ చేసిన ఫైళ్లు శాశ్వతంగా తొలగిపోతాయి.",
      hi: "हाँ। प्रोफ़ाइल और सेटिंग्स खोलकर खाता हटाएँ चुनें। आपके इवेंट और अपलोड की गई फ़ाइलें हमेशा के लिए हट जाती हैं।",
    },
  },
];
