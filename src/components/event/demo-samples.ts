import type { EventType } from "@/lib/event-types";
import type { EventFormValues } from "./event-fields";
import type { Translations } from "@/lib/translations";

type Sample = Pick<EventFormValues, "name" | "hostOne" | "hostTwo" | "description" | "startTime" | "endTime" | "venueName" | "venueAddress" | "template">;
type Words = { name: string; hostOne: string; hostTwo?: string; description: string };


const SAMPLES: Record<EventType, Sample> = {
  WEDDING: {
    hostOne: "Priya",
    hostTwo: "Rahul",
    name: "Rahul & Priya Wedding",
    description: "Join us as we celebrate our wedding with family and friends. Your blessings mean the world to us.",
    startTime: "18:00",
    endTime: "22:00",
    venueName: "Grand Palace Function Hall",
    venueAddress: "Banjara Hills, Hyderabad",
    template: "elegant",
  },
  BIRTHDAY: {
    hostOne: "Kushi",
    hostTwo: "",
    name: "Kushi's Birthday",
    description: "Come and celebrate Kushi's 5th birthday with cake, games and lots of fun!",
    startTime: "17:00",
    endTime: "20:00",
    venueName: "Sunrise Party Hall",
    venueAddress: "Madhapur, Hyderabad",
    template: "modern",
  },
  ANNIVERSARY: {
    hostOne: "Sunil",
    hostTwo: "Meena",
    name: "Sunil & Meena Anniversary",
    description: "25 years together. Join us for an evening of music, food and memories.",
    startTime: "19:00",
    endTime: "22:00",
    venueName: "Lakeview Banquet",
    venueAddress: "Jubilee Hills, Hyderabad",
    template: "classic",
  },
  RELIGIOUS: {
    hostOne: "Sharma Family",
    hostTwo: "",
    name: "Satyanarayana Swamy Pooja",
    description: "A pooja followed by prasadam lunch. All family and friends are welcome.",
    startTime: "10:00",
    endTime: "13:00",
    venueName: "Sri Venkateswara Temple Hall",
    venueAddress: "Kukatpally, Hyderabad",
    template: "classic",
  },
  CORPORATE: {
    hostOne: "Acme Technologies",
    hostTwo: "",
    name: "Annual Day 2026",
    description: "Our yearly get-together with awards, performances and dinner. Watch live if you cannot join us.",
    startTime: "17:00",
    endTime: "21:00",
    venueName: "Convention Centre",
    venueAddress: "HITEC City, Hyderabad",
    template: "minimal",
  },
  CONCERT: {
    hostOne: "The Midnight Band",
    hostTwo: "",
    name: "The Midnight Band Live",
    description: "An evening of live music. Stream the whole show from anywhere.",
    startTime: "19:30",
    endTime: "22:30",
    venueName: "Open Air Arena",
    venueAddress: "Gachibowli, Hyderabad",
    template: "modern",
  },
  GRADUATION: {
    hostOne: "Ananya",
    hostTwo: "",
    name: "Ananya's Graduation",
    description: "Celebrating Ananya's graduation. Thank you for being part of this milestone.",
    startTime: "11:00",
    endTime: "14:00",
    venueName: "University Auditorium",
    venueAddress: "Secunderabad",
    template: "elegant",
  },
  OTHER: {
    hostOne: "The Reddy Family",
    hostTwo: "",
    name: "Housewarming Ceremony",
    description: "Please join us as we step into our new home.",
    startTime: "09:00",
    endTime: "12:00",
    venueName: "Our New Home",
    venueAddress: "Kondapur, Hyderabad",
    template: "minimal",
  },
};

/** Telugu and Hindi versions of the sample text, so the preview changes when a visitor picks a language. */
const WORDS: Record<EventType, { te: Words; hi: Words }> = {
  WEDDING: {
    te: { hostOne: "ప్రియ", hostTwo: "రాహుల్", name: "రాహుల్ & ప్రియ వివాహం", description: "మా వివాహ వేడుకలో కుటుంబం, స్నేహితులతో కలిసి పాల్గొనండి. మీ ఆశీస్సులు మాకు ఎంతో విలువైనవి." },
    hi: { hostOne: "प्रिया", hostTwo: "राहुल", name: "राहुल और प्रिया का विवाह", description: "हमारे विवाह समारोह में परिवार और दोस्तों के साथ शामिल हों। आपका आशीर्वाद हमारे लिए बहुत अनमोल है।" },
  },
  BIRTHDAY: {
    te: { hostOne: "ఖుషి", name: "ఖుషి పుట్టినరోజు", description: "కేక్, ఆటలు, సరదాలతో ఖుషి 5వ పుట్టినరోజు వేడుకకు రండి!" },
    hi: { hostOne: "खुशी", name: "खुशी का जन्मदिन", description: "केक, खेल और ढेर सारी मस्ती के साथ खुशी के 5वें जन्मदिन में आइए!" },
  },
  ANNIVERSARY: {
    te: { hostOne: "సునీల్", hostTwo: "మీనా", name: "సునీల్ & మీనా వార్షికోత్సవం", description: "25 ఏళ్ల కలయిక. సంగీతం, భోజనం, జ్ఞాపకాల సాయంత్రానికి రండి." },
    hi: { hostOne: "सुनील", hostTwo: "मीना", name: "सुनील और मीना की वर्षगाँठ", description: "साथ के 25 साल। संगीत, भोजन और यादों भरी शाम के लिए आइए।" },
  },
  RELIGIOUS: {
    te: { hostOne: "శర్మ కుటుంబం", name: "సత్యనారాయణ స్వామి పూజ", description: "పూజ తర్వాత ప్రసాద భోజనం. కుటుంబం, స్నేహితులందరికీ స్వాగతం." },
    hi: { hostOne: "शर्मा परिवार", name: "सत्यनारायण स्वामी पूजा", description: "पूजा के बाद प्रसाद भोजन। सभी परिवार और मित्रों का स्वागत है।" },
  },
  CORPORATE: {
    te: { hostOne: "ఏక్మీ టెక్నాలజీస్", name: "వార్షికోత్సవం 2026", description: "అవార్డులు, ప్రదర్శనలు, విందుతో మా వార్షిక కలయిక. రాలేకపోతే లైవ్‌లో చూడండి." },
    hi: { hostOne: "एक्मी टेक्नोलॉजीज़", name: "वार्षिक दिवस 2026", description: "पुरस्कार, प्रस्तुतियों और रात्रिभोज के साथ हमारा वार्षिक समारोह। न आ सकें तो लाइव देखें।" },
  },
  CONCERT: {
    te: { hostOne: "ది మిడ్‌నైట్ బ్యాండ్", name: "ది మిడ్‌నైట్ బ్యాండ్ లైవ్", description: "లైవ్ సంగీత సాయంత్రం. మొత్తం షోను ఎక్కడినుండైనా చూడండి." },
    hi: { hostOne: "द मिडनाइट बैंड", name: "द मिडनाइट बैंड लाइव", description: "लाइव संगीत की एक शाम। पूरा शो कहीं से भी देखें।" },
  },
  GRADUATION: {
    te: { hostOne: "అనన్య", name: "అనన్య గ్రాడ్యుయేషన్", description: "అనన్య గ్రాడ్యుయేషన్ వేడుక. ఈ మైలురాయిలో భాగమైనందుకు ధన్యవాదాలు." },
    hi: { hostOne: "अनन्या", name: "अनन्या का दीक्षांत समारोह", description: "अनन्या के दीक्षांत समारोह का उत्सव। इस पड़ाव का हिस्सा बनने के लिए धन्यवाद।" },
  },
  OTHER: {
    te: { hostOne: "రెడ్డి కుటుంబం", name: "గృహప్రవేశం", description: "మా కొత్త ఇంట్లోకి అడుగుపెడుతున్న సందర్భంగా దయచేసి రండి." },
    hi: { hostOne: "रेड्डी परिवार", name: "गृह प्रवेश समारोह", description: "हमारे नए घर में प्रवेश के अवसर पर कृपया पधारें।" },
  },
};

const fill = (w: Words): Translations["te"] => ({ name: w.name, description: w.description, hostOne: w.hostOne, hostTwo: w.hostTwo ?? "" });

/** Sample answers for the demo, with the event date a month from today and Telugu/Hindi text filled in. */
export function demoSample(type: EventType): Partial<EventFormValues> {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return {
    ...SAMPLES[type],
    eventDate: d.toISOString().slice(0, 10),
    translations: { te: fill(WORDS[type].te), hi: fill(WORDS[type].hi) },
  };
}
