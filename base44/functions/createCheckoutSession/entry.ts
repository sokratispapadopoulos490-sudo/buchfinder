import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY'));

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { priceId } = await req.json();
        
        if (!priceId) {
            return Response.json({ error: 'Price ID required' }, { status: 400 });
        }

        // Erstelle oder verwende existierende Stripe Customer ID
        let customerId = user.stripe_customer_id;
        
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    user_id: user.id,
                    app_id: Deno.env.get('BASE44_APP_ID')
                }
            });
            customerId = customer.id;
            
            // Speichere Customer ID
            await base44.auth.updateMe({ stripe_customer_id: customerId });
        }

        // Erstelle Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card', 'sepa_debit'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${req.headers.get('origin')}?premium=success`,
            cancel_url: `${req.headers.get('origin')}?premium=cancelled`,
            metadata: {
                user_id: user.id
            }
        });

        return Response.json({ url: session.url });
    } catch (error) {
        console.error('Checkout error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});