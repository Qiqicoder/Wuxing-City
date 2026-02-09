
import { calculateElements, determineArchetype } from './elements';

function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomName() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = Math.floor(Math.random() * 8) + 3; // 3-10 chars
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const archetypeCounts: Record<string, number> = {};
const elementCounts: Record<string, number> = { fire: 0, water: 0, wood: 0, earth: 0, metal: 0 };
const iterations = 10000;

for (let i = 0; i < iterations; i++) {
    const date = randomDate(new Date(1980, 0, 1), new Date(2005, 0, 1));
    const birthdate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    const name = randomName();

    const scores = calculateElements(birthdate, name);
    const arch = determineArchetype(scores);

    archetypeCounts[arch.name] = (archetypeCounts[arch.name] || 0) + 1;

    // Count primary elements
    elementCounts[arch.primaryElement]++;
}

console.log("--- Element Distribution ---");
for (const [elem, count] of Object.entries(elementCounts)) {
    console.log(`${elem}: ${((count / iterations) * 100).toFixed(2)}%`);
}

console.log("\n--- Archetype Distribution ---");
const sortedArchs = Object.entries(archetypeCounts).sort((a, b) => b[1] - a[1]);
for (const [arch, count] of sortedArchs) {
    console.log(`${arch}: ${((count / iterations) * 100).toFixed(2)}%`);
}
