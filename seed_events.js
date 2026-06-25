import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Event } from './modules/entry-user/src/models/Event.js';
import { User } from './modules/entry-user/src/models/user.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedEvents = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    // Find a host user
    let host = await User.findOne({ role: { $in: ['admin', 'superadmin', 'host'] } });
    if (!host) {
        host = await User.create({
            name: 'Demo Host',
            email: 'demo.host@entryclub.com',
            password: 'password123',
            role: 'host',
            phone: '1234567890'
        });
        console.log("Created demo host user.");
    }

    // Delete existing old events first to prevent clutter
    await Event.deleteMany({});
    console.log("Cleared old events...");

    const demoEvents = [
        {
            hostId: host._id,
            hostModel: 'User',
            title: "Neon Nights: Cyberpunk Rave",
            date: new Date(new Date().setDate(new Date().getDate() + 2)),
            startTime: "22:00",
            endTime: "04:00",
            description: "Immerse yourself in a futuristic cybernetic dreamscape. Pumping techno, laser light shows, and an underground vibe. Dress code: Cyber-chic.",
            coverImage: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2958&auto=format&fit=crop",
            images: [
                "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=2000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop"
            ],
            houseRules: [
                { icon: "shirt-outline", title: "Dress Code", detail: "Cyberpunk/Neon attire mandatory." },
                { icon: "beer-outline", title: "Age Limit", detail: "21+ Only. ID required." }
            ],
            locationData: { lat: 19.0760, lng: 72.8777, address: "Mumbai Secret Warehouse, Andheri West" }, // Mumbai
            tickets: [
                { type: "General Access", price: 1500, capacity: 500, sold: 340 },
                { type: "VIP Access", price: 4000, capacity: 50, sold: 48 }
            ],
            floors: [
                { name: "Main Dance Floor", price: 1500, capacity: 500, perks: ["Access to main stage", "Cash bar"], color: "#FF007F" },
                { name: "VIP Lounge", price: 4000, capacity: 50, perks: ["Premium seating", "Bottle service", "Private DJ"], color: "#00F0FF" }
            ],
            status: "LIVE",
            isFeatured: true,
            isTrending: true,
            views: 4500,
            attendeeCount: 388
        },
        {
            hostId: host._id,
            hostModel: 'User',
            title: "Sundance Open Air Festival",
            date: new Date(new Date().setDate(new Date().getDate() + 5)),
            startTime: "16:00",
            endTime: "23:00",
            description: "A beautiful sunset festival featuring the best deep house and melodic techno artists. Enjoy food trucks, live art, and incredible music.",
            coverImage: "https://images.unsplash.com/photo-1533174000273-e1f4ceb66150?q=80&w=2940&auto=format&fit=crop",
            images: [],
            locationData: { lat: 28.7041, lng: 77.1025, address: "Delhi Golf Club Grounds, New Delhi" }, // Delhi
            tickets: [
                { type: "Early Bird", price: 999, capacity: 1000, sold: 1000 },
                { type: "Phase 1", price: 1499, capacity: 2000, sold: 1250 }
            ],
            status: "LIVE",
            isFeatured: true,
            isTrending: false,
            views: 8200,
            attendeeCount: 2250
        },
        {
            hostId: host._id,
            hostModel: 'User',
            title: "Velvet Lounge: Jazz & Wine",
            date: new Date(new Date().setDate(new Date().getDate() + 1)),
            startTime: "19:00",
            endTime: "00:00",
            description: "An intimate evening of live jazz music, paired with an exclusive wine tasting experience. Perfect for a classy date night or relaxed evening.",
            coverImage: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2832&auto=format&fit=crop",
            images: [],
            locationData: { lat: 12.9716, lng: 77.5946, address: "The Ritz-Carlton, Bengaluru" }, // Bengaluru
            tickets: [
                { type: "Standard Entry", price: 2500, capacity: 150, sold: 80 },
                { type: "Couples Pass", price: 4500, capacity: 50, sold: 45 }
            ],
            status: "LIVE",
            isFeatured: false,
            isTrending: false,
            views: 1200,
            attendeeCount: 170
        },
        {
            hostId: host._id,
            hostModel: 'User',
            title: "Tech-House Boiler Room",
            date: new Date(new Date().setDate(new Date().getDate() + 14)),
            startTime: "23:00",
            endTime: "05:00",
            description: "An exclusive underground tech-house set. 360-degree stage setup, intense visuals, and no phones allowed on the dancefloor.",
            coverImage: "https://images.unsplash.com/photo-1470229722913-7c090be5c5a4?q=80&w=2832&auto=format&fit=crop",
            images: [],
            locationData: { lat: 18.5204, lng: 73.8567, address: "Koregaon Park Industrial Area, Pune" }, // Pune
            tickets: [
                { type: "RSVP", price: 500, capacity: 300, sold: 300 }
            ],
            status: "LIVE",
            isFeatured: false,
            isTrending: true,
            views: 6700,
            attendeeCount: 300
        },
        {
            hostId: host._id,
            hostModel: 'User',
            title: "Rooftop Sundowner: Tropical Vibes",
            date: new Date(new Date().setDate(new Date().getDate() + 7)),
            startTime: "17:00",
            endTime: "22:00",
            description: "Tropical house, afrobeats, and amazing cocktails. Experience the city skyline like never before at our premier rooftop venue.",
            coverImage: "https://images.unsplash.com/photo-1485872299829-c673f5194813?q=80&w=2960&auto=format&fit=crop",
            images: [],
            locationData: { lat: 17.3850, lng: 78.4867, address: "Banjara Hills Rooftop, Hyderabad" }, // Hyderabad
            tickets: [
                { type: "General Admission", price: 1200, capacity: 400, sold: 150 }
            ],
            status: "LIVE",
            isFeatured: true,
            isTrending: false,
            views: 3100,
            attendeeCount: 150
        }
    ];

    await Event.insertMany(demoEvents);
    console.log(`Successfully seeded ${demoEvents.length} awesome events!`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding events:", error);
    process.exit(1);
  }
};

seedEvents();
