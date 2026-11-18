import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import {
  auth,
  BLUEPRINT_LIMITS,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';

export interface BookingRecord {
  bookingId: string;
  userId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  roomTitle: string;
  occupancy: 'Single' | 'Double';
  mealPlan: 'EP' | 'CP' | 'MAP' | 'AP';
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  adults: number;
  children: number;
  totalInr: number;
  specialRequests: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ReviewRecord {
  reviewId: string;
  userId: string;
  authorName: string;
  stayCategory: 'Business' | 'Family' | 'Wedding & Events' | 'Solo';
  roomStayed: string;
  rating: number;
  cleanlinessRating: number;
  diningRating: number;
  hospitalityRating: number;
  title: string;
  comment: string;
  verifiedStay: boolean;
  ownerReply: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface InquiryRecord {
  inquiryId: string;
  userId: string;
  contactName: string;
  contactPhone: string;
  venue:
    | 'Open-Air Lawn (3000 Pax)'
    | 'Grand Banquet Hall (200 Pax)'
    | 'Party Room (40 Pax)'
    | 'Executive Meeting Room (20 Pax)';
  eventDate: string;
  guestCount: number;
  notes: string;
  status: 'new' | 'reviewed';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface FirebaseContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  authError: string | null;
  bookings: BookingRecord[];
  reviews: ReviewRecord[];
  inquiries: InquiryRecord[];
  signInWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  createBooking: (
    input: Omit<BookingRecord, 'bookingId' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>
  ) => Promise<string>;
  cancelBooking: (bookingId: string) => Promise<void>;
  adminUpdateBookingStatus: (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled') => Promise<void>;
  createReview: (
    input: Omit<
      ReviewRecord,
      'reviewId' | 'userId' | 'verifiedStay' | 'ownerReply' | 'createdAt' | 'updatedAt'
    >
  ) => Promise<string>;
  deleteReview: (reviewId: string) => Promise<void>;
  adminReplyReview: (reviewId: string, ownerReply: string, verifiedStay: boolean) => Promise<void>;
  createInquiry: (
    input: Omit<InquiryRecord, 'inquiryId' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>
  ) => Promise<string>;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

const ADMIN_EMAIL = 'prabhve5@gmail.com';

function makeSafeId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${rand}`.replace(/[^a-zA-Z0-9_-]/g, '');
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);

  const isAdmin = Boolean(user?.emailVerified && user?.email === ADMIN_EMAIL);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);

      if (currentUser && currentUser.emailVerified && currentUser.email) {
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          await setDoc(
            userRef,
            {
              uid: currentUser.uid,
              displayName: (currentUser.displayName || 'Guest').slice(0, BLUEPRINT_LIMITS.DISPLAY_NAME_MAX),
              email: currentUser.email.slice(0, 160),
              photoURL: (currentUser.photoURL || '').slice(0, 500),
              role: 'guest',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch {
          // If document already exists, update mutable fields cleanly without overwriting createdAt/role
          try {
            await updateDoc(userRef, {
              displayName: (currentUser.displayName || 'Guest').slice(0, BLUEPRINT_LIMITS.DISPLAY_NAME_MAX),
              email: currentUser.email.slice(0, 160),
              photoURL: (currentUser.photoURL || '').slice(0, 500),
              updatedAt: serverTimestamp(),
            });
          } catch {
            // Non-blocking profile sync failure
          }
        }
      }
    });

    return () => unsub();
  }, []);

  // Public Reviews subscription (zero PII)
  useEffect(() => {
    const reviewsQuery = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      reviewsQuery,
      (snap) => {
        const items = snap.docs.map((d) => d.data() as ReviewRecord);
        setReviews(items);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'reviews');
      }
    );
    return () => unsub();
  }, []);

  // Authenticated Bookings subscription
  useEffect(() => {
    if (!authReady || !user) {
      setBookings([]);
      return;
    }

    const bookingsQuery = isAdmin
      ? query(collection(db, 'bookings'), orderBy('createdAt', 'desc'))
      : query(
          collection(db, 'bookings'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

    const unsub = onSnapshot(
      bookingsQuery,
      (snap) => {
        setBookings(snap.docs.map((d) => d.data() as BookingRecord));
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'bookings');
      }
    );
    return () => unsub();
  }, [authReady, user, isAdmin]);

  // Authenticated Event Inquiries subscription
  useEffect(() => {
    if (!authReady || !user) {
      setInquiries([]);
      return;
    }

    const inquiriesQuery = isAdmin
      ? query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'))
      : query(
          collection(db, 'inquiries'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

    const unsub = onSnapshot(
      inquiriesQuery,
      (snap) => {
        setInquiries(snap.docs.map((d) => d.data() as InquiryRecord));
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'inquiries');
      }
    );
    return () => unsub();
  }, [authReady, user, isAdmin]);

  const signInWithGoogle = async (): Promise<User | null> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      setAuthError(msg);
      return null;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const createBooking = async (
    input: Omit<BookingRecord, 'bookingId' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    if (!user) throw new Error('Please sign in with Google to confirm your reservation.');
    const bookingId = makeSafeId('HSI');
    const path = `bookings/${bookingId}`;

    const payload = {
      bookingId,
      userId: user.uid,
      guestName: input.guestName.trim().slice(0, BLUEPRINT_LIMITS.DISPLAY_NAME_MAX),
      guestEmail: input.guestEmail.trim().slice(0, 160),
      guestPhone: input.guestPhone.trim().slice(0, BLUEPRINT_LIMITS.GUEST_PHONE_MAX),
      roomId: input.roomId.trim().slice(0, 64),
      roomTitle: input.roomTitle.trim().slice(0, BLUEPRINT_LIMITS.ROOM_TITLE_MAX),
      occupancy: input.occupancy,
      mealPlan: input.mealPlan,
      checkInDate: input.checkInDate,
      checkOutDate: input.checkOutDate,
      nights: Math.max(1, Math.min(60, Math.round(input.nights))),
      adults: Math.max(1, Math.min(10, Math.round(input.adults))),
      children: Math.max(0, Math.min(8, Math.round(input.children))),
      totalInr: Math.max(1000, Math.min(1000000, Math.round(input.totalInr))),
      specialRequests: (input.specialRequests || '').trim().slice(0, BLUEPRINT_LIMITS.SPECIAL_REQUESTS_MAX),
      status: 'pending' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'bookings', bookingId), payload);
      return bookingId;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    const path = `bookings/${bookingId}`;
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'cancelled',
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const adminUpdateBookingStatus = async (
    bookingId: string,
    status: 'pending' | 'confirmed' | 'cancelled'
  ) => {
    const path = `bookings/${bookingId}`;
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const createReview = async (
    input: Omit<
      ReviewRecord,
      'reviewId' | 'userId' | 'verifiedStay' | 'ownerReply' | 'createdAt' | 'updatedAt'
    >
  ): Promise<string> => {
    if (!user) throw new Error('Please sign in with Google to submit a verified guest review.');
    const reviewId = makeSafeId('REV');
    const path = `reviews/${reviewId}`;

    const clampRating = (val: number) => Math.max(1, Math.min(5, Number(val.toFixed(1))));

    const payload = {
      reviewId,
      userId: user.uid,
      authorName: input.authorName.trim().slice(0, BLUEPRINT_LIMITS.AUTHOR_NAME_MAX),
      stayCategory: input.stayCategory,
      roomStayed: input.roomStayed.trim().slice(0, 80),
      rating: clampRating(input.rating),
      cleanlinessRating: clampRating(input.cleanlinessRating),
      diningRating: clampRating(input.diningRating),
      hospitalityRating: clampRating(input.hospitalityRating),
      title: input.title.trim().slice(0, BLUEPRINT_LIMITS.REVIEW_TITLE_MAX),
      comment: input.comment.trim().slice(0, BLUEPRINT_LIMITS.REVIEW_COMMENT_MAX),
      verifiedStay: false,
      ownerReply: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'reviews', reviewId), payload);
      return reviewId;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const deleteReview = async (reviewId: string) => {
    const path = `reviews/${reviewId}`;
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const adminReplyReview = async (
    reviewId: string,
    ownerReply: string,
    verifiedStay: boolean
  ) => {
    const path = `reviews/${reviewId}`;
    try {
      await updateDoc(doc(db, 'reviews', reviewId), {
        ownerReply: ownerReply.trim().slice(0, BLUEPRINT_LIMITS.OWNER_REPLY_MAX),
        verifiedStay,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const createInquiry = async (
    input: Omit<InquiryRecord, 'inquiryId' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    if (!user) throw new Error('Please sign in with Google to submit a banquet inquiry.');
    const inquiryId = makeSafeId('EVT');
    const path = `inquiries/${inquiryId}`;

    const payload = {
      inquiryId,
      userId: user.uid,
      contactName: input.contactName.trim().slice(0, BLUEPRINT_LIMITS.DISPLAY_NAME_MAX),
      contactPhone: input.contactPhone.trim().slice(0, BLUEPRINT_LIMITS.GUEST_PHONE_MAX),
      venue: input.venue,
      eventDate: input.eventDate,
      guestCount: Math.max(5, Math.min(5000, Math.round(input.guestCount))),
      notes: (input.notes || '').trim().slice(0, BLUEPRINT_LIMITS.INQUIRY_NOTES_MAX),
      status: 'new' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'inquiries', inquiryId), payload);
      return inquiryId;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        authReady,
        isAdmin,
        authError,
        bookings,
        reviews,
        inquiries,
        signInWithGoogle,
        logout,
        createBooking,
        cancelBooking,
        adminUpdateBookingStatus,
        createReview,
        deleteReview,
        adminReplyReview,
        createInquiry,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const ctx = useContext(FirebaseContext);
  if (!ctx) throw new Error('useFirebase must be used inside FirebaseProvider');
  return ctx;
}
