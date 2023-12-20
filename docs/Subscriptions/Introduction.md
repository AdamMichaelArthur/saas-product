SaaS Product makes it easy to create subscription tiers and comes with a feature-complete subscription management solution.

We use Stripe to manage payments and subscriptions, and a Stripe API Key is required for the integration to properly work.

During development, Subscription Tiers are built using code.  In production, you can dynamically edit the subscription tiers values,
but major changes must be done in code.

Initialization
--------------

Subscription Plans must be initialized.

User
----

Every user who registers is put on a Free Tier subscription plan.  Then, the user can upgrade or downgrade subscription tiers as needed