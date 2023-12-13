This folder is special.

It's designed to help new projects link Google, Slack and other integrations
without having to first setup their own projects, for development

Here's an example.

If you want to send emails through GMail, you need to go through a somewhat
tedious process of creating an app inside their console and doing a whole lot
of configuration to get it working.

Same thing for Slack: you need to create an app, register a callback, and more.

In addition to that, you need to have a working domain, working SSL, and more.
It's a giant configuration pain, and if you're just getting started.

This folder is designed specifically to enable new projects to get the credentials
they need for development and testing, even if only working on localhost, without
having to go through the pain of setting all that stuff up.

We offer this for the three core integrations that are generally needed:

Google
Stripe
Slack

How It Works
------------

SaaS Product has existing Apps defined for Google, Stripe and Slack, with pre-registered
OAuth callbacks.
