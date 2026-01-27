
// lib/firebase/auth.js
import {
    auth,
    db,
    googleLogin,
    githubLogin,
    getCurrentUser,
    logout
} from '@/app/db/settings';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit
} from 'firebase/firestore';

export class FirebaseAuthService {
    constructor() {
        this.auth = auth;
        this.db = db;
    }

    // ============ SOCIAL LOGIN ============
    async signInWithGoogle() {
        try {
            const user = await googleLogin();

            // Additional user data setup
            await this.ensureUserProfile(user.uid, {
                email: user.email,
                name: user.displayName,
                avatar: user.photoURL,
                emailVerified: true,
                emailVerifiedAt: new Date(),
                lastLoginAt: new Date()
            });

            return {
                user,
                isNewUser: await this.isNewUser(user.uid)
            };
        } catch (error) {
            console.error('Google sign-in error:', error);
            throw error;
        }
    }

    async signInWithGithub() {
        try {
            const user = await githubLogin();

            // Additional user data setup
            await this.ensureUserProfile(user.uid, {
                email: user.email,
                name: user.displayName,
                avatar: user.photoURL,
                emailVerified: true,
                emailVerifiedAt: new Date(),
                lastLoginAt: new Date()
            });

            return {
                user,
                isNewUser: await this.isNewUser(user.uid)
            };
        } catch (error) {
            console.error('GitHub sign-in error:', error);
            throw error;
        }
    }

    // ============ EMAIL/PASSWORD LOGIN ============
    async signInWithEmail(email, password) {
        try {
            // Import here to avoid SSR issues
            const { signInWithEmailAndPassword } = await import('firebase/auth');

            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;

            // Update user profile
            await this.updateUserProfile(user.uid, {
                lastLoginAt: new Date(),
                failedLoginAttempts: 0,
                lockedUntil: null
            });

            return {
                user,
                isEmailVerified: user.emailVerified
            };
        } catch (error) {
            console.error('Email sign-in error:', error);
            throw error;
        }
    }

    // ============ REGISTRATION ============
    async registerWithEmail(data) {
        try {
            // Import here to avoid SSR issues
            const { createUserWithEmailAndPassword, sendEmailVerification } = await import('firebase/auth');

            // Check if username exists
            if (data.username) {
                const usernameExists = await this.checkUsernameExists(data.username);
                if (usernameExists) {
                    throw new Error('Username already taken');
                }
            }

            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                this.auth,
                data.email,
                data.password
            );

            const user = userCredential.user;

            // Create user profile in Firestore
            await this.createUserProfile(user.uid, {
                email: data.email,
                name: data.name,
                username: data.username,
                emailVerified: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Create user preferences
            await this.createUserPreferences(user.uid);

            // Send verification email
            await sendEmailVerification(user);

            return {
                id: user.uid,
                email: data.email,
                name: data.name,
                username: data.username,
                message: 'Registration successful. Please check your email for verification.'
            };
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // ============ PASSWORD MANAGEMENT ============
    async resetPassword(email) {
        try {
            const { sendPasswordResetEmail } = await import('firebase/auth');
            await sendPasswordResetEmail(this.auth, email);
            return { message: 'Password reset email sent' };
        } catch (error) {
            console.error('Password reset error:', error);
            throw error;
        }
    }

    // ============ PROFILE MANAGEMENT ============
    async updateProfile(data) {
        const user = this.auth.currentUser;

        if (!user) {
            throw new Error('No user logged in');
        }

        try {
            const { updateProfile: updateAuthProfile } = await import('firebase/auth');

            // Update Firebase Auth profile
            if (data.name) {
                await updateAuthProfile(user, {
                    displayName: data.name
                });
            }

            // Update Firestore profile
            await this.updateUserProfile(user.uid, data);

            return { message: 'Profile updated successfully' };
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    }

    // ============ LOGOUT ============
    async logout() {
        try {
            await logout();
            return { message: 'Logged out successfully' };
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    // ============ HELPER METHODS ============
    async ensureUserProfile(uid, data) {
        const userRef = doc(this.db, 'users', uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            await setDoc(userRef, {
                uid,
                ...data,
                status: 'ACTIVE',
                role: 'USER',
                plan: 'FREE',
                createdAt: new Date(),
                updatedAt: new Date()
            });
        } else {
            await updateDoc(userRef, {
                ...data,
                updatedAt: new Date()
            });
        }
    }

    async createUserProfile(uid, data) {
        const userRef = doc(this.db, 'users', uid);
        await setDoc(userRef, {
            uid,
            ...data,
            status: 'PENDING_VERIFICATION',
            role: 'USER',
            plan: 'FREE',
            twoFactorEnabled: false,
            failedLoginAttempts: 0,
            timezone: 'UTC',
            language: 'en',
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    async createUserPreferences(uid) {
        const prefRef = doc(this.db, 'user-preferences', uid);
        await setDoc(prefRef, {
            userId: uid,
            theme: 'light',
            language: 'en',
            timeFormat: '24h',
            dateFormat: 'YYYY-MM-DD',
            emailNotifications: true,
            pushNotifications: true,
            desktopNotifications: true,
            defaultDelimiter: ',',
            defaultEncoding: 'utf-8',
            autoSave: true,
            autoSaveInterval: 30,
            showInDirectory: false,
            dataSharing: 'PRIVATE',
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    async updateUserProfile(uid, data) {
        const userRef = doc(this.db, 'users', uid);
        await updateDoc(userRef, {
            ...data,
            updatedAt: new Date()
        });
    }

    async isNewUser(uid) {
        const userRef = doc(this.db, 'users', uid);
        const userDoc = await getDoc(userRef);
        return !userDoc.exists();
    }

    async checkUsernameExists(username) {
        const usersQuery = query(
            collection(this.db, 'users'),
            where('username', '==', username),
            limit(1)
        );

        const snapshot = await getDocs(usersQuery);
        return !snapshot.empty;
    }

    // ============ GET USER DATA ============
    async getUserProfile(userId) {
        const uid = userId || this.auth.currentUser?.uid;

        if (!uid) {
            throw new Error('No user specified');
        }

        try {
            const userRef = doc(this.db, 'users', uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                throw new Error('User not found');
            }

            return {
                id: userDoc.id,
                ...userDoc.data()
            };
        } catch (error) {
            console.error('Error getting user profile:', error);
            throw error;
        }
    }

    async getUserPreferences(userId) {
        const uid = userId || this.auth.currentUser?.uid;

        if (!uid) {
            throw new Error('No user specified');
        }

        try {
            const prefRef = doc(this.db, 'user-preferences', uid);
            const prefDoc = await getDoc(prefRef);

            if (!prefDoc.exists()) {
                await this.createUserPreferences(uid);
                const newPrefDoc = await getDoc(prefRef);
                return newPrefDoc.data();
            }

            return prefDoc.data();
        } catch (error) {
            console.error('Error getting user preferences:', error);
            throw error;
        }
    }

    // ============ AUTH STATE ============
    onAuthStateChanged(callback) {
        return this.auth.onAuthStateChanged(callback);
    }

    getCurrentUser() {
        return this.auth.currentUser;
    }

    isAuthenticated() {
        return !!this.auth.currentUser;
    }
}

// Export singleton instance
export const authService = new FirebaseAuthService();