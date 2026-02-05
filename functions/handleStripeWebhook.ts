import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY'));
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

Deno.serve(async (req) => {
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    const base44 = createClientFromRequest(req);

    let event;
    try {
        event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            webhookSecret
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const userId = session.metadata.user_id;
                const customerId = session.customer;

                await base44.asServiceRole.entities.User.update(userId, {
                    is_premium: true,
                    stripe_customer_id: customerId
                });
                break;
            }

            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                const customerId = subscription.customer;

                // Finde User anhand von Stripe Customer ID
                const users = await base44.asServiceRole.entities.User.filter({
                    stripe_customer_id: customerId
                });

                if (users.length > 0) {
                    const user = users[0];
                    const expiresAt = new Date(subscription.current_period_end * 1000).toISOString();

                    await base44.asServiceRole.entities.User.update(user.id, {
                        is_premium: subscription.status === 'active',
                        premium_expires_at: expiresAt,
                        stripe_subscription_id: subscription.id
                    });
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const customerId = subscription.customer;

                const users = await base44.asServiceRole.entities.User.filter({
                    stripe_customer_id: customerId
                });

                if (users.length > 0) {
                    const user = users[0];
                    await base44.asServiceRole.entities.User.update(user.id, {
                        is_premium: false,
                        premium_expires_at: null,
                        stripe_subscription_id: null
                    });
                }
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                const customerId = invoice.customer;

                const users = await base44.asServiceRole.entities.User.filter({
                    stripe_customer_id: customerId
                });

                if (users.length > 0) {
                    const user = users[0];
                    await base44.asServiceRole.entities.User.update(user.id, {
                        is_premium: false
                    });
                }
                break;
            }
        }

        return Response.json({ received: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});