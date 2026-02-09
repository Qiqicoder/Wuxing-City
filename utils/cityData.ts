
export interface Landmark {
    id: string;
    name: string;
    description: string;
    icon: string;
    type: 'landmark' | 'decoration' | 'transport' | 'nature' | 'building';
    top: string; // CSS percentage
    left: string; // CSS percentage
}

export interface CityData {
    id: string;
    name: string;
    subtitle: string;
    background: string;
    landmarks: Landmark[];
    fortunes: string[];
}

export const CITIES: Record<string, CityData> = {
    london: {
        id: 'london',
        name: 'London',
        subtitle: 'Overcast Day • Click to Explore',
        background: '/worlds/london/background.png',
        landmarks: [
            {
                id: "big_ben",
                name: "Big Ben (Elizabeth Tower)",
                description: "The iconic clock tower of the Palace of Westminster, standing 96 meters tall. Completed in 1859, its famous bell has chimed the hours for over 160 years, becoming a symbol of British democracy and resilience.",
                icon: "🕰️",
                type: "landmark",
                top: "50%",
                left: "34%"
            },
            {
                id: "london_eye",
                name: "London Eye",
                description: "Europe's tallest cantilevered observation wheel, offering breathtaking 360-degree views of London. Opened in 2000 for the millennium celebrations, it has become one of the city's most beloved modern landmarks.",
                icon: "🎡",
                type: "landmark",
                top: "44%",
                left: "55%"
            },
            {
                id: "tower_bridge",
                name: "Tower Bridge",
                description: "The magnificent Victorian bascule bridge spanning the River Thames. Built between 1886 and 1894, its twin Gothic towers and blue suspension chains make it one of the most photographed structures in the world.",
                icon: "🌉",
                type: "landmark",
                top: "56%",
                left: "74%"
            },
            {
                id: "phone_booth",
                name: "Red Telephone Box",
                description: "The iconic K2 and K6 red telephone boxes designed by Sir Giles Gilbert Scott. Though rarely used for calls today, they remain beloved cultural symbols of Britain across the world.",
                icon: "📞",
                type: "decoration",
                top: "80%",
                left: "22%"
            },
            {
                id: "underground",
                name: "London Underground",
                description: "The Tube - the world's first underground railway, opened in 1863. With 272 stations and 11 lines, it carries over a billion passengers each year through the heart of London.",
                icon: "🚇",
                type: "transport",
                top: "80%",
                left: "48%"
            }
        ],
        fortunes: [
            "Keep calm and carry on - your persistence will be rewarded.",
            "Like Big Ben, stand tall through every season of life.",
            "Your perspective will change everything. Seek higher ground.",
            "A spot of tea and patience solves most puzzles.",
            "The fog may be thick, but your vision is clear.",
            "Mind the gap between doubt and action - then leap.",
            "Your ideas are brilliant. Trust in your own genius.",
            "Like the Thames, let difficulties flow around you.",
            "Cheerio to yesterday's worries. Tomorrow brings fresh starts.",
            "The Underground teaches us: there's always another route.",
            "Your stiff upper lip hides a heart of gold.",
            "London wasn't built in a day. Pace yourself wisely.",
            "The right connection will arrive at the perfect platform.",
            "Rain or shine, your inner light guides the way.",
            "History remembers those who dare to be different.",
            "Your queue in life leads somewhere extraordinary.",
            "Like Tower Bridge, open yourself to new possibilities.",
            "The crown of success awaits those who persevere.",
            "Your story deserves to be told. Write it with courage.",
            "A proper breakfast sets up a proper day. Nourish yourself.",
            "The bells of opportunity are chiming. Listen closely.",
            "Your kindness ripples across the city of life.",
            "Grey skies make the sunshine sweeter. Hope is coming.",
            "Like the London Eye, take the long view.",
            "Brilliant things await those who embrace the journey."
        ]
    },

    tokyo: {
        id: 'tokyo',
        name: 'Tokyo',
        subtitle: 'Spring Dusk • Click to Explore',
        background: '/worlds/tokyo/background.png',
        landmarks: [
            {
                id: "tokyo_tower",
                name: "Tokyo Tower",
                description: "An iconic red communications tower rising above the city skyline. Built in 1958, this 333-meter landmark offers stunning panoramic views of Tokyo and has become a symbol of Japan's post-war rebirth.",
                icon: "🗼",
                type: "landmark",
                left: "52%",
                top: "40%"
            },
            {
                id: "kaminarimon",
                name: "Kaminarimon Gate",
                description: "The Thunder Gate - a magnificent entrance to Senso-ji Temple in Asakusa. Its giant red lantern, weighing 700kg, has welcomed visitors for centuries and represents the heart of traditional Tokyo.",
                icon: "⛩️",
                type: "landmark",
                left: "36%",
                top: "60%"
            },
            {
                id: "vending_machine",
                name: "Vending Machine",
                description: "A classic Japanese vending machine - one of over 5 million across Japan! From hot coffee to cold drinks, these convenient machines are a unique part of Japanese street culture.",
                icon: "🥤",
                type: "decoration",
                left: "24%",
                top: "78%"
            },
            {
                id: "konbini",
                name: "Convenience Store",
                description: "A cozy konbini (convenience store) offering everything from onigiri to manga. Open 24/7, these stores are the heartbeat of Japanese neighborhoods.",
                icon: "🏪",
                type: "building",
                left: "72%",
                top: "70%"
            }
        ],
        fortunes: [
            "Like cherry blossoms, your moment to shine will come.",
            "The path of a thousand torii gates begins with one step.",
            "Your spirit is as resilient as bamboo in the wind.",
            "Patience like Mount Fuji brings lasting success.",
            "The tea is ready when the heart is calm.",
            "Your kindness ripples like stones in a koi pond.",
            "Embrace change like the seasons - each brings its beauty.",
            "The lantern of your ideas will guide others through darkness.",
            "Small steps on the right path lead to great journeys.",
            "Your determination shines brighter than Tokyo Tower.",
            "Like the bullet train, stay focused on your destination.",
            "The crane of good fortune has chosen you.",
            "Your creativity flows like ink on washi paper.",
            "In the garden of life, you are a rare flower.",
            "The sunrise of success awaits your effort.",
            "Harmony comes to those who listen to the wind.",
            "Your next chapter will be your greatest story.",
            "Like matcha, the best things require patience to prepare.",
            "The moon does not compete with the sun - shine your own way.",
            "Your ideas are seeds that will bloom into forests.",
            "Ganbatte! Your perseverance will be rewarded.",
            "The beauty you seek is already within you.",
            "Like origami, complex beauty comes from simple folds.",
            "Your smile is a gift that costs nothing but means everything.",
            "The best adventures begin with a single curious thought."
        ]
    },

    nyc: {
        id: 'nyc',
        name: 'New York City',
        subtitle: 'Morning Vibes • Click to Explore',
        background: '/worlds/nyc/background.png',
        landmarks: [
            {
                id: "liberty_statue",
                name: "Statue of Liberty",
                description: "Lady Liberty stands tall on Liberty Island, a universal symbol of freedom and democracy. A gift from France in 1886, she has welcomed millions of immigrants to America's shores with her torch held high.",
                icon: "🗽",
                type: "landmark",
                left: "78%",
                top: "46%"
            },
            {
                id: "charging_bull",
                name: "Charging Bull",
                description: "The iconic bronze sculpture in the Financial District symbolizes the strength and power of the American people. Created by artist Arturo Di Modica, it has become a symbol of Wall Street's aggressive optimism.",
                icon: "🐂",
                type: "landmark",
                left: "66%",
                top: "78%"
            },
            {
                id: "subway_station",
                name: "Subway Entrance",
                description: "The New York City Subway - the lifeblood of the city that never sleeps. With 472 stations, it's one of the world's largest and busiest transit systems, running 24/7.",
                icon: "🚇",
                type: "transport",
                left: "18%",
                top: "76%"
            },
            {
                id: "graffiti_wall",
                name: "Street Art Wall",
                description: "New York's vibrant street art scene tells the stories of its diverse communities. From Brooklyn to the Bronx, murals and graffiti transform urban walls into outdoor galleries.",
                icon: "🎨",
                type: "decoration",
                left: "32%",
                top: "58%"
            }
        ],
        fortunes: [
            "In the city that never sleeps, your dreams are always awake.",
            "Like the subway, keep moving forward - every stop is just a pause.",
            "Your hustle is your superpower. Keep grinding.",
            "The view from the top is worth every step you climb.",
            "In a city of millions, your unique voice matters.",
            "Bold moves create bold futures. Take the leap.",
            "Like Lady Liberty, hold your light high for others to see.",
            "The concrete jungle grows those with the strongest roots.",
            "Your next big break is just one connection away.",
            "Dream as big as the Manhattan skyline.",
            "Every New Yorker started as a dreamer. Keep dreaming.",
            "The street is your stage - perform your best.",
            "Like the Brooklyn Bridge, build connections that last.",
            "Your persistence is more powerful than any obstacle.",
            "The city rewards those who show up every day.",
            "In the land of opportunity, create your own luck.",
            "Your story deserves to be told. Write it boldly.",
            "Like a yellow cab, navigate through any traffic.",
            "The artist in you is ready to create a masterpiece.",
            "Success rides the express train - hop on.",
            "Your ambition has no speed limit.",
            "Like Central Park, find peace in your own green space.",
            "The best pizza comes to those who explore new slices.",
            "Your potential rises higher than any skyscraper.",
            "If you can make it here, you can make it anywhere."
        ]
    },

    sf: {
        id: 'sf',
        name: 'San Francisco',
        subtitle: 'Misty Morning • Click to Explore',
        background: '/worlds/sf/background.png',
        landmarks: [
            {
                id: "bridge_fog",
                name: "Golden Gate Bridge",
                description: "The iconic bridge shrouded in moving sea fog, serving as a breezy coastal photo spot. Built in 1937, this Art Deco masterpiece spans 1.7 miles across the Golden Gate strait.",
                icon: "🌉",
                type: "landmark",
                left: "8%",
                top: "38%"
            },
            {
                id: "cable_car_track",
                name: "Historic Cable Car",
                description: "A classic cable car traveling along the steep city tracks. San Francisco's cable cars are the world's last manually operated cable car system and a National Historic Landmark.",
                icon: "🚃",
                type: "landmark",
                left: "32%",
                top: "58%"
            },
            {
                id: "inspiration_cafe",
                name: "Inspiration Coffee Shop",
                description: "A cozy cafe where creative minds gather. Stop by for a warm cup and an Inspiration Fortune to fuel your next big idea!",
                icon: "☕",
                type: "building",
                left: "60%",
                top: "75%"
            },
            {
                id: "idea_lab",
                name: "Idea Lab Garage",
                description: "A secret garage where innovation happens! Many of Silicon Valley's greatest companies started in garages just like this one. Click for an inspiring fortune!",
                icon: "💡",
                type: "building",
                left: "52%",
                top: "32%"
            }
        ],
        fortunes: [
            "Your next idea will change someone's world. Start today.",
            "The fog clears for those who keep moving forward.",
            "Innovation is just creativity with courage.",
            "Every masterpiece starts with a single brushstroke.",
            "Your unique perspective is your superpower.",
            "The best way to predict the future is to create it.",
            "Collaboration turns good ideas into great realities.",
            "Today's experiment is tomorrow's breakthrough.",
            "Your curiosity will open unexpected doors.",
            "The journey of a thousand apps begins with one line of code.",
            "Dream in pixels, build in purpose.",
            "Every expert was once a beginner. Keep learning.",
            "Your creativity has no boundaries—only horizons.",
            "The world needs what only you can create.",
            "Take the steep hill. The view is worth it.",
            "Innovation happens when you question the obvious.",
            "Your next breakthrough is hiding in plain sight.",
            "Build something that makes you proud.",
            "The best time to start is now. The second best is also now.",
            "Let your failures be stepping stones, not stop signs.",
            "You're closer to your goal than you think.",
            "Magic happens outside your comfort zone.",
            "Today's wild idea is tomorrow's new normal.",
            "Create with heart. Code with purpose.",
            "The mist reveals paths to those who wait with vision."
        ]
    }
};

export const getCityData = (soulCityString: string): CityData | null => {
    const lower = soulCityString.toLowerCase();
    if (lower.includes('london')) return CITIES.london;
    if (lower.includes('tokyo')) return CITIES.tokyo;
    if (lower.includes('york')) return CITIES.nyc;
    if (lower.includes('francisco')) return CITIES.sf;
    return null;
};
