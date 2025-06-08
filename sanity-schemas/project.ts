export default {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "summary",
      title: "Summary",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Planning", value: "planning" },
          { title: "Active", value: "active" },
          { title: "Archived", value: "archived" },
        ],
      },
      initialValue: "planning",
    },
    {
      name: "projectType",
      title: "Project Type",
      type: "string",
      options: {
        list: [
          "Manufacturing",
          "Housing",
          "Creative",
          "Tech",
          "Agriculture",
          "Infrastructure",
          "Sustainability",
          "Cultural",
        ],
      },
    },
    {
      name: "nodeId",
      title: "Node ID",
      type: "string",
    },
    {
      name: "podId",
      title: "Pod ID",
      type: "string",
    },
    {
      name: "budget",
      title: "Budget",
      type: "number",
    },
    {
      name: "raised",
      title: "Amount Raised",
      type: "number",
      initialValue: 0,
    },
    {
      name: "media",
      title: "Media",
      type: "array",
      of: [{ type: "image" }],
    },
  ],
}
