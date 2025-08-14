#!/usr/bin/env tsx

import { ngoSectors, getAllNGOs, searchNGOs, getNGOsBySector } from '../lib/ngo-data';

console.log('🚀 BEAM Network NGO Grid System Demo\n');

// Display all sectors
console.log('📊 NGO Sectors:');
Object.keys(ngoSectors).forEach((sector, index) => {
  const ngos = ngoSectors[sector as keyof typeof ngoSectors];
  console.log(`  ${index + 1}. ${sector} (${ngos.length} NGOs)`);
});

console.log('\n🔍 Search Demo:');
console.log('Searching for "health"...');
const healthResults = searchNGOs('health');
console.log(`Found ${healthResults.length} NGOs:`);
healthResults.forEach(ngo => {
  console.log(`  - ${ngo.name} (${ngo.sector})`);
});

console.log('\n🌱 Sector Filter Demo:');
console.log('Environmental & Sustainability NGOs:');
const envNGOs = getNGOsBySector('Environmental & Sustainability');
envNGOs.forEach(ngo => {
  console.log(`  - ${ngo.name}: ${ngo.description}`);
});

console.log('\n📈 Impact Summary:');
const allNGOs = getAllNGOs();
const totalProjects = allNGOs.reduce((sum, ngo) => sum + (ngo.impact?.projects || 0), 0);
const totalCommunities = allNGOs.reduce((sum, ngo) => sum + (ngo.impact?.communities || 0), 0);
const totalVolunteers = allNGOs.reduce((sum, ngo) => sum + (ngo.impact?.volunteers || 0), 0);

console.log(`  Total Projects: ${totalProjects}`);
console.log(`  Total Communities: ${totalCommunities}`);
console.log(`  Total Volunteers: ${totalVolunteers.toLocaleString()}`);

console.log('\n🎨 Card Types Distribution:');
const typeCounts = allNGOs.reduce((counts, ngo) => {
  counts[ngo.type] = (counts[ngo.type] || 0) + 1;
  return counts;
}, {} as Record<string, number>);

Object.entries(typeCounts).forEach(([type, count]) => {
  console.log(`  ${type}: ${count} NGOs`);
});

console.log('\n🔗 ReadyAimGo Integration:');
const ngosWithLinks = allNGOs.filter(ngo => ngo.readyaimgoLink);
console.log(`${ngosWithLinks.length} NGOs have ReadyAimGo profile links`);

console.log('\n✨ Demo Complete! The new NGO grid system is ready to use.');
console.log('Visit the landing page to see the interactive grid in action.');
