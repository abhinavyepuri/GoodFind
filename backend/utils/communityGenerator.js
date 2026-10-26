/**
 * GoodFind Community Data Generator
 * Parametric generator for realistic e-commerce users, Indian addresses,
 * multi-status orders, reviews (3.8 - 5.0 stars), wishlists, and carts.
 *
 * Rules:
 * - Email format: `name@gf.test`
 * - Password format: `simplename + "gf"` (e.g. arjun@gf.test -> arjungf)
 * - Exclusively Indian shipping destinations (real cities, states, pin codes)
 * - Varied user engagement (orders, reviews, phone disclosure, address count)
 */

export const INDIAN_ADDRESS_TEMPLATES = [
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400050',
    streets: [
      '14 Perry Cross Road, Bandra West',
      'Flat 802, Sagar Tarang, Worli Sea Face',
      '102 Pali Hill Residences, Nargis Dutt Road',
      '7th Floor, Maker Chambers V, Nariman Point',
    ],
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    streets: [
      'Plot 412, 100 Feet Road, Indiranagar',
      'Flat 3B, Palm Meadows, Whitefield',
      '84 4th Cross, 5th Block, Koramangala',
      '22 Lavelle Road, Shanthala Nagar',
    ],
  },
  {
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110016',
    streets: [
      'E-14 Hauz Khas Enclave',
      'B-6/12 Safdarjung Enclave',
      '27 Vasant Vihar, Poorvi Marg',
      '40 Golf Links, Central Delhi',
    ],
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500033',
    streets: [
      'Road No. 36, Jubilee Hills, Near Metro',
      'Plot 88, Financial District, Gachibowli',
      'Flat 401, Fortune One, Banjara Hills Road 12',
      'Villa 19, Whisper Valley, Hitec City',
    ],
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    postalCode: '411001',
    streets: [
      'Lane 6, Koregaon Park North Main Road',
      'B-10 Kalyani Nagar, Near Joggers Park',
      'Flat 502, Rohan Viti, Balewadi High Street',
    ],
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    postalCode: '600018',
    streets: [
      '12 TTK Road, Alwarpet',
      '45 Chamiers Road, R.A. Puram',
      '18 Poes Garden, Teynampet',
    ],
  },
  {
    city: 'Jaipur',
    state: 'Rajasthan',
    postalCode: '302001',
    streets: [
      'Plot 21, Jacob Road, Civil Lines',
      'Flat 304, Royal Palms, C-Scheme',
      'B-8 Prithviraj Road, Ashok Nagar',
    ],
  },
  {
    city: 'Kochi',
    state: 'Kerala',
    postalCode: '682036',
    streets: [
      '16 Panampilly Nagar Main Avenue',
      'Flat 7A, Skyline Imperial, Marine Drive',
      '8 Jawahar Nagar, Kadavanthra',
    ],
  },
];

export const USER_PARAMETRIC_PROFILES = [
  {
    name: 'Arjun Mehta',
    simplename: 'arjun',
    phone: '+91 98201 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    addressCount: 2,
    cityPref: 'Mumbai',
    preferredPayment: 'UPI (Google Pay)',
    orderCount: 3,
    activeCartCount: 1,
    wishlistCount: 4,
    reviewsCount: 2,
  },
  {
    name: 'Priya Sharma',
    simplename: 'priya',
    phone: '+91 99450 88219',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    addressCount: 2,
    cityPref: 'Bengaluru',
    preferredPayment: 'Credit Card (HDFC Regalia)',
    orderCount: 4,
    activeCartCount: 2,
    wishlistCount: 5,
    reviewsCount: 3,
  },
  {
    name: 'Rohan Iyer',
    simplename: 'rohan',
    phone: '', // Intentionally omits phone number
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    addressCount: 1,
    cityPref: 'Hyderabad',
    preferredPayment: 'UPI (PhonePe)',
    orderCount: 2,
    activeCartCount: 0,
    wishlistCount: 2,
    reviewsCount: 1,
  },
  {
    name: 'Ananya Sen',
    simplename: 'ananya',
    phone: '+91 98300 76541',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    addressCount: 1,
    cityPref: 'New Delhi',
    preferredPayment: 'Credit Card (ICICI Sapphiro)',
    orderCount: 3,
    activeCartCount: 1,
    wishlistCount: 3,
    reviewsCount: 2,
  },
  {
    name: 'Vikram Malhotra',
    simplename: 'vikram',
    phone: '+91 98110 33492',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    addressCount: 2,
    cityPref: 'Pune',
    preferredPayment: 'NetBanking (HDFC Bank)',
    orderCount: 2,
    activeCartCount: 0,
    wishlistCount: 4,
    reviewsCount: 1,
  },
  {
    name: 'Kavita Nair',
    simplename: 'kavita',
    phone: '', // No phone
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    addressCount: 1,
    cityPref: 'Kochi',
    preferredPayment: 'UPI (Paytm)',
    orderCount: 1,
    activeCartCount: 1,
    wishlistCount: 3,
    reviewsCount: 1,
  },
  {
    name: 'Rahul Verma',
    simplename: 'rahul',
    phone: '+91 94140 22910',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    addressCount: 1,
    cityPref: 'Jaipur',
    preferredPayment: 'Cash on Delivery (COD)',
    orderCount: 2,
    activeCartCount: 0,
    wishlistCount: 2,
    reviewsCount: 1,
  },
  {
    name: 'Sneha Kulkarni',
    simplename: 'sneha',
    phone: '+91 97654 11098',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    addressCount: 0, // Fresh account who hasn't entered address yet
    cityPref: 'Pune',
    preferredPayment: 'UPI',
    orderCount: 0,
    activeCartCount: 1,
    wishlistCount: 6,
    reviewsCount: 0,
  },
  {
    name: 'Divya Rao',
    simplename: 'divya',
    phone: '+91 98401 55672',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    addressCount: 2,
    cityPref: 'Chennai',
    preferredPayment: 'Credit Card (Axis Magnus)',
    orderCount: 4,
    activeCartCount: 1,
    wishlistCount: 4,
    reviewsCount: 2,
  },
  {
    name: 'Kabir Das',
    simplename: 'kabir',
    phone: '', // No phone
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    addressCount: 1,
    cityPref: 'New Delhi',
    preferredPayment: 'UPI (GPay)',
    orderCount: 1,
    activeCartCount: 0,
    wishlistCount: 2,
    reviewsCount: 1,
  },
];

export const REVIEW_TEMPLATES = [
  {
    productId: 'prod-101', // Aero Sound Pro
    rating: 4.8,
    title: 'Studio acoustic isolation exceeded my expectations',
    comment:
      'The titanium drivers resolve micro-details in orchestral and jazz recordings with uncanny accuracy. ANC is whisper quiet without ear pressure.',
  },
  {
    productId: 'prod-201', // Solid Walnut Desk
    rating: 5.0,
    title: 'Heirloom craftsmanship, silent dual motors',
    comment:
      'Solid kiln-dried American walnut with stunning natural grain. The German lift mechanism is butter smooth and silent even with dual 32-inch monitors.',
  },
  {
    productId: 'prod-301', // Botanical Bodywash
    rating: 4.5,
    title: 'Subtle invigorating woodsy scent, non-drying',
    comment:
      'Cold-pressed marine botanicals lather up gently and leave skin supple. Great eco-conscious aluminium bottle too.',
  },
  {
    productId: 'prod-401', // Minimalist Linen Shirt
    rating: 4.6,
    title: 'Impeccable breathability for Indian summers',
    comment:
      'Relaxed silhouette that drapes naturally. After three washes the organic linen weave got even softer.',
  },
  {
    productId: 'prod-501', // Pour-Over Coffee
    rating: 4.9,
    title: 'Nuanced peach floral notes on V60',
    comment:
      'Light roast with vibrant balanced acidity. Roast date was only 4 days before delivery. Top tier micro-lot.',
  },
  {
    productId: 'prod-102', // ANC Earbuds
    rating: 4.2,
    title: 'Super compact and secure fit for long commutes',
    comment:
      'Spatial audio tracking works great on iOS and Android. Battery easily lasts 8+ hours on a single charge.',
  },
  {
    productId: 'prod-202', // Ceramic Pourer Set
    rating: 4.7,
    title: 'Matte glaze looks stunning on open shelving',
    comment:
      'Heat retention is fantastic and the spout pours with zero drips. Feels substantive and hand-crafted.',
  },
  {
    productId: 'prod-402', // Wool Trousers
    rating: 3.9,
    title: 'Great drape, slightly longer inseam than expected',
    comment:
      'The fine Australian merino wool fabric is exquisite and doesn’t itch at all. Had to take it to my local tailor for a quick 1-inch hem adjustment.',
  },
];

/**
 * Generate fully configured community records for seeding and frontend stores.
 */
export function generateCommunityData(catalogProducts = []) {
  const users = [];
  const addresses = [];
  const orders = [];
  const reviews = [];

  let orderSequence = 10420;

  for (const profile of USER_PARAMETRIC_PROFILES) {
    const userId = `usr-${profile.simplename}`;
    const email = `${profile.simplename}@gf.test`;
    const password = `${profile.simplename}gf`;

    // 1. Create User Document Record
    const userDoc = {
      id: userId,
      name: profile.name,
      simplename: profile.simplename,
      email,
      plainPassword: password, // For easy reference in docs / test logins
      phone: profile.phone,
      role: 'customer',
      avatar: profile.avatar,
    };
    users.push(userDoc);

    // 2. Generate Indian Addresses
    const cityTemplate =
      INDIAN_ADDRESS_TEMPLATES.find((t) => t.city === profile.cityPref) ||
      INDIAN_ADDRESS_TEMPLATES[0];

    const userAddresses = [];
    for (let a = 0; a < profile.addressCount; a++) {
      const street = cityTemplate.streets[a % cityTemplate.streets.length];
      const addrDoc = {
        id: `addr-${profile.simplename}-${a + 1}`,
        userId,
        title: a === 0 ? 'Home' : 'Studio / Office',
        fullName: profile.name,
        street,
        apartment: a === 0 ? 'Tower A, Flat 402' : 'Suite 101, Business Park',
        city: cityTemplate.city,
        state: cityTemplate.state,
        postalCode: cityTemplate.postalCode,
        country: 'India',
        phone: profile.phone || '+91 98200 12345',
        isDefault: a === 0,
      };
      addresses.push(addrDoc);
      userAddresses.push(addrDoc);
    }

    // 3. Generate Varied Orders
    const defaultAddr = userAddresses[0] || {
      fullName: profile.name,
      street: cityTemplate.streets[0],
      city: cityTemplate.city,
      state: cityTemplate.state,
      postalCode: cityTemplate.postalCode,
      country: 'India',
    };

    const statusPool = ['delivered', 'shipped', 'processing', 'delivered', 'cancelled', 'returned'];

    for (let o = 0; o < profile.orderCount; o++) {
      orderSequence += Math.floor(Math.random() * 14) + 3;
      const orderNumber = `GF-${orderSequence}`;
      const status = statusPool[o % statusPool.length];

      // Pick 1 to 3 items from catalog
      const itemsCount = 1 + (o % 2);
      const orderItems = [];
      let subtotal = 0;

      for (let i = 0; i < itemsCount; i++) {
        const prod = catalogProducts[(o * 2 + i) % Math.max(catalogProducts.length, 1)] || {
          id: 'prod-101',
          name: 'Aero Sound Pro Wireless Headphones',
          price: 349,
          image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
        };
        const quantity = 1;
        const price = prod.price || 349;
        subtotal += price * quantity;
        orderItems.push({
          productId: prod.id,
          name: prod.name,
          price,
          quantity,
          image: prod.images?.[0] || prod.image || '',
          variant: prod.variants?.colors?.[0] || 'Midnight Black',
        });
      }

      const shipping = subtotal > 150 ? 0 : 15;
      const tax = Math.round(subtotal * 0.08);
      const total = subtotal + shipping + tax;

      // Realistic staggered order dates
      const daysAgo = (profile.orderCount - o) * 18 + Math.floor(Math.random() * 5);
      const orderDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      const orderDoc = {
        id: `ord-${profile.simplename}-${o + 1}`,
        orderNumber,
        customer: {
          id: userId,
          name: profile.name,
          email,
          phone: profile.phone,
        },
        items: orderItems,
        subtotal,
        discount: 0,
        couponCode: '',
        shipping,
        tax,
        total,
        status,
        paymentStatus: status === 'cancelled' ? 'refunded' : 'paid',
        paymentMethod: profile.preferredPayment,
        shippingAddress: defaultAddr,
        trackingNumber: `GFTRK-${orderNumber.replace('GF-', '')}${profile.simplename.toUpperCase()}`,
        createdAt: orderDate.toISOString(),
        timeline: [
          {
            status: 'placed',
            title: 'Order Verified & Authorized',
            description: `Payment via ${profile.preferredPayment} confirmed.`,
            timestamp: orderDate.toISOString(),
            completed: true,
          },
          {
            status: 'processing',
            title: 'Handcrafted Packaging Complete',
            description: 'Item inspected and boxed with eco-friendly packing.',
            timestamp: new Date(orderDate.getTime() + 18 * 3600 * 1000).toISOString(),
            completed: status !== 'placed',
          },
          {
            status: 'shipped',
            title: 'Dispatched from Hub',
            description: `Handed over to Express Courier (Tracking: GFTRK-${orderNumber.replace('GF-', '')}).`,
            timestamp: new Date(orderDate.getTime() + 36 * 3600 * 1000).toISOString(),
            completed: status === 'shipped' || status === 'delivered',
          },
          {
            status: 'delivered',
            title: 'Delivered to Doorstep',
            description: `Received by ${profile.name.split(' ')[0]} at verified destination.`,
            timestamp: new Date(orderDate.getTime() + 64 * 3600 * 1000).toISOString(),
            completed: status === 'delivered',
          },
        ],
      };

      orders.push(orderDoc);
    }

    // 4. Generate Reviews (3.8 - 5.0 stars)
    for (let r = 0; r < profile.reviewsCount; r++) {
      const template = REVIEW_TEMPLATES[(reviews.length) % REVIEW_TEMPLATES.length];
      const reviewDoc = {
        id: `rev-${profile.simplename}-${r + 1}`,
        productId: template.productId,
        userId,
        author: profile.name,
        avatar: profile.avatar,
        rating: template.rating,
        title: template.title,
        comment: template.comment,
        verified: true,
        createdAt: new Date(Date.now() - (r + 1) * 12 * 24 * 60 * 60 * 1000).toISOString(),
      };
      reviews.push(reviewDoc);
    }
  }

  return {
    users,
    addresses,
    orders,
    reviews,
  };
}

export default generateCommunityData;
