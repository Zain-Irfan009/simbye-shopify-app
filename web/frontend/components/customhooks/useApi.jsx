// useApi.js
import { useState, useCallback } from 'react';
import axios from 'axios';
import { getSessionToken } from "@shopify/app-bridge/utilities";
import { useToast } from '@shopify/app-bridge-react';
const useApi = (appBridge, url) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { show } = useToast();
    const callApi = useCallback(async (endpoint, method, data) => {
        setLoading(true);
        setError(null);
        try {
            const sessionToken = await getSessionToken(appBridge);
            const headers = {
                "Authorization": `Bearer ${sessionToken}`,
                "Content-Type": 'multipart/form-data',
            };
            const response = await axios({ url: `${url}/${endpoint}`, method, data, headers });
            return response.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [appBridge, url]);

    return { callApi,loading, error };
};

export default useApi;
