# BEAM OS Data Architecture

## Overview
The system uses a hybrid approach with Supabase and Sanity serving different purposes:

### Supabase (Operational Data)
- **Purpose**: Core application data, user management, real-time features
- **Contains**: 
  - Basic advisor profiles
  - Projects and participants
  - Authentication data
  - Operational metrics

### Sanity (Content Management)
- **Purpose**: Rich content, media, community contributions
- **Contains**:
  - Detailed biographies (PortableText)
  - Timeline events with rich formatting
  - Media galleries
  - Community-submitted content
  - Memorial-specific content

### Data Flow
1. **Basic Info**: Stored in Supabase for fast queries
2. **Rich Content**: Stored in Sanity for flexible content management
3. **Linking**: `sanity_person_id` field connects the two systems
4. **Rendering**: Application combines both sources for complete memorial pages

## Example Data Distribution

### Supabase Record:
\`\`\`json
{
  "id": "uuid-123",
  "slug": "minerva-haugabrooks",
  "full_name": "Dr. Minerva Haugabrooks",
  "role": "Community Development Strategist",
  "bio": "Short bio for listings...",
  "specialties": ["Community Development", "Urban Planning"],
  "sanity_person_id": "minerva-haugabrooks-person"
}
\`\`\`

### Sanity Document:
\`\`\`json
{
  "_id": "minerva-haugabrooks-person",
  "_type": "person",
  "fullName": "Dr. Minerva Haugabrooks",
  "detailedBio": [/* Rich text blocks */],
  "timeline": [/* Timeline events */],
  "media": [/* Media items */],
  "contributions": [/* Community contributions */]
}
\`\`\`

## Benefits of This Approach
- **Performance**: Fast queries for listings (Supabase)
- **Flexibility**: Rich content editing (Sanity)
- **Scalability**: Each system optimized for its purpose
- **Community**: Easy content contribution via Sanity
