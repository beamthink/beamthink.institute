export default {
  name: "node",
  title: "Node",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "ngo",
      title: "NGO",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "pod",
      title: "Pod",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "mission",
      title: "Mission",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "location",
      title: "Location",
      type: "object",
      fields: [
        { name: "city", title: "City", type: "string" },
        { name: "status", title: "Status", type: "string" },
        { name: "lotSize", title: "Lot Size", type: "string" },
        { name: "type", title: "Type", type: "string" },
        { name: "coordinates", title: "Coordinates", type: "string" },
        { name: "description", title: "Description", type: "text" },
      ],
    },
  ],
}
