import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import adReducer from "./features/adSlice";
import publicAdReducer from "./features/publicAdSlice";
import adInteractionReducer from "./features/adInteractionSlice";
import savedAdsReducer from "./features/savedAdsSlice";
import agentReducer from "./features/agentSlice";
import homeAdsReducer from "./features/homeAdsSlice";
import contactReducer from "./features/contactSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ads: adReducer,
        publicAds: publicAdReducer,
        adInteraction: adInteractionReducer,
        savedAds: savedAdsReducer,
        agents: agentReducer,
        homeAds: homeAdsReducer,
        contact: contactReducer,

    },
});