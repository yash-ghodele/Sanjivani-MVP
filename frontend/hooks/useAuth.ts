"use client";

import { useState, useEffect } from "react";
import {
    User,
    onAuthStateChanged,
    signInAnonymously,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        // Check for demo user first
        const demoUserJson = localStorage.getItem("demo_user");
        if (demoUserJson) {
            setUser(JSON.parse(demoUserJson) as User);
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginAnonymous = async () => {
        try {
            await signInAnonymously(auth);
            localStorage.removeItem("demo_user");
        } catch (error) {
            console.error("Anonymous login failed", error);
            throw error;
        }
    };

    const loginGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            localStorage.removeItem("demo_user");
        } catch (error) {
            console.error("Google login failed", error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            localStorage.removeItem("demo_user");
        } catch (error) {
            console.error("Email login failed", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signupWithEmail = async (email: string, password: string, name: string) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: name
            });
            localStorage.removeItem("demo_user");
        } catch (error) {
            console.error("Signup failed", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("demo_user");
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return {
        user,
        loading,
        hasMounted,
        loginAnonymous,
        loginGoogle,
        loginWithEmail,
        signupWithEmail,
        logout
    };
}
