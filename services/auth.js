import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const subscribeAuth = (callback) => onAuthStateChanged(auth, callback);

export const signUpWithEmail = async (email, password, displayName) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }

  // Create user profile document in Firestore (id matches auth uid)
  // Do not block signup flow on this write; run in background.
  const userRef = doc(db, 'users', cred.user.uid);
  setDoc(
    userRef,
    {
      uid: cred.user.uid,
      email: cred.user.email || email,
      displayName: displayName || cred.user.displayName || '',
      photoURL: cred.user.photoURL || '',
      providerId: cred.user.providerId || 'password',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  ).catch(() => {
    // Non-fatal: log or handle silently; don't block navigation
    // console.error('Failed to create user doc', err);
  });

  return cred.user;
};

export const signInWithEmail = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const signOutUser = async () => signOut(auth);



