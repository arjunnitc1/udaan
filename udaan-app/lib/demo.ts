import type { Kit } from "@/lib/types";

export type DemoScenario = {
  id: string;
  name_en: string;
  name_hi: string;
  emoji: string;
  script: { who: "coach" | "user"; en: string; hi: string }[];
  kit: Kit;
};

/** Sunita's tiffin business demo */
const SUNITA_SCRIPT: { who: "coach" | "user"; en: string; hi: string }[] = [
  { who: "coach", en: "Namaste! I'm Udaan — your business coach. Tell me, what are you good at? 🪁", hi: "नमस्ते! मैं उड़ान हूँ — आपकी बिज़नेस कोच। बताइए, आप क्या अच्छा करती हैं? 🪁" },
  { who: "user", en: "I make very good food… everyone in the colony praises my achar. But I have never earned anything.", hi: "मैं बहुत अच्छा खाना बनाती हूँ… कॉलोनी में सब मेरे अचार की तारीफ़ करते हैं। पर मैंने कभी कुछ कमाया नहीं।" },
  { who: "coach", en: "Twenty years of practice is not 'nothing' — it's training. Which dishes do people ask for again and again?", hi: "बीस साल का अभ्यास 'कुछ नहीं' नहीं होता — वो ट्रेनिंग है। लोग बार-बार कौन सी चीज़ें माँगते हैं?" },
  { who: "user", en: "My aam ka achar, and my dal-roti… my neighbour says I should sell tiffins but I don't know how to start or what to charge.", hi: "मेरा आम का अचार, और दाल-रोटी… पड़ोसन कहती है टिफ़िन बेचो, पर मुझे पता नहीं कैसे शुरू करूँ, क्या दाम रखूँ।" },
  { who: "coach", en: "That's exactly what I'm here for. Last question: how much time can you give, and is there an office area or school near your home?", hi: "इसीलिए तो मैं हूँ। आख़िरी सवाल: आप कितना समय दे सकती हैं, और घर के पास कोई ऑफ़िस या स्कूल है?" },
  { who: "user", en: "2 to 3 hours in the afternoon. Yes, there is an office complex 10 minutes away.", hi: "दोपहर में 2-3 घंटे। हाँ, 10 मिनट की दूरी पर एक ऑफ़िस कॉम्प्लेक्स है।" },
];

const SUNITA_KIT: Kit = {
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

/** Priya's tailoring business demo */
const PRIYA_SCRIPT: { who: "coach" | "user"; en: string; hi: string }[] = [
  { who: "coach", en: "Namaste! I'm Udaan — your business coach. Tell me, what are you good at? 🪁", hi: "नमस्ते! मैं उड़ान हूँ — आपकी बिज़नेस कोच। बताइए, आप क्या अच्छा करती हैं? 🪁" },
  { who: "user", en: "I know how to stitch clothes. I learned from my mother. I make blouses and do alterations for family, but never for money.", hi: "मुझे कपड़े सिलना आता है। माँ से सीखा था। ब्लाउज़ बनाती हूँ, परिवार के लिए अल्टरेशन करती हूँ, पर पैसों के लिए कभी नहीं किया।" },
  { who: "coach", en: "Stitching from childhood means your hands already know the work. What do people ask you to make most often?", hi: "बचपन से सिलाई मतलब आपके हाथों को काम पहले से आता है। लोग आपसे सबसे ज़्यादा क्या बनवाते हैं?" },
  { who: "user", en: "Blouses mostly, and sometimes petticoats. My sister-in-law says my fitting is better than the tailor in the market.", hi: "ज़्यादातर ब्लाउज़, और कभी-कभी पेटीकोट। भाभी कहती हैं मेरी फिटिंग बाज़ार के दर्ज़ी से अच्छी है।" },
  { who: "coach", en: "Better fitting than the market tailor — that's your competitive advantage! How much time can you give daily, and do you have a sewing machine?", hi: "बाज़ार के दर्ज़ी से बेहतर फिटिंग — यही आपकी ख़ासियत है! रोज़ कितना समय दे सकती हैं, और क्या सिलाई मशीन है?" },
  { who: "user", en: "I have my mother's old machine, it still works well. I can give 3-4 hours after the children go to school.", hi: "माँ की पुरानी मशीन है, अभी भी अच्छी चलती है। बच्चों के स्कूल जाने के बाद 3-4 घंटे दे सकती हूँ।" },
];

const PRIYA_KIT: Kit = {
  type: "kit",
  intro_en: "Priya ji, your kit is ready — those skilled hands are about to earn what they deserve. 🎉",
  intro_hi: "प्रिया जी, आपकी किट तैयार है — वो हुनरमंद हाथ अब अपनी सही कमाई करेंगे। 🎉",
  businesses: [
    { name_en: "Blouse stitching service", name_hi: "ब्लाउज़ सिलाई सेवा", range: "₹8,000–15,000/month", why_en: "Every saree needs a blouse. Women want perfect fitting — that's your specialty. Start with your colony aunties.", why_hi: "हर साड़ी को ब्लाउज़ चाहिए। महिलाओं को परफ़ेक्ट फिटिंग चाहिए — यही आपकी ख़ासियत है। कॉलोनी की आंटियों से शुरू करें।" },
    { name_en: "Alteration & repair service", name_hi: "अल्टरेशन और मरम्मत सेवा", range: "₹3,000–6,000/month", why_en: "Quick money, low effort. People always need clothes adjusted — waist tightening, length changes, zip repairs.", why_hi: "जल्दी पैसा, कम मेहनत। लोगों को हमेशा कपड़े ठीक करवाने होते हैं — कमर टाइट, लंबाई बदलना, ज़िप बदलना।" },
    { name_en: "Festival & wedding season orders", name_hi: "त्योहार और शादी के ऑर्डर", range: "₹5,000–12,000/season", why_en: "Diwali, weddings, Karva Chauth — women need new blouses fast. Premium prices for rush orders.", why_hi: "दिवाली, शादी, करवा चौथ — महिलाओं को जल्दी नए ब्लाउज़ चाहिए। जल्दी के ऑर्डर पर अच्छे दाम।" },
  ],
  pricing: {
    items: [
      { item_en: "Simple blouse (cotton)", item_hi: "सादा ब्लाउज़ (कॉटन)", price: "₹250" },
      { item_en: "Designer blouse (with work)", item_hi: "डिज़ाइनर ब्लाउज़ (वर्क वाला)", price: "₹450–800" },
      { item_en: "Petticoat", item_hi: "पेटीकोट", price: "₹180" },
      { item_en: "Basic alteration", item_hi: "सादा अल्टरेशन", price: "₹80–150" },
    ],
    script_en: "My blouse stitching starts at ₹250. You'll get perfect fitting because I take proper measurements and do a trial. No guesswork.",
    script_hi: "मेरी ब्लाउज़ सिलाई ₹250 से शुरू है। आपको परफ़ेक्ट फिटिंग मिलेगी क्योंकि मैं सही नाप लेती हूँ और ट्रायल करवाती हूँ।",
  },
  whatsapp_hi: "🧵 नमस्ते! मैं प्रिया — अब ब्लाउज़ और सिलाई का काम करती हूँ\n👚 ब्लाउज़ ₹250 से (परफ़ेक्ट फिटिंग गारंटी)\n✂️ अल्टरेशन ₹80 से\n📍 घर से पिकअप और डिलीवरी\nऑर्डर के लिए मैसेज करें! 🙏",
  whatsapp_en: "🧵 Namaste! I'm Priya — now doing blouse stitching and tailoring\n👚 Blouse from ₹250 (perfect fitting guaranteed)\n✂️ Alterations from ₹80\n📍 Home pickup and delivery\nMessage to order! 🙏",
  schemes: [
    { name: "Udyam Registration", what_en: "Free government MSME registration — makes your tailoring business official.", what_hi: "मुफ़्त सरकारी MSME रजिस्ट्रेशन — आपका सिलाई बिज़नेस आधिकारिक बनता है।", step_en: "Visit udyamregistration.gov.in with your Aadhaar", step_hi: "अपने आधार के साथ udyamregistration.gov.in पर जाएँ" },
    { name: "PM Vishwakarma Yojana", what_en: "Special scheme for tailors — up to ₹3 lakh loan at 5% interest, plus free skill training.", what_hi: "दर्ज़ियों के लिए ख़ास योजना — 5% ब्याज पर ₹3 लाख तक का लोन, साथ में फ्री ट्रेनिंग।", step_en: "Apply at pmvishwakarma.gov.in or visit your nearest CSC center", step_hi: "pmvishwakarma.gov.in पर अप्लाई करें या नज़दीकी CSC सेंटर जाएँ" },
    { name: "PM Mudra Loan (Shishu)", what_en: "Up to ₹50,000 without collateral — for a new machine or overlock.", what_hi: "बिना गारंटी ₹50,000 तक — नई मशीन या ओवरलॉक के लिए।", step_en: "Ask for the Mudra desk at any nearby bank branch", step_hi: "नज़दीकी बैंक शाखा में मुद्रा डेस्क के बारे में पूछें" },
  ],
  projection: {
    monthly: "₹12,000",
    year: "₹1,44,000",
    assumption_en: "10 blouses/week at ₹300 average + 5 alterations at ₹100 = ₹3,500/week. Very achievable from home.",
    assumption_hi: "हफ़्ते में 10 ब्लाउज़ औसत ₹300 + 5 अल्टरेशन ₹100 = ₹3,500/हफ़्ता। घर से आसानी से हो सकता है।",
    savings_en: "Save ₹3,000/month towards a new computerized sewing machine. In 8 months you'll have a ₹24,000 machine that does embroidery.",
    savings_hi: "नई कम्प्यूटराइज़्ड मशीन के लिए ₹3,000/महीना बचाएँ। 8 महीने में ₹24,000 की मशीन जो कढ़ाई भी करे।",
  },
  action_en: "Send your WhatsApp message to all the aunties in your building and colony groups. Offer free measurement for the first 5 customers.",
  action_hi: "अपना WhatsApp संदेश बिल्डिंग और कॉलोनी ग्रुप की सभी आंटियों को भेजें। पहले 5 कस्टमर्स को फ्री मेज़रमेंट ऑफ़र करें।",
  instagram: {
    bio_en: "✂️ Priya's Boutique | Perfect fitting blouses & alterations | Home service | DM for orders 📲",
    bio_hi: "✂️ प्रिया की बुटीक | परफ़ेक्ट फिटिंग ब्लाउज़ | घर पर सर्विस | ऑर्डर के लिए DM करें 📲",
    content_ideas_en: [
      "Post before/after photos of blouses you've made — show the transformation",
      "Share a reel of you taking measurements — shows professionalism",
      "Post customer reviews and testimonials — builds trust",
    ],
    hashtags: ["#BlouseStitching", "#Tailor", "#PerfectFitting", "#HomeTailor", "#WomenEntrepreneur"],
  },
  vendors: [
    {
      category_en: "Sewing Supplies",
      category_hi: "सिलाई का सामान",
      online: [
        { name: "IndiaMART", url: "indiamart.com", what_for: "Threads, needles, buttons in bulk at wholesale prices" },
        { name: "Amazon", url: "amazon.in", what_for: "Sewing machine parts, scissors, measuring tape" },
      ],
      local_tip_en: "Build a relationship with one cloth market shop — they'll refer customers to you for stitching.",
      local_tip_hi: "कपड़ा मार्केट की एक दुकान से रिश्ता बनाएँ — वो सिलाई के लिए कस्टमर भेजेंगे।",
    },
  ],
  business_management: {
    inventory_tip_en: "Keep a customer register with name, phone, measurements, and delivery date. Never lose a repeat customer.",
    inventory_tip_hi: "एक कस्टमर रजिस्टर रखें — नाम, फोन, नाप, डिलीवरी डेट। कोई भी repeat कस्टमर न खोएँ।",
    finance_tip_en: "Take 50% advance on every order. This covers your thread and time if they don't pick up.",
    finance_tip_hi: "हर ऑर्डर पर 50% एडवांस लें। अगर वो नहीं लेते तो आपका धागा और समय cover होता है।",
    first_week_en: "Day 1-2: Stitch 2 blouses for relatives at discounted rate, get their feedback. Day 3-5: Post on WhatsApp status with photos. Day 6-7: Take your first 3 paid orders.",
    first_week_hi: "दिन 1-2: रिश्तेदारों के 2 ब्लाउज़ डिस्काउंट पर सिलें, फीडबैक लें। दिन 3-5: फोटो के साथ WhatsApp status डालें। दिन 6-7: पहले 3 पेड ऑर्डर लें।",
  },
  motivation_message_en: "Priya, every blouse you've stitched for family was practice for this moment. Your mother's machine and your mother's skill — now they become your income. The colony tailors charge more and fit worse. You're about to change that.",
  motivation_message_hi: "प्रिया जी, परिवार के लिए सिला हर ब्लाउज़ इस पल की तैयारी थी। माँ की मशीन और माँ का हुनर — अब ये आपकी कमाई बनेंगे। कॉलोनी के दर्ज़ी ज़्यादा लेते हैं और फिटिंग ख़राब देते हैं। आप ये बदलने वाली हैं।",
};

/** Meena's mehendi business demo */
const MEENA_SCRIPT: { who: "coach" | "user"; en: string; hi: string }[] = [
  { who: "coach", en: "Namaste! I'm Udaan — your business coach. Tell me, what are you good at? 🪁", hi: "नमस्ते! मैं उड़ान हूँ — आपकी बिज़नेस कोच। बताइए, आप क्या अच्छा करती हैं? 🪁" },
  { who: "user", en: "I apply very good mehendi. I learned many designs from YouTube. In every wedding I do mehendi for all the women for free.", hi: "मैं बहुत अच्छी मेहंदी लगाती हूँ। YouTube से कई डिज़ाइन सीखे। हर शादी में सब औरतों की मुफ़्त में मेहंदी लगाती हूँ।" },
  { who: "coach", en: "Free mehendi at every wedding means everyone already trusts your work! What designs do people request most — bridal, Arabic, or simple?", hi: "हर शादी में फ्री मेहंदी मतलब सबको आपके काम पर भरोसा है! लोग कौन सा डिज़ाइन सबसे ज़्यादा माँगते हैं — ब्राइडल, अरेबिक, या सिंपल?" },
  { who: "user", en: "Arabic designs are most popular. But for brides I do full hand intricate work. My cousin's wedding mehendi photo got 200 likes!", hi: "अरेबिक डिज़ाइन सबसे पॉपुलर है। पर दुल्हन के लिए पूरे हाथ का बारीक काम करती हूँ। कज़िन की शादी की मेहंदी फोटो को 200 likes मिले!" },
  { who: "coach", en: "200 likes means 200 potential customers saw your work! How much time can you give, and do you have your own mehendi cones?", hi: "200 likes मतलब 200 possible कस्टमर्स ने आपका काम देखा! आप कितना समय दे सकती हैं, और क्या अपने मेहंदी कोन हैं?" },
  { who: "user", en: "I make my own cones at home, the paste is always fresh. I can do evenings and weekends, maybe 4-5 hours.", hi: "मैं घर पर अपने कोन बनाती हूँ, पेस्ट हमेशा फ्रेश रहता है। शाम और वीकेंड पर 4-5 घंटे दे सकती हूँ।" },
];

const MEENA_KIT: Kit = {
  type: "kit",
  intro_en: "Meena ji, your kit is ready — those 200 likes are about to become 200 paying customers. 🎉",
  intro_hi: "मीना जी, आपकी किट तैयार है — वो 200 likes अब 200 paying कस्टमर्स बनेंगे। 🎉",
  businesses: [
    { name_en: "Bridal mehendi service", name_hi: "ब्राइडल मेहंदी सेवा", range: "₹3,000–8,000/bride", why_en: "One bride = one day's full earning. Wedding season means 4-5 brides a month is possible.", why_hi: "एक दुल्हन = एक दिन की पूरी कमाई। शादी के सीज़न में महीने में 4-5 दुल्हन possible है।" },
    { name_en: "Party & festival mehendi", name_hi: "पार्टी और त्योहार मेहंदी", range: "₹5,000–12,000/month", why_en: "Karva Chauth, Teej, Diwali, Eid — women want beautiful hands. Group bookings for kitty parties.", why_hi: "करवा चौथ, तीज, दिवाली, ईद — महिलाओं को सुंदर हाथ चाहिए। किट्टी पार्टी के ग्रुप बुकिंग।" },
    { name_en: "Mehendi classes", name_hi: "मेहंदी क्लास", range: "₹2,000–4,000/month", why_en: "Teach 4 girls basic designs in weekend batches. Your YouTube knowledge becomes their paid course.", why_hi: "वीकेंड बैच में 4 लड़कियों को बेसिक डिज़ाइन सिखाएँ। आपका YouTube ज्ञान उनका paid कोर्स बनता है।" },
  ],
  pricing: {
    items: [
      { item_en: "Both hands front (simple)", item_hi: "दोनों हाथ आगे (सिंपल)", price: "₹200" },
      { item_en: "Both hands full (front + back)", item_hi: "दोनों हाथ पूरे (आगे + पीछे)", price: "₹500" },
      { item_en: "Bridal full (hands + feet)", item_hi: "ब्राइडल फुल (हाथ + पैर)", price: "₹3,000–5,000" },
      { item_en: "Group booking (5+ people)", item_hi: "ग्रुप बुकिंग (5+ लोग)", price: "₹150/person" },
    ],
    script_en: "My mehendi starts at ₹200 for simple designs. For bridal, I use only natural homemade paste — dark color guaranteed. I come to your home.",
    script_hi: "मेरी मेहंदी ₹200 से शुरू सिंपल डिज़ाइन के लिए। ब्राइडल के लिए सिर्फ़ घर का नेचुरल पेस्ट — गहरा रंग पक्का। मैं आपके घर आती हूँ।",
  },
  whatsapp_hi: "💫 नमस्ते! मैं मीना — मेहंदी आर्टिस्ट\n🌿 100% नेचुरल होममेड पेस्ट\n✨ ब्राइडल, पार्टी, फेस्टिवल मेहंदी\n🏠 होम सर्विस available\n📸 डिज़ाइन के लिए मेरा Instagram देखें\nबुकिंग के लिए मैसेज करें! 🙏",
  whatsapp_en: "💫 Namaste! I'm Meena — Mehendi Artist\n🌿 100% natural homemade paste\n✨ Bridal, party, festival mehendi\n🏠 Home service available\n📸 See my Instagram for designs\nMessage to book! 🙏",
  schemes: [
    { name: "Udyam Registration", what_en: "Free government registration — helps get bulk orders from event planners.", what_hi: "फ्री सरकारी रजिस्ट्रेशन — इवेंट प्लानर्स से बड़े ऑर्डर मिलने में मदद।", step_en: "Visit udyamregistration.gov.in with your Aadhaar", step_hi: "अपने आधार के साथ udyamregistration.gov.in पर जाएँ" },
    { name: "PM Mudra Loan (Shishu)", what_en: "Up to ₹50,000 for professional kit — good quality cones, practice hands, professional bag.", what_hi: "₹50,000 तक प्रोफेशनल किट के लिए — अच्छी क्वालिटी कोन, प्रैक्टिस हैंड, प्रोफेशनल बैग।", step_en: "Ask for the Mudra desk at any nearby bank branch", step_hi: "नज़दीकी बैंक शाखा में मुद्रा डेस्क के बारे में पूछें" },
  ],
  projection: {
    monthly: "₹15,000",
    year: "₹1,80,000",
    assumption_en: "4 simple bookings/week at ₹300 + 2 bridal/month at ₹4,000 = steady income. Festival months can be 2x.",
    assumption_hi: "हफ़्ते में 4 सिंपल बुकिंग ₹300 + महीने में 2 ब्राइडल ₹4,000 = स्टेडी इनकम। त्योहार में 2 गुना।",
    savings_en: "Save ₹2,000/month for a professional mehendi kit and portfolio album. In 6 months you'll look fully professional.",
    savings_hi: "प्रोफेशनल मेहंदी किट और पोर्टफोलियो एल्बम के लिए ₹2,000/महीना बचाएँ। 6 महीने में पूरी प्रोफेशनल दिखेंगी।",
  },
  action_en: "Post your cousin's wedding mehendi photo on your WhatsApp status RIGHT NOW with your number. That photo already has 200 fans waiting.",
  action_hi: "अभी अपनी कज़िन की शादी वाली मेहंदी फोटो WhatsApp status पर अपने नंबर के साथ डालें। उस फोटो के 200 fans पहले से इंतज़ार में हैं।",
  instagram: {
    bio_en: "✨ Meena Mehendi Art | Bridal & Party Specialist | Natural paste only | Book via DM 📲",
    bio_hi: "✨ मीना मेहंदी आर्ट | ब्राइडल और पार्टी स्पेशलिस्ट | सिर्फ़ नेचुरल पेस्ट | DM से बुक करें 📲",
    content_ideas_en: [
      "Post close-up photos of your best bridal work — zoom in on the details",
      "Share timelapse videos of you applying mehendi — satisfying to watch",
      "Post the dark stain results after 24 hours — proves your paste quality",
    ],
    hashtags: ["#MehendiArtist", "#BridalMehendi", "#NaturalMehendi", "#MehendiDesign", "#WomenEntrepreneur"],
  },
  vendors: [
    {
      category_en: "Mehendi Supplies",
      category_hi: "मेहंदी का सामान",
      online: [
        { name: "Amazon", url: "amazon.in", what_for: "Mehendi cones, practice hands, applicator bottles" },
        { name: "IndiaMART", url: "indiamart.com", what_for: "Bulk natural henna powder, essential oils for paste" },
      ],
      local_tip_en: "Buy henna powder from Rajasthani suppliers — Sojat henna gives the darkest stain.",
      local_tip_hi: "राजस्थानी सप्लायर्स से मेहंदी पाउडर लें — सोजत की मेहंदी सबसे गहरा रंग देती है।",
    },
  ],
  business_management: {
    inventory_tip_en: "Make fresh paste every 2-3 days. Keep a booking calendar — never double-book a bridal date.",
    inventory_tip_hi: "हर 2-3 दिन में फ्रेश पेस्ट बनाएँ। बुकिंग कैलेंडर रखें — कभी ब्राइडल डेट पर डबल-बुक न करें।",
    finance_tip_en: "Take 50% advance for bridal bookings. No-shows on wedding day mean you lose the whole day.",
    finance_tip_hi: "ब्राइडल बुकिंग पर 50% एडवांस लें। शादी के दिन कैंसल होने पर पूरा दिन जाता है।",
    first_week_en: "Day 1-2: Post all your best work photos on Instagram and WhatsApp. Day 3-4: Offer 20% off for first 5 bookings. Day 5-7: Ask happy customers for reviews.",
    first_week_hi: "दिन 1-2: अपनी सबसे अच्छी फोटो Instagram और WhatsApp पर डालें। दिन 3-4: पहली 5 बुकिंग पर 20% छूट ऑफ़र करें। दिन 5-7: खुश कस्टमर्स से review माँगें।",
  },
  motivation_message_en: "Meena, you've been the 'mehendi didi' at every family wedding for free. Today, that talent gets a price tag. Those 200 likes weren't just appreciation — they were your future customers raising their hands. Time to turn likes into bookings.",
  motivation_message_hi: "मीना जी, आप हर पारिवारिक शादी में मुफ़्त की 'मेहंदी दीदी' रही हैं। आज उस हुनर को दाम मिलता है। वो 200 likes सिर्फ़ तारीफ़ नहीं थे — वो आपके future कस्टमर्स थे हाथ उठाकर। अब likes को bookings में बदलने का समय है।",
};

/** Kavita's tuition business demo */
const KAVITA_SCRIPT: { who: "coach" | "user"; en: string; hi: string }[] = [
  { who: "coach", en: "Namaste! I'm Udaan — your business coach. Tell me, what are you good at? 🪁", hi: "नमस्ते! मैं उड़ान हूँ — आपकी बिज़नेस कोच। बताइए, आप क्या अच्छा करती हैं? 🪁" },
  { who: "user", en: "I was a teacher before marriage. I help my children and neighbours' kids with homework. Everyone says I explain very well.", hi: "शादी से पहले टीचर थी। अपने बच्चों और पड़ोस के बच्चों का होमवर्क करवाती हूँ। सब कहते हैं मैं बहुत अच्छा समझाती हूँ।" },
  { who: "coach", en: "A trained teacher who explains well — that's exactly what parents pay for! Which subjects and classes do you help with?", hi: "ट्रेंड टीचर जो अच्छा समझाती हैं — यही तो पैरेंट्स के लिए पैसे देते हैं! कौन से विषय और कक्षा में मदद करती हैं?" },
  { who: "user", en: "Maths and Hindi up to class 8. My daughter is in class 6, so I know the syllabus well. But I never charged anyone.", hi: "Maths और Hindi क्लास 8 तक। मेरी बेटी क्लास 6 में है, तो syllabus अच्छे से पता है। पर कभी किसी से पैसे नहीं लिए।" },
  { who: "coach", en: "Knowing the current syllabus is a huge advantage — parents want that! How much time can you give, and do you have space at home for 3-4 children?", hi: "नया syllabus जानना बड़ा फ़ायदा है — parents यही चाहते हैं! कितना समय दे सकती हैं, और घर में 3-4 बच्चों की जगह है?" },
  { who: "user", en: "2 hours in the evening after my kids' school. Yes, I have a small room, can fit 4-5 children with a whiteboard.", hi: "शाम को 2 घंटे बच्चों के स्कूल के बाद। हाँ, एक छोटा कमरा है, व्हाइटबोर्ड के साथ 4-5 बच्चे बैठ सकते हैं।" },
];

const KAVITA_KIT: Kit = {
  type: "kit",
  intro_en: "Kavita ji, your kit is ready — that teaching degree is about to start earning again. 🎉",
  intro_hi: "कविता जी, आपकी किट तैयार है — वो teaching डिग्री अब फिर से कमाई करेगी। 🎉",
  businesses: [
    { name_en: "Home tuition classes", name_hi: "घर पर ट्यूशन क्लास", range: "₹8,000–15,000/month", why_en: "5 students × ₹800/month = ₹4,000. Two batches = ₹8,000. Parents in your colony need this.", why_hi: "5 students × ₹800/महीना = ₹4,000। दो बैच = ₹8,000। आपकी कॉलोनी के parents को यही चाहिए।" },
    { name_en: "Exam preparation batches", name_hi: "परीक्षा तैयारी बैच", range: "₹3,000–5,000/exam season", why_en: "Special 1-month intensive before board exams. Charge premium for results.", why_hi: "बोर्ड परीक्षा से पहले स्पेशल 1 महीने का intensive। रिज़ल्ट के लिए प्रीमियम चार्ज करें।" },
    { name_en: "Summer holiday coaching", name_hi: "गर्मी छुट्टी कोचिंग", range: "₹4,000–8,000/summer", why_en: "2-month intensive summer batch. Parents want kids busy and learning.", why_hi: "2 महीने का intensive समर बैच। Parents चाहते हैं बच्चे व्यस्त रहें और सीखें।" },
  ],
  pricing: {
    items: [
      { item_en: "Monthly tuition (Class 1-5)", item_hi: "मासिक ट्यूशन (क्लास 1-5)", price: "₹600/month" },
      { item_en: "Monthly tuition (Class 6-8)", item_hi: "मासिक ट्यूशन (क्लास 6-8)", price: "₹800/month" },
      { item_en: "Home visit (per hour)", item_hi: "घर पर पढ़ाना (प्रति घंटा)", price: "₹200/hour" },
      { item_en: "Exam crash course", item_hi: "परीक्षा क्रैश कोर्स", price: "₹1,500/month" },
    ],
    script_en: "My tuition fee is ₹800/month for class 6-8. I cover Maths and Hindi, follow the school syllabus exactly, and give weekly tests. Your child will improve.",
    script_hi: "मेरी ट्यूशन फ़ीस ₹800/महीना है क्लास 6-8 के लिए। Maths और Hindi पढ़ाती हूँ, स्कूल syllabus exactly follow करती हूँ, और weekly test लेती हूँ।",
  },
  whatsapp_hi: "📚 नमस्ते! मैं कविता — trained teacher\n✏️ Maths + Hindi ट्यूशन (क्लास 1-8)\n📖 स्कूल syllabus के अनुसार\n🏠 छोटे बैच, personal attention\n📍 [आपका एरिया]\nएडमिशन के लिए call करें! 🙏",
  whatsapp_en: "📚 Namaste! I'm Kavita — trained teacher\n✏️ Maths + Hindi tuition (Class 1-8)\n📖 As per school syllabus\n🏠 Small batches, personal attention\n📍 [Your Area]\nCall for admission! 🙏",
  schemes: [
    { name: "Udyam Registration", what_en: "Register as education service provider — helps if you want to expand later.", what_hi: "एजुकेशन सर्विस प्रोवाइडर के रूप में रजिस्टर करें — बाद में expand करना हो तो मदद करेगा।", step_en: "Visit udyamregistration.gov.in with your Aadhaar", step_hi: "अपने आधार के साथ udyamregistration.gov.in पर जाएँ" },
    { name: "PM Mudra Loan (Shishu)", what_en: "Up to ₹50,000 for proper setup — whiteboard, desks, chairs, books.", what_hi: "₹50,000 तक प्रॉपर सेटअप के लिए — व्हाइटबोर्ड, डेस्क, कुर्सियाँ, किताबें।", step_en: "Ask for the Mudra desk at any nearby bank branch", step_hi: "नज़दीकी बैंक शाखा में मुद्रा डेस्क के बारे में पूछें" },
  ],
  projection: {
    monthly: "₹10,000",
    year: "₹1,20,000",
    assumption_en: "2 batches of 5 students each at ₹700 average = ₹7,000. Add 2 home visits/week = ₹3,000 more. Total ₹10,000/month.",
    assumption_hi: "₹700 औसत पर 5-5 students के 2 बैच = ₹7,000। हफ़्ते में 2 home visit जोड़ें = ₹3,000 और। कुल ₹10,000/महीना।",
    savings_en: "Save ₹2,000/month for a projector and educational charts. In 6 months your tuition center looks professional.",
    savings_hi: "प्रोजेक्टर और educational charts के लिए ₹2,000/महीना बचाएँ। 6 महीने में आपका tuition center professional दिखेगा।",
  },
  action_en: "Talk to 5 mothers in your building today. Offer one week free trial for their children. Word will spread.",
  action_hi: "आज ही अपनी बिल्डिंग की 5 माताओं से बात करें। उनके बच्चों के लिए एक हफ़्ते का free trial ऑफ़र करें। बात फैलेगी।",
  instagram: {
    bio_en: "📚 Kavita's Tuition | Maths + Hindi | Class 1-8 | Trained Teacher | Small Batches | DM for admission",
    bio_hi: "📚 कविता ट्यूशन | Maths + Hindi | क्लास 1-8 | Trained Teacher | छोटे बैच | एडमिशन के लिए DM करें",
    content_ideas_en: [
      "Post photos of your classroom setup — shows you're serious",
      "Share student improvement stories (with permission) — builds trust",
      "Post quick maths tips and tricks — shows your teaching skill",
    ],
    hashtags: ["#HomeTuition", "#MathsTutor", "#HindiTutor", "#Teacher", "#Education"],
  },
  vendors: [
    {
      category_en: "Teaching Supplies",
      category_hi: "पढ़ाई का सामान",
      online: [
        { name: "Amazon", url: "amazon.in", what_for: "Whiteboard, markers, educational charts, geometry sets" },
        { name: "Flipkart", url: "flipkart.com", what_for: "Student desks, chairs, stationery in bulk" },
      ],
      local_tip_en: "Buy used NCERT books from old students — your reference library at 20% of the cost.",
      local_tip_hi: "पुराने students से used NCERT किताबें लें — 20% दाम में reference library बन जाएगी।",
    },
  ],
  business_management: {
    inventory_tip_en: "Keep an attendance register and marks record for each student. Share monthly progress with parents — they'll refer more students.",
    inventory_tip_hi: "हर student का attendance और marks record रखें। monthly progress parents को share करें — वो और students refer करेंगे।",
    finance_tip_en: "Collect fees by the 5th of every month. No exceptions. Late fee of ₹50 after the 10th.",
    finance_tip_hi: "हर महीने की 5 तारीख़ तक फ़ीस लें। कोई exception नहीं। 10 के बाद ₹50 late fee।",
    first_week_en: "Day 1-2: Set up your room with whiteboard and 5 chairs. Day 3-4: Talk to 10 parents in your building. Day 5-7: Start free trial batch with 3-4 kids.",
    first_week_hi: "दिन 1-2: व्हाइटबोर्ड और 5 कुर्सियों के साथ कमरा सेट करें। दिन 3-4: बिल्डिंग में 10 parents से बात करें। दिन 5-7: 3-4 बच्चों के साथ free trial बैच शुरू करें।",
  },
  motivation_message_en: "Kavita ji, you didn't stop being a teacher when you left the school — you just changed your classroom. Every child you've helped with homework was a student you taught for free. Now those same skills, that same patience, earns money. Your living room is about to become the most trusted tuition center in the colony.",
  motivation_message_hi: "कविता जी, स्कूल छोड़ने पर आपने teacher होना नहीं छोड़ा — बस classroom बदल गया। हर बच्चा जिसका homework करवाया वो student था जिसे free में पढ़ाया। अब वही skills, वही patience, पैसे कमाता है। आपका drawing room कॉलोनी का सबसे भरोसेमंद tuition center बनने वाला है।",
};

/** All demo scenarios */
export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "sunita",
    name_en: "Sunita's Tiffin Service",
    name_hi: "सुनीता की टिफ़िन सेवा",
    emoji: "🍱",
    script: SUNITA_SCRIPT,
    kit: SUNITA_KIT,
  },
  {
    id: "priya",
    name_en: "Priya's Tailoring",
    name_hi: "प्रिया की सिलाई",
    emoji: "🧵",
    script: PRIYA_SCRIPT,
    kit: PRIYA_KIT,
  },
  {
    id: "meena",
    name_en: "Meena's Mehendi",
    name_hi: "मीना की मेहंदी",
    emoji: "✨",
    script: MEENA_SCRIPT,
    kit: MEENA_KIT,
  },
  {
    id: "kavita",
    name_en: "Kavita's Tuition",
    name_hi: "कविता की ट्यूशन",
    emoji: "📚",
    script: KAVITA_SCRIPT,
    kit: KAVITA_KIT,
  },
];

/** Default exports for backward compatibility */
export const DEMO_SCRIPT = SUNITA_SCRIPT;
export const DEMO_KIT = SUNITA_KIT;
