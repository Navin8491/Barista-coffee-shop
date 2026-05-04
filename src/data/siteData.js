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
    image: 'https://images.unsplash.com/photo-1603046891744-1f0d25a74f70?w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090b?w=600&q=80',
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
    excerpt:
      'Discover the precise variables—temperature, grind size, and extraction time—that turn a simple shot into liquid gold.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Single Origin vs. Blends: A Deep Dive',
    category: 'Coffee Culture',
    date: 'April 10, 2025',
    author: 'Sofia Romano',
    excerpt:
      'We explore the nuanced world of coffee sourcing—what makes a single-origin bean shine and when a carefully crafted blend wins.',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
    readTime: '7 min read',
  },
  {
    id: 3,
    title: 'Our Barista Championship Journey',
    category: 'Stories',
    date: 'March 29, 2025',
    author: 'Luca Ferrari',
    excerpt:
      "Follow our head barista's journey to the regional championship—from late-night practice sessions to the big stage.",
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
    readTime: '4 min read',
  },
  {
    id: 4,
    title: 'How to Brew Café-Quality Coffee at Home',
    category: 'Brewing',
    date: 'March 15, 2025',
    author: 'Marco Bianchi',
    excerpt:
      'Transform your morning routine with these professional tips on equipment, water quality, and technique.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    readTime: '6 min read',
  },
  {
    id: 5,
    title: 'Seasonal Menu: Spring Florals',
    category: 'Menu',
    date: 'March 5, 2025',
    author: 'Sofia Romano',
    excerpt:
      "Spring is here and we have launched our limited-edition lavender cold brew and rose-infused latte. Come try them!",
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
    readTime: '3 min read',
  },
  {
    id: 6,
    title: 'Sustainability at Barista Coffee',
    category: 'Stories',
    date: 'February 22, 2025',
    author: 'Luca Ferrari',
    excerpt:
      'Our commitment to ethical sourcing, compostable packaging, and community partnerships—because great coffee should do good.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    readTime: '5 min read',
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
