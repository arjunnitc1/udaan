import type { Kit } from "@/lib/types";

/** Sunita's scripted conversation — your stage insurance and test fixture. */
export const DEMO_SCRIPT: { who: "coach" | "user"; en: string; hi: string }[] = [
  { who: "coach", en: "Namaste! I'm Udaan — your business coach. Tell me, what are you good at? 🪁", hi: "नमस्ते! मैं उड़ान हूँ — आपकी बिज़नेस कोच। बताइए, आप क्या अच्छा करती हैं? 🪁" },
  { who: "user", en: "I make very good food… everyone in the colony praises my achar. But I have never earned anything.", hi: "मैं बहुत अच्छा खाना बनाती हूँ… कॉलोनी में सब मेरे अचार की तारीफ़ करते हैं। पर मैंने कभी कुछ कमाया नहीं।" },
  { who: "coach", en: "Twenty years of practice is not \u201cnothing\u201d — it's training. Which dishes do people ask for again and again?", hi: "बीस साल का अभ्यास \u201cकुछ नहीं\u201d नहीं होता — वो ट्रेनिंग है। लोग बार-बार कौन सी चीज़ें माँगते हैं?" },
  { who: "user", en: "My aam ka achar, and my dal-roti… my neighbour says I should sell tiffins but I don't know how to start or what to charge.", hi: "मेरा आम का अचार, और दाल-रोटी… पड़ोसन कहती है टिफ़िन बेचो, पर मुझे पता नहीं कैसे शुरू करूँ, क्या दाम रखूँ।" },
  { who: "coach", en: "That's exactly what I'm here for. Last question: how much time can you give, and is there an office area or school near your home?", hi: "इसीलिए तो मैं हूँ। आख़िरी सवाल: आप कितना समय दे सकती हैं, और घर के पास कोई ऑफ़िस या स्कूल है?" },
  { who: "user", en: "2 to 3 hours in the afternoon. Yes, there is an office complex 10 minutes away.", hi: "दोपहर में 2-3 घंटे। हाँ, 10 मिनट की दूरी पर एक ऑफ़िस कॉम्प्लेक्स है।" },
];

export const DEMO_KIT: Kit = {
  type: "kit",
  intro_en: "Sunita ji, your kit is ready — twenty years of skill, finally priced. 🎉",
  intro_hi: "सुनीता जी, आपकी किट तैयार है — बीस साल का हुनर, आखिरकार उसका दाम। 🎉",
  businesses: [
    { name_en: "Office tiffin service", name_hi: "ऑफ़िस टिफ़िन सेवा", range: "₹6,000–12,000/month", why_en: "Daily repeat income. Offices near your colony need home food — start with 5 tiffins a day.", why_hi: "रोज़ की पक्की कमाई। आपकी कॉलोनी के पास के दफ़्तरों को घर का खाना चाहिए — दिन में 5 टिफ़िन से शुरू करें।" },
    { name_en: "Festival achar & sweets orders", name_hi: "त्योहारों पर अचार-मिठाई के ऑर्डर", range: "₹3,000–8,000/festival season", why_en: "Your achar is already famous in the colony. Festivals = high demand, premium prices.", why_hi: "आपका अचार कॉलोनी में पहले से मशहूर है। त्योहार = ज़्यादा माँग, अच्छे दाम।" },
    { name_en: "Weekend cooking classes for working women", name_hi: "कामकाजी महिलाओं के लिए वीकेंड कुकिंग क्लास", range: "₹2,000–4,000/month", why_en: "2 hours on Sunday, 4 students at ₹250 each. Your knowledge is the product.", why_hi: "रविवार को 2 घंटे, ₹250 के हिसाब से 4 छात्राएँ। आपका ज्ञान ही प्रोडक्ट है।" },
  ],
  pricing: {
    items: [
      { item_en: "Veg tiffin (roti, sabzi, dal, rice)", item_hi: "वेज टिफ़िन (रोटी, सब्ज़ी, दाल, चावल)", price: "₹80" },
      { item_en: "Achar (500g jar)", item_hi: "अचार (500 ग्राम)", price: "₹180" },
      { item_en: "Cooking class (per person, 2 hrs)", item_hi: "कुकिंग क्लास (प्रति व्यक्ति, 2 घंटे)", price: "₹250" },
    ],
    script_en: "My price is ₹80 per tiffin. It covers fresh ingredients and my work — the same care I've put into my kitchen for twenty years.",
    script_hi: "मेरा दाम ₹80 प्रति टिफ़िन है। इसमें ताज़ा सामान और मेरी मेहनत शामिल है — वही बीस साल वाला स्वाद और सफ़ाई।",
  },
  whatsapp_hi: "🙏 नमस्ते! मैं सुनीता — अब आपके लिए घर का ताज़ा खाना बना रही हूँ 🍱\nवेज टिफ़िन ₹80 (रोटी, सब्ज़ी, दाल, चावल)\nमशहूर घर का अचार ₹180 (500g)\nऑर्डर के लिए इसी नंबर पर मैसेज करें। पहले 10 ऑर्डर पर अचार का फ्री सैंपल! ✨",
  whatsapp_en: "🙏 Namaste! I'm Sunita — now cooking fresh home food for you 🍱\nVeg tiffin ₹80 (roti, sabzi, dal, rice)\nFamous homemade achar ₹180 (500g)\nMessage this number to order. Free achar sample with the first 10 orders! ✨",
  schemes: [
    { name: "Udyam Registration", what_en: "Free government MSME registration — makes your business official in 15 minutes, opens the door to loans.", what_hi: "मुफ़्त सरकारी MSME रजिस्ट्रेशन — 15 मिनट में आपका बिज़नेस आधिकारिक, लोन का रास्ता खुलता है।", step_en: "Visit udyamregistration.gov.in with your Aadhaar", step_hi: "अपने आधार के साथ udyamregistration.gov.in पर जाएँ" },
    { name: "PM Mudra Loan (Shishu)", what_en: "Collateral-free bank loan up to ₹50,000 to start — for a bigger stove, steel tiffins, jars.", what_hi: "बिना गारंटी ₹50,000 तक का बैंक लोन — बड़ा चूल्हा, स्टील टिफ़िन, जार के लिए।", step_en: "Ask for the Mudra desk at any nearby bank branch", step_hi: "नज़दीकी बैंक शाखा में मुद्रा डेस्क के बारे में पूछें" },
    { name: "SHG / NRLM linkage", what_en: "Join your local self-help group — group savings, easy credit, and didis who already sell.", what_hi: "अपने इलाक़े के स्वयं सहायता समूह से जुड़ें — बचत, आसान कर्ज़, और बेचने वाली दीदियों का साथ।", step_en: "Ask your anganwadi or ASHA worker for the nearest SHG", step_hi: "नज़दीकी SHG के लिए आँगनवाड़ी या आशा दीदी से पूछें" },
  ],
  projection: {
    monthly: "₹9,500",
    year: "₹1,14,000",
    assumption_en: "5 tiffins a day × 22 days at ₹80, plus ~₹600/week from achar — a conservative start.",
    assumption_hi: "रोज़ 5 टिफ़िन × 22 दिन × ₹80, और अचार से करीब ₹600/हफ़्ता — एक सादा शुरुआत।",
    savings_en: "Open a zero-balance Jan Dhan account this week. Put ₹2,000 aside every month — in a year that's ₹24,000 that is only yours.",
    savings_hi: "इसी हफ़्ते ज़ीरो-बैलेंस जन धन खाता खोलें। हर महीने ₹2,000 अलग रखें — साल में ₹24,000, जो सिर्फ़ आपके हैं।",
  },
  action_en: "Send your WhatsApp message to 10 neighbours and your colony group today. Your first order is within 500 metres of your kitchen.",
  action_hi: "आज ही अपना WhatsApp संदेश 10 पड़ोसियों और कॉलोनी ग्रुप में भेजिए। आपका पहला ऑर्डर आपकी रसोई से 500 मीटर के अंदर है।",
  instagram: {
    bio_en: "🍱 Sunita's Ghar Ka Khana | Fresh home-cooked tiffins & famous achar | Lucknow | Order on WhatsApp 📲",
    bio_hi: "🍱 सुनीता का घर का खाना | ताज़ा टिफ़िन और मशहूर अचार | लखनऊ | WhatsApp पर ऑर्डर करें 📲",
    content_ideas_en: [
      "Post a short video of you packing a tiffin — people love seeing the care that goes in",
      "Share a photo of your achar jars lined up with price tags — makes it real and buyable",
      "Post a 'Day in my kitchen' reel showing morning prep — builds trust with customers",
    ],
    hashtags: ["#GharKaKhana", "#TiffinService", "#LucknowFood", "#HomemadeAchar", "#WomenEntrepreneur"],
  },
  vendors: [
    {
      category_en: "Spices & Dry Ingredients",
      category_hi: "मसाले और सूखा सामान",
      online: [
        { name: "IndiaMART", url: "indiamart.com", what_for: "Bulk spices and pickling ingredients at wholesale prices" },
        { name: "JioMart Business", url: "jiomart.com", what_for: "Monthly grocery subscription at discounted rates" },
      ],
      local_tip_en: "Ask your local kirana about bulk rates — most give 10–15% off for monthly orders.",
      local_tip_hi: "अपने किराना वाले से बल्क रेट पूछें — महीने के ऑर्डर पर 10–15% छूट मिलती है।",
    },
    {
      category_en: "Tiffin Containers & Packaging",
      category_hi: "टिफ़िन और पैकेजिंग",
      online: [
        { name: "Amazon Business", url: "amazon.in/business", what_for: "Stainless steel tiffins, leak-proof containers in bulk" },
        { name: "Flipkart Wholesale", url: "flipkart.com", what_for: "Kraft paper bags, eco-friendly packaging with your name printed" },
      ],
      local_tip_en: "Sadar Bazaar in your city has the cheapest packaging wholesale.",
      local_tip_hi: "आपके शहर के सदर बाज़ार में सबसे सस्ती पैकेजिंग मिलती है।",
    },
  ],
  business_management: {
    inventory_tip_en: "Keep a simple notebook with two columns: 'ingredients bought' and 'tiffins made'. Check it every Sunday to avoid wastage and plan your week's shopping.",
    inventory_tip_hi: "एक छोटी नोटबुक में दो कॉलम रखें: 'सामान खरीदा' और 'टिफ़िन बने'। हर रविवार देखें।",
    finance_tip_en: "Open a separate bank account just for your business. Every payment you receive goes there first. It shows you (and the bank) that this is a real business.",
    finance_tip_hi: "बिज़नेस के लिए अलग बैंक अकाउंट खोलें। हर पेमेंट वहाँ जाए। यह आपको और बैंक को दिखाता है कि यह असली बिज़नेस है।",
    first_week_en: "Day 1–2: Make 5 tiffins for neighbours for free and ask for honest feedback. Day 3–4: Take your first 5 paid orders from your building/colony. Day 5–7: Post on WhatsApp status every day.",
    first_week_hi: "दिन 1–2: पड़ोसियों को 5 फ्री टिफ़िन दें और सच्ची राय लें। दिन 3–4: बिल्डिंग/कॉलोनी से 5 पेड ऑर्डर लें। दिन 5–7: हर दिन WhatsApp status डालें।",
  },
  motivation_message_en: "Sunita, 20 years in your kitchen wasn't just cooking — it was building mastery. Today that mastery becomes your income. Your colony doesn't know it yet, but their favourite tiffin didi is about to become their favourite entrepreneur.",
  motivation_message_hi: "सुनीता जी, रसोई में 20 साल सिर्फ़ खाना बनाना नहीं था — यह महारत बनाना था। आज वह महारत आपकी कमाई बनती है। आपकी कॉलोनी को अभी पता नहीं, लेकिन उनकी पसंदीदा टिफ़िन दीदी जल्द उनकी पसंदीदा उद्यमी बनने वाली हैं।",
};
