import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getOptimalSupplier = (templateId: number, quantity: number, maxLeadTime: number) => {
    return apiClient.get('/suppliers/optimal', {
        params: { templateId, requiredQuantity: quantity, maxLeadTime }
    });
};

export const placeOrder = (customerId: number, templateId: number, quantity: number, maxLeadTime: number) => {
    return apiClient.post(`/orders/place?customerId=${customerId}&templateId=${templateId}&quantity=${quantity}&maxLeadTime=${maxLeadTime}`);
};