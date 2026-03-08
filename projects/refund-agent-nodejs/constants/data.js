const data = [
  {
    id: "2009c96c803e66c72251c87a7f05a7d8",
    value: {
      actionRequests: [
        {
          name: "refund",
          args: {
            emails: ["john.doe@example.com", "mike.chen@example.com"],
          },
          description:
            'Refund pending approval\n\nTool: refund\nArgs: {\n  "emails": [\n    "john.doe@example.com",\n    "mike.chen@example.com"\n  ]\n}',
        },
      ],
      reviewConfigs: [
        {
          actionName: "refund",
          allowedDecisions: ["approve", "edit", "reject"],
        },
      ],
    },
  },
];

`
 Refund pending approval
Tool: refund
Args: {"emails": ["john.doe@example.com","mike.chen@example.com"]}
Choose:
1. approve
2. reject

`

const obj = {
  resume : {
    'interruptId' : {decisions: [{type: 'approve'}]}
  }
}

 resume[interrupt.id] = { decisions: [{ type: "approve" }] };