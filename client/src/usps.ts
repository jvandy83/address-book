import USPS from 'usps-webtools';

export const usps = new USPS({
	server: 'http://production.shippingapis.com/ShippingAPI.dll',
	userId: '128WEBWE2101',
	ttl: 10000,
});
