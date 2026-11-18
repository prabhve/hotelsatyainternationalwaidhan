# Security Specification — Hotel Satya International

## 1. Data Invariants
1. **User Profiles (`/users/{userId}`)**: A profile document may only be read or written by the authenticated, email-verified owner (`request.auth.uid == userId`) or a verified admin. Self-assigned roles are strictly blocked (`role == 'guest'` only on creation, immutable thereafter).
2. **Bookings (`/bookings/{bookingId}`)**: Reservations contain guest PII (`guestName`, `guestEmail`, `guestPhone`) and pricing (`totalInr`). Only the authenticated owner (`resource.data.userId == request.auth.uid`) or a verified admin may `get`, `list`, or `update` a booking. Bookings must start with `status == 'pending'`, valid `YYYY-MM-DD` dates, positive nights/adults, and server-verified `request.time` timestamps. Terminal status `'cancelled'` locks the document against non-admin mutations.
3. **Reviews (`/reviews/{reviewId}`)**: Publicly readable hospitality feedback with zero PII. Authenticated, email-verified users may create reviews only for themselves (`userId == request.auth.uid`) with `verifiedStay == false` and `ownerReply == ""`, and ratings strictly bounded between `1` and `5`. Only admins may toggle `verifiedStay` or post `ownerReply`.
4. **Event Inquiries (`/inquiries/{inquiryId}`)**: Banquet and corporate event inquiries contain contact PII and may only be read, listed, or created by the authenticated owner or verified admin.
5. **Admins (`/admins/{adminId}`)**: Admin markers cannot be created, updated, or deleted via client SDKs.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unverified Email Booking**: `create /bookings/b1` where `request.auth.token.email_verified == false` -> `PERMISSION_DENIED`.
2. **Identity Spoofing on Booking**: `create /bookings/b2` with `userId: "victim_uid"` while signed in as `"attacker_uid"` -> `PERMISSION_DENIED`.
3. **Shadow Field Injection on Review**: `create /reviews/r1` containing extra field `isFeatured: true` -> `PERMISSION_DENIED`.
4. **Self-Verify Review Privilege Escalation**: `create /reviews/r2` with `verifiedStay: true` or `ownerReply: "Official"` -> `PERMISSION_DENIED`.
5. **Admin Role Self-Escalation**: `create /users/attacker` with `role: "admin"` -> `PERMISSION_DENIED`.
6. **Blanket List Query on Bookings**: `list /bookings` without `where('userId', '==', auth.uid)` as a non-admin -> `PERMISSION_DENIED`.
7. **PII Read on Another User**: `get /users/other_uid` as non-admin -> `PERMISSION_DENIED`.
8. **Timestamp Forgery**: `create /bookings/b3` with backdated `createdAt` (`!= request.time`) -> `PERMISSION_DENIED`.
9. **Booking Status Shortcutting**: `create /bookings/b4` with `status: "confirmed"` directly from guest client -> `PERMISSION_DENIED`.
10. **Terminal State Mutation**: `update /bookings/b5` changing `status` after `existing().status == "cancelled"` as non-admin -> `PERMISSION_DENIED`.
11. **Path ID Poisoning**: `create /bookings/invalid$id#with!chars` or 1.5KB ID -> `PERMISSION_DENIED`.
12. **Value Poisoning on Guest Review**: `update /reviews/r3` setting `rating: 999` or 2KB `title` -> `PERMISSION_DENIED`.
