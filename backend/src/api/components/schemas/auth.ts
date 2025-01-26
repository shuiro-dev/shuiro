import { z } from "@hono/zod-openapi"

export const Credential = z
  .object({
    id: z.string(),
    rawId: z.string(),
    type: z.literal("public-key"),
  })
  .openapi("Credential")

export const AuthenticationCredential = Credential.extend({
  response: z.object({
    authenticatorData: z.string(),
    clientDataJSON: z.string(),
    signature: z.string(),
    userHandle: z.string().optional(),
  }),
}).openapi("AuthenticationCredential")

export const RegistrationCredential = Credential.extend({
  response: z.object({
    attestationObject: z.string(),
    clientDataJSON: z.string(),
  }),
}).openapi("RegistrationCredential")

export const UserRegistration = z
  .object({
    email: z.string().email(),
    name: z.string(),
    role: z.enum(["admin", "teacher", "student"]),
  })
  .openapi("UserRegistration")

export const AuthenticationChallenge = z
  .object({
    challenge: z.string(),
  })
  .openapi("AuthenticationChallenge")

export const AuthenticationResponse = z
  .object({
    token: z.string(),
  })
  .openapi("AuthenticationResponse")
