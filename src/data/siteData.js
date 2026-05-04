// ─── Site Static Demo Data ────────────────────────────────────────────────────

export const siteInfo = {
  name: 'Barista Coffee',
  tagline: 'Crafted with Passion',
  phone: '+11 6254 7855',
  phoneLabel: 'Call Us',
  email: 'support@baristacoffee.com',
  address: 'Via Carlo Montù 78, 22021 Bellagio CO, Italy',
  social: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
};

export const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

export const slides = [
  {
    id: 1,
    title: 'Awaken Your Senses',
    subtitle: 'Handcrafted espresso, brewed just for you',
    buttonText: 'Explore Menu',
    buttonLink: '/menu',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80',
  },
  {
    id: 2,
    title: 'The Art of Coffee',
    subtitle: 'Single-origin beans, precision-roasted in-house',
    buttonText: 'Our Story',
    buttonLink: '/blog',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&q=80',
  },
  {
    id: 3,
    title: 'A Place to Gather',
    subtitle: 'Cozy ambiance, great coffee, good company',
    buttonText: 'Visit Us',
    buttonLink: '/contact',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&q=80',
  },
];

export const products = [
  {
    id: 1,
    name: 'Signature Espresso',
    price: 3.5,
    originalPrice: null,
    rating: 5,
    category: 'Coffee',
    tag: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=80',
    description: 'Rich, full-bodied espresso with a velvety crema.',
  },
  {
    id: 2,
    name: 'Caramel Latte',
    price: 4.5,
    originalPrice: 5.5,
    rating: 4,
    category: 'Coffee',
    tag: 'Sale',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
    description: 'Smooth latte with house-made caramel drizzle.',
  },
  {
    id: 3,
    name: 'Matcha Latte',
    price: 5.0,
    originalPrice: null,
    rating: 4,
    category: 'Specialty',
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600&q=80',
    description: 'Ceremonial-grade matcha with oat milk.',
  },
  {
    id: 4,
    name: 'Avocado Toast',
    price: 8.0,
    originalPrice: null,
    rating: 5,
    category: 'Food',
    tag: null,
    image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=600&q=80',
    description: 'Smashed avocado on sourdough with chilli flakes.',
  },
  {
    id: 5,
    name: 'Cold Brew',
    price: 4.0,
    originalPrice: null,
    rating: 5,
    category: 'Coffee',
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
    description: '24-hour slow-steeped cold brew, served over ice.',
  },
  {
    id: 6,
    name: 'Almond Croissant',
    price: 3.5,
    originalPrice: null,
    rating: 4,
    category: 'Food',
    tag: null,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80',
    description: 'Flaky, buttery croissant filled with almond cream.',
  },
  {
    id: 7,
    name: 'Flat White',
    price: 4.0,
    originalPrice: null,
    rating: 5,
    category: 'Coffee',
    tag: null,
    image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=600&q=80',
    description: 'Double ristretto with steamed micro-foam milk.',
  },
  {
    id: 8,
    name: 'Chocolate Cake',
    price: 6.0,
    originalPrice: 7.5,
    rating: 5,
    category: 'Food',
    tag: 'Sale',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    description: 'Decadent dark chocolate cake with ganache glaze.',
  },
];

export const menuCategories = ['All', 'Coffee', 'Specialty', 'Food'];

export const blogPosts = [
  {
    id: 1,
    title: 'The Secret Behind Perfect Espresso',
    category: 'Brewing',
    date: 'April 18, 2025',
    author: 'Marco Bianchi',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    excerpt:
      'Discover the precise variables—temperature, grind size, and extraction time—that turn a simple shot into liquid gold.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80',
    readTime: '5 min read',
    fullContent: [
      {
        heading: 'The Holy Trinity of Espresso',
        body: 'Every extraordinary shot of espresso is governed by three variables: water temperature, grind size, and extraction time. Miss any one of these and you will taste the difference immediately—either a sour, under-extracted disappointment or a bitter, over-pulled cup that lingers unpleasantly. Mastering all three together is what separates a great barista from a merely good one.',
      },
      {
        heading: 'Water Temperature: The Invisible Variable',
        body: 'The Specialty Coffee Association recommends a brew water temperature between 90°C and 96°C (195°F–205°F). Too hot and you scorch the grounds, extracting harsh bitter compounds. Too cool and the sugars never fully dissolve, leaving a sour, sharp taste. At Barista Coffee, we calibrate our La Marzocca machines to 93°C — the sweet spot that unlocks the caramel and chocolate notes in our house blend.',
      },
      {
        heading: 'Grind Size: Dialling In Precision',
        body: 'Grind size is your primary lever for controlling extraction speed. A finer grind slows water flow, extending contact time — ideal for lighter roasts. A coarser grind speeds things up, preventing over-extraction with darker, more porous beans. We use a Mahlkönig EK43 and re-dial every morning, because changes in humidity, temperature, and even the age of the beans shift the ideal setting.',
      },
      {
        heading: 'Extraction Time: The Golden Window',
        body: 'A classic double espresso should pull in 25–30 seconds from the moment the pump engages. Within this window the shot transitions from the pale, syrupy first drops (the "heart") through the rich reddish-brown body to the pale, bitter "tail." Stop the shot at the right moment and you capture only the best of all three phases. Letting it run long introduces astringency; cutting it short leaves sweetness trapped in the puck.',
      },
      {
        heading: 'The Crema: Your Visual Guide',
        body: 'A properly pulled shot crowns itself with a thick, tiger-striped crema — the emulsified oils and CO₂ produced during extraction. Rich, hazelnut-brown crema that holds for 60+ seconds is your signal that temperature, grind, and time were all in harmony. If it dissipates in under 10 seconds, something is off. Use it as a real-time feedback loop every single morning.',
      },
    ],
  },
  {
    id: 2,
    title: 'Single Origin vs. Blends: A Deep Dive',
    category: 'Coffee Culture',
    date: 'April 10, 2025',
    author: 'Sofia Romano',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
    excerpt:
      'We explore the nuanced world of coffee sourcing—what makes a single-origin bean shine and when a carefully crafted blend wins.',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&q=80',
    readTime: '7 min read',
    fullContent: [
      {
        heading: 'What Is a Single Origin?',
        body: 'A single-origin coffee comes from one specific country, region, farm, or even a single lot within a farm. This traceability is the core of the specialty coffee movement. When you drink a Yirgacheffe from Ethiopia, you are tasting the terroir of that highland — the jasmine and blueberry notes that come from the specific altitude, soil chemistry, and processing method used by that particular cooperative. It is coffee as an expression of place.',
      },
      {
        heading: 'The Case for Blends',
        body: 'Blends are frequently dismissed as the commercial option, but that is an unfair characterisation. A masterfully constructed blend achieves balance and complexity that no single origin can match on its own. At Barista Coffee, our house espresso blend pairs a bright, washed Ethiopian for acidity and a natural Brazilian for body and sweetness. Neither alone would make a great espresso; together they create something greater than the sum of their parts.',
      },
      {
        heading: 'Consistency vs. Seasonality',
        body: 'One often-overlooked advantage of blends is consistency. Coffee is an agricultural product — it changes with every harvest, every season, and even every bag. A skilled roaster adjusting a blend can maintain the same cup profile year-round by swapping component origins as the seasons shift. Single origins, by contrast, are intentionally seasonal. When the Ethiopian lot is gone, it is gone until the next harvest — and the next lot will taste subtly different.',
      },
      {
        heading: 'Which Should You Choose?',
        body: 'For filter methods — pour-over, AeroPress, Chemex — single origins shine. Without the pressure of espresso extraction and with the clarity that filter brewing provides, those delicate floral and fruit notes fully express themselves. For milk-based espresso drinks, blends almost always win; their boldness and sweetness cut through steamed milk in a way that a delicate single origin often cannot.',
      },
      {
        heading: 'Our Recommendation',
        body: 'Start your morning with a single-origin pour-over. It is a meditative, exploratory experience. Later in the day, let our house blend fuel you through a flat white or cortado. Both have a place in your coffee life — they are not competitors but complements.',
      },
    ],
  },
  {
    id: 3,
    title: 'Our Barista Championship Journey',
    category: 'Stories',
    date: 'March 29, 2025',
    author: 'Luca Ferrari',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    excerpt:
      "Follow our head barista's journey to the regional championship—from late-night practice sessions to the big stage.",
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80',
    readTime: '4 min read',
    fullContent: [
      {
        heading: 'The Decision to Compete',
        body: 'I never planned to compete. I got into coffee because I love the ritual of it — the early mornings, the smell of fresh grounds, the satisfaction on a customer\'s face with their first sip. But after three years behind the bar, Marco challenged me. "You\'re good enough," he said. "Prove it to yourself." So I entered the Italian Regional Barista Championship last autumn, with four months to prepare.',
      },
      {
        heading: 'The Training Regiment',
        body: 'Competition barista is a different discipline entirely. You have 15 minutes to serve four judges: four espressos, four milk drinks, and four "signature beverages" of your own design — all while narrating your creative process and technical choices aloud. I practiced that 15-minute set over 200 times. My girlfriend timed me. The team at Barista Coffee let me use the bar after close. I went through 18 kg of beans in training alone.',
      },
      {
        heading: 'The Signature Beverage Challenge',
        body: 'The signature drink is where competitors can truly express themselves. Mine was an espresso tonic elevated with a cold infusion of cardamom, dried orange peel, and a single drop of rose water — inspired by an aperitivo hour in Milan. Getting the balance right took six weeks and approximately 40 failed prototypes. When I finally hit the recipe, I cried a little. I am not ashamed to admit that.',
      },
      {
        heading: 'Competition Day',
        body: 'Walking onto the competition stage in Milan was surreal. Everything I had practiced alone in a quiet café now had to happen in front of 200 spectators, cameras, and four incredibly serious judges. I remember nothing of the first two minutes — pure adrenaline. Then something clicked. I found my rhythm. I presented every drink on time, nailed my narrative, and poured the cleanest latte art of my life.',
      },
      {
        heading: 'The Result — and What Comes Next',
        body: 'I placed third at the regional level — not the podium I had imagined, but an honour I am proud of. More than the placement, the experience transformed how I think about coffee. I came back to Barista Coffee a better technician and a more curious, creative professional. If you visit us now, you might even spot the signature drink on our specials board. It earned its place there.',
      },
    ],
  },
  {
    id: 4,
    title: 'How to Brew Café-Quality Coffee at Home',
    category: 'Brewing',
    date: 'March 15, 2025',
    author: 'Marco Bianchi',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    excerpt:
      'Transform your morning routine with these professional tips on equipment, water quality, and technique.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80',
    readTime: '6 min read',
    fullContent: [
      {
        heading: 'Invest in a Burr Grinder First',
        body: 'If you can only upgrade one piece of equipment, make it your grinder. A blade grinder produces inconsistent, uneven particles that extract unevenly — giving you a cup that is simultaneously under- and over-extracted. A burr grinder (even an entry-level hand grinder) produces uniform grounds that extract predictably and cleanly. The Timemore C2 or 1Zpresso JX are excellent starting points under €80.',
      },
      {
        heading: 'Water Quality Is Non-Negotiable',
        body: 'Coffee is 98.5% water. If your tap water smells of chlorine or leaves scale in your kettle, it is ruining your cup regardless of how good your beans are. Use a simple filtered jug or bottled water with a TDS (total dissolved solids) between 75–150 ppm — the sweet spot for extraction. Distilled water is actually too pure and will produce a flat, lifeless cup.',
      },
      {
        heading: 'The Pour-Over Method',
        body: 'For filter coffee at home, a Hario V60 or Chemex is hard to beat. Use a 1:16 ratio (1g coffee per 16g water). Bloom your grounds first with twice their weight in water for 30 seconds, then pour in slow, steady spirals. This controlled pour ensures even saturation. Total brew time should be 3–4 minutes. The clarity you will get compared to a drip machine is astonishing.',
      },
      {
        heading: 'Storage: The Enemy Is Oxygen',
        body: 'Freshly roasted beans are at their peak between 5 and 14 days after roast. After that, oxidisation progressively dulls the flavour. Store beans in an airtight container — ideally with a one-way valve — away from light and heat. Never store in the fridge; the moisture cycle as you open and close it accelerates staling. Buy small, fresh batches rather than one large bag that will sit for weeks.',
      },
    ],
  },
  {
    id: 5,
    title: 'Seasonal Menu: Spring Florals',
    category: 'Menu',
    date: 'March 5, 2025',
    author: 'Sofia Romano',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
    excerpt:
      "Spring is here and we have launched our limited-edition lavender cold brew and rose-infused latte. Come try them!",
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1200&q=80',
    readTime: '3 min read',
    fullContent: [
      {
        heading: 'Why We Love Seasonal Menus',
        body: 'The best cafés, like the best restaurants, follow the seasons. Spring brings lighter energy — after months of dark roasts and warming spices, customers naturally gravitate toward something brighter and more aromatic. Our spring specials are designed to celebrate that shift, using flowers and botanicals that feel as fresh as the weather outside.',
      },
      {
        heading: 'The Lavender Cold Brew',
        body: 'We cold-steep our medium-roast Ethiopian single-origin for 18 hours, then blend the concentrate with a house-made lavender syrup — real lavender buds, not artificial flavouring — and serve it over a tower of clear ice. The result is floral, slightly sweet, and extraordinarily refreshing. We top it with a single dried lavender sprig that perfumes the air as you bring the glass to your lips. Available until late May.',
      },
      {
        heading: 'The Rose-Infused Latte',
        body: 'Our rose latte pairs our house espresso blend with a rose and vanilla milk foam. We use a rosewater from a small Italian producer in Calabria — subtle, not perfumy — balanced with a touch of cardamom in the foam. It is beautiful to photograph and even better to drink. Order it hot for a comforting floral experience, or iced for something clean and refreshing.',
      },
      {
        heading: 'Availability and Pairing',
        body: 'Both drinks are available from now through the end of May, or while our seasonal syrups last. We recommend pairing the lavender cold brew with our lemon olive-oil cake, and the rose latte with the pistachio and raspberry tart — both available daily from the pastry cabinet. Come in, sit by the window, and let spring do its thing.',
      },
    ],
  },
  {
    id: 6,
    title: 'Sustainability at Barista Coffee',
    category: 'Stories',
    date: 'February 22, 2025',
    author: 'Luca Ferrari',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    excerpt:
      'Our commitment to ethical sourcing, compostable packaging, and community partnerships—because great coffee should do good.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
    readTime: '5 min read',
    fullContent: [
      {
        heading: 'Coffee Has a Footprint',
        body: 'A single cup of coffee is the culmination of an enormous journey — from a seedling on a hillside farm to the hands of a picker, a processor, an exporter, a roaster, and finally a barista. At each step there are environmental and human costs. We believe that if you are going to do this well, you have to take responsibility for the whole chain, not just the final cup.',
      },
      {
        heading: 'Direct Trade and Fair Pricing',
        body: 'We source 80% of our coffees through direct-trade relationships with cooperatives in Ethiopia, Colombia, and Guatemala. This means we pay above the commodity market price — often 30–40% more. That premium goes directly to the farmers, enabling better wages, school funding, and investment in processing infrastructure. We visit our partner farms annually, and we publish our pricing transparency report on our website each year.',
      },
      {
        heading: 'Zero-Waste Packaging',
        body: 'Since January 2024, all our single-use cups are certified compostable — no plastic lining, no greenwashing. Our retail coffee bags use a fully compostable kraft paper with a bio-based valve. Spent espresso grounds are collected weekly by a local composting service and returned to community gardens in Bellagio. If you bring your own cup, you receive a 30-cent discount, always.',
      },
      {
        heading: 'Community Rooted',
        body: 'Sustainability is not only environmental. We employ locally, pay above the regional minimum wage, and partner with the vocational school next door to offer barista apprenticeships for young people entering the workforce. Two of our current staff members started as apprentices with us three years ago. That is the kind of cycle we are proud of.',
      },
    ],
  },
];

export const footerData = {
  about:
    'We are a passionate team of coffee artisans dedicated to bringing you the finest specialty coffee experience in a warm, welcoming space.',
  usefulLinks: ['Home', 'Menu', 'Blog', 'About Us'],
  infoLinks: ['FAQ', 'Privacy Policy', 'Site Map', 'Contact Us'],
  contact: {
    address: 'Via Carlo Montù 78, 22021 Bellagio CO, Italy',
    phone: '+11 6254 7855',
    email: 'support@baristacoffee.com',
  },
};

export const testimonials = [
  {
    id: 1,
    name: 'Elena Moretti',
    role: 'Regular Customer',
    text: 'The best flat white I have ever tasted. The ambiance is perfect for working remotely too. A true gem!',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    rating: 5,
  },
  {
    id: 2,
    name: 'James Wilson',
    role: 'Coffee Enthusiast',
    text: 'I drove 45 minutes just for their cold brew. Worth every kilometer. The staff are knowledgeable and friendly.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    rating: 5,
  },
  {
    id: 3,
    name: 'Priya Sharma',
    role: 'Food Blogger',
    text: 'The almond croissant paired with their signature espresso is an absolute masterpiece. Highly recommended.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
    rating: 5,
  },
];
