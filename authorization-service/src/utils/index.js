export const generatePolicy = (principalId, resource, effect) => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statemants: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: res,
        },
      ],
    },
  };
};
