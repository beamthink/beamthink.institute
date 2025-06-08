export default {
  name: "person",
  title: "Person",
  type: "document",
  fields: [
    {
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "detailedBio",
      title: "Detailed Biography",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "birthYear",
      title: "Birth Year",
      type: "number",
    },
    {
      name: "deathYear",
      title: "Death Year",
      type: "number",
    },
    {
      name: "specialties",
      title: "Specialties",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "keyWorks",
      title: "Key Works",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "quotes",
      title: "Notable Quotes",
      type: "array",
      of: [{ type: "text" }],
    },
    {
      name: "timeline",
      title: "Timeline Events",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "year", title: "Year", type: "number" },
            { name: "title", title: "Title", type: "string" },
            { name: "description", title: "Description", type: "text" },
            {
              name: "category",
              title: "Category",
              type: "string",
              options: {
                list: [
                  { title: "Education", value: "education" },
                  { title: "Career", value: "career" },
                  { title: "Achievement", value: "achievement" },
                  { title: "Publication", value: "publication" },
                  { title: "Legacy", value: "legacy" },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      name: "media",
      title: "Media Gallery",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "description", title: "Description", type: "text" },
            {
              name: "type",
              title: "Media Type",
              type: "string",
              options: {
                list: [
                  { title: "Image", value: "image" },
                  { title: "Video", value: "video" },
                  { title: "Audio", value: "audio" },
                  { title: "Document", value: "document" },
                ],
              },
            },
            { name: "asset", title: "File", type: "file" },
          ],
        },
      ],
    },
    {
      name: "contributions",
      title: "Community Contributions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "type",
              title: "Contribution Type",
              type: "string",
              options: {
                list: [
                  { title: "Memory", value: "memory" },
                  { title: "Quote", value: "quote" },
                  { title: "Document", value: "document" },
                  { title: "Media", value: "media" },
                ],
              },
            },
            { name: "title", title: "Title", type: "string" },
            { name: "content", title: "Content", type: "text" },
            { name: "contributorName", title: "Contributor Name", type: "string" },
            { name: "contributorEmail", title: "Contributor Email", type: "email" },
            { name: "submittedAt", title: "Submitted At", type: "datetime" },
            { name: "approved", title: "Approved", type: "boolean", initialValue: false },
            { name: "tags", title: "Tags", type: "array", of: [{ type: "string" }] },
          ],
        },
      ],
    },
    {
      name: "chatPersonality",
      title: "AI Chat Personality",
      type: "text",
      description: "How this person's AI agent should behave in conversations",
    },
    {
      name: "voiceCharacteristics",
      title: "Voice Characteristics",
      type: "text",
      description: "Description of how this person's voice should sound",
    },
  ],
}
