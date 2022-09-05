The features of this microservice have been merged back into proca-server, please don't use this repository

# [Proca - progressive campaigning](https://proca.foundation) Donation Micro-service

A simple server side API for processing donations with Stripe.

# Prerequisites

-   Node >= 10
-   Stripe account and API credentials

# Quick Start

1. npm install

1. Configure environment in .env
  cp .env.example .env

The two params you need to set are the domains allowed to make donations and the stripe secret (from your stripe dashboard)

1. Run donate.js

    $ node donate.js

# API

Requests should be JSON, responses are JSON.

## OPTIONS /

Pre-flight requests - will return 401 unless the Origin is one configured in PROCA_DONATE_CORS_DOMAINS.

## POST /stripe/oneoff

Requests a PaymentIntent from Stripe. See the PaymentIntents API for the
allowed parameters. The most important are:

 - amount
 - currency

# POST /stripe/recurring

https://stripe.com/docs/billing/subscriptions/overview
https://stripe.com/docs/billing/subscriptions/fixed-price

This api wraps multiple apis
- customer
- ? price
- subscription

the product needs to be created in advance, eg "donation", and its id saved in the config of the widget, eg "prod_IpXkCCEdTaJE6X"

- product
- price 
