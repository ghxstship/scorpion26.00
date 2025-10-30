import Client from 'shopify-buy';

let shopifyClient: any = null;

export const getShopifyClient = () => {
  if (!shopifyClient) {
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
    const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    
    if (!domain || !storefrontAccessToken) {
      console.warn('Shopify credentials not found');
      return null;
    }
    
    shopifyClient = Client.buildClient({
      domain,
      storefrontAccessToken,
      apiVersion: '2024-01',
    });
  }
  
  return shopifyClient;
};

export const fetchShopifyProducts = async (limit: number = 20) => {
  const client = getShopifyClient();
  
  if (!client) {
    throw new Error('Shopify client not initialized');
  }
  
  try {
    const products = await client.product.fetchAll(limit);
    return products;
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    throw error;
  }
};

export const fetchShopifyProduct = async (productId: string) => {
  const client = getShopifyClient();
  
  if (!client) {
    throw new Error('Shopify client not initialized');
  }
  
  try {
    const product = await client.product.fetch(productId);
    return product;
  } catch (error) {
    console.error('Error fetching Shopify product:', error);
    throw error;
  }
};

export const createShopifyCheckout = async (
  lineItems: Array<{
    variantId: string;
    quantity: number;
  }>
) => {
  const client = getShopifyClient();
  
  if (!client) {
    throw new Error('Shopify client not initialized');
  }
  
  try {
    const checkout = await client.checkout.create();
    const checkoutWithItems = await client.checkout.addLineItems(
      checkout.id,
      lineItems
    );
    return checkoutWithItems;
  } catch (error) {
    console.error('Error creating Shopify checkout:', error);
    throw error;
  }
};

export const updateShopifyCheckout = async (
  checkoutId: string,
  lineItems: Array<{
    id: string;
    quantity: number;
  }>
) => {
  const client = getShopifyClient();
  
  if (!client) {
    throw new Error('Shopify client not initialized');
  }
  
  try {
    const checkout = await client.checkout.updateLineItems(checkoutId, lineItems);
    return checkout;
  } catch (error) {
    console.error('Error updating Shopify checkout:', error);
    throw error;
  }
};
