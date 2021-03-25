# [Proca - progressive campaigning](https://proca.foundation) Donation Micro-service

A simple server side API for processing donations with Stripe.

# Prerequisites

-   Node >= 10
-   Stripe account and API credentials

# Quick Start

1. npm install

1. Configure environment in .env

  PROCA_DONATE_PORT=4000
  PROCA_DONATE_CORS_DOMAINS=[ list of domains to allow ]

  STRIPE_SECRET=...
  STRIPE_SECRET_TEST=...

1. Run donate.js

    $ node donate.js

# API

Requests should be JSON, responses are JSON.

## OPTIONS /

Pre-flight requests - will return 401 unless the Origin in congfigured in PROCA_DONATE_CORS_DOMAINS.

## POST /stripe/oneoff

Requests a PaymentIntent from Stripe. See the PaymentIntents API for the
allowed parameters. The most important are:

 - amount
 - currency


