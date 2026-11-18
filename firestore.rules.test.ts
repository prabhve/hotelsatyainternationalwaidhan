/**
 * Payload-First Security TDD specification tests for Hotel Satya International Firestore Rules.
 * Verifies the "Dirty Dozen" adversarial payloads against the 8 Pillars of Hardened Rules.
 */

export interface SecurityTestCase {
  id: string;
  name: string;
  collectionPath: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  expected: 'PERMISSION_DENIED';
  payload: Record<string, unknown>;
}

export const DIRTY_DOZEN_TESTS: SecurityTestCase[] = [
  {
    id: 'DD-01',
    name: 'Reject unverified email creating a booking',
    collectionPath: '/bookings/bk_test_01',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { email_verified: false, userId: 'u1', status: 'pending' },
  },
  {
    id: 'DD-02',
    name: 'Reject identity spoofing on booking creation',
    collectionPath: '/bookings/bk_test_02',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { authUid: 'attacker', userId: 'victim', status: 'pending' },
  },
  {
    id: 'DD-03',
    name: 'Reject shadow field injection on review',
    collectionPath: '/reviews/rev_test_01',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { userId: 'u1', rating: 5, isFeatured: true },
  },
  {
    id: 'DD-04',
    name: 'Reject non-admin setting verifiedStay or ownerReply',
    collectionPath: '/reviews/rev_test_02',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { userId: 'u1', verifiedStay: true, ownerReply: 'Thank you' },
  },
  {
    id: 'DD-05',
    name: 'Reject self-assigned admin role in user profile',
    collectionPath: '/users/u_attacker',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { uid: 'u_attacker', role: 'admin' },
  },
  {
    id: 'DD-06',
    name: 'Reject unscoped list query on bookings by non-admin',
    collectionPath: '/bookings',
    operation: 'list',
    expected: 'PERMISSION_DENIED',
    payload: { queryFilter: 'none' },
  },
  {
    id: 'DD-07',
    name: 'Reject reading another user PII profile',
    collectionPath: '/users/other_user',
    operation: 'get',
    expected: 'PERMISSION_DENIED',
    payload: { authUid: 'u1', targetUid: 'other_user' },
  },
  {
    id: 'DD-08',
    name: 'Reject client-forged createdAt timestamp',
    collectionPath: '/bookings/bk_test_08',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { createdAt: '2020-01-01T00:00:00Z' },
  },
  {
    id: 'DD-09',
    name: 'Reject guest creating pre-confirmed booking',
    collectionPath: '/bookings/bk_test_09',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { userId: 'u1', status: 'confirmed' },
  },
  {
    id: 'DD-10',
    name: 'Reject mutating cancelled terminal booking by non-admin',
    collectionPath: '/bookings/bk_cancelled',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { existingStatus: 'cancelled', newStatus: 'pending' },
  },
  {
    id: 'DD-11',
    name: 'Reject path ID poisoning with invalid characters',
    collectionPath: '/bookings/bad$id!payload',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { bookingId: 'bad$id!payload' },
  },
  {
    id: 'DD-12',
    name: 'Reject out-of-range rating value poisoning on review update',
    collectionPath: '/reviews/rev_test_12',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { rating: 99, title: 'x'.repeat(250) },
  },
];
