"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUserFromStorage } from "../../redux/features/authSlice";

export default function AuthLoader() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadUserFromStorage());
    }, [dispatch]);

    return null;
}