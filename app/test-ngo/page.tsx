"use client";

import { ngoSectors, getAllNGOs } from '@/lib/ngo-data';

export default function TestNGOPage() {
  const allNGOs = getAllNGOs();
  const sectors = Object.keys(ngoSectors);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">NGO Data Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Available Sectors:</h2>
        <ul className="list-disc list-inside">
          {sectors.map((sector) => (
            <li key={sector} className="text-gray-300">{sector}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">All NGOs ({allNGOs.length}):</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allNGOs.map((ngo) => (
            <div key={ngo.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="text-4xl mb-4">{ngo.icon}</div>
              <h3 className="text-xl font-bold mb-2">{ngo.name}</h3>
              <p className="text-gray-300 text-sm mb-4">{ngo.description}</p>
              <div className="text-xs text-gray-400">
                <p><strong>Type:</strong> {ngo.type}</p>
                <p><strong>Sector:</strong> {ngo.sector}</p>
                <p><strong>Status:</strong> {ngo.status}</p>
                {ngo.videoUrl && (
                  <p><strong>Video URL:</strong> {ngo.videoUrl}</p>
                )}
                {ngo.website && (
                  <p><strong>Website:</strong> {ngo.website}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Raw NGO Data:</h2>
        <pre className="bg-gray-800 p-4 rounded-lg overflow-auto text-xs">
          {JSON.stringify(ngoSectors, null, 2)}
        </pre>
      </div>
    </div>
  );
}
