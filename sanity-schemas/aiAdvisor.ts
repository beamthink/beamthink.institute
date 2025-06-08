export default {
  name: "aiAdvisor",
  title: "AI Advisor",
  type: "document",
  fields: [
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "fullName",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "role",
      title: "Role",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "bio",
      title: "Bio",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "detailedBio",
      title: "Detailed Bio",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "avatar",
      title: "Avatar",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "specialties",
      title: "Specialties",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      initialValue: true,
    },
  ],
}
