# Firestore Security Specifications

## 1. Data Invariants

- **User profile access control**: Any authenticated user can read public components of user profiles or their own private user profile. Users can ONLY write (create/update) their own profiles (`request.auth.uid == userId`). No user is allowed to modify the `isAdmin` state.
- **Lead creations**: Anyone can submit a lead compilation or a brand audit. Creating a lead requires filling the compulsory identifier strings (`name`, `email`, `phone`, `businessName`).
- **Lead list access control**: Only verified administrative accounts can fetch lists or details of queries (`leads` and `messages`) to prevent scraping.
- **Message creation**: Message submissions are write-only for clients. No standard client is allowed to read or update messages once they have been written to avoid context leaks.

---

## 2. The "Dirty Dozen" Payloads

Here are twelve payloads designed to test our rule boundaries:

1. **Self-Elevating Admin Profile**: Let user `john_doe` write `{ "isAdmin": true }` to their profile. (Should fail)
2. **Identity Spoofing Profile**: Let user `attacker_xyz` write to `/users/victim_123`. (Should fail)
3. **Invalid Email Profile**: Create user with `email` = `not-an-email`. (Should fail)
4. **Giant Payload Denying Wallet**: A lead creation containing a `name` larger than 500 characters. (Should fail)
5. **ID Poisoning Lead**: Create a lead under `/leads/poison_#$@%_char`. (Should fail)
6. **Bypassing Mandatory Keys**: Create a lead missing the `phone` field. (Should fail)
7. **Fake Admin Access Leads**: Let non-admin `john_doe` call `list` or `get` on `/leads/` collection. (Should fail)
8. **Fake Admin Access Messages**: Let non-admin `john_doe` query or fetch any messages under `/messages/`. (Should fail)
9. **Message Mutation**: Attackers editing written contact message content. (Should fail)
10. **Temporal Integrity Breach**: Sign up a user with `createdAt` explicitly set to a historical date like `1999-01-01`. (Should fail)
11. **Malicious Empty Fields on Message**: Send message with an empty or short subject/message. (Should fail)
12. **Out of Boundary Score Poisoning**: Forcing updates to AI-generated fields or system states. (Should fail)

---

## 3. Test Cases (Represented abstractly for Firestore security boundaries verification)

```typescript
// All target cases represent validations checking for:
// - auth != null
// - isUserOwner(userId)
// - isAdmin()
// - isValidId(id)
// - isValidString(str, min, max)
// - isStringSizeVerified()
```
