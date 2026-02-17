## FGA model

```bash
model
  schema 1.1

type user

type plan
  relations
    define member: [user] or member from parent
    define parent: [plan]

type blog
  relations
    define owner: [user]
    define required_plan: [plan]
    define can_read: owner or member from required_plan
```

## System Tuple

```bash
Object: plan:basic
Relation: parent
User: plan:pro
```

## mock stripe card vals

Field,Value
Card Number,4242 4242 4242 4242
Expiry Date,"Any future date (e.g., 12/30)"
CVC,"Any 3 digits (e.g., 123)"
ZIP Code,Any valid-looking 5-digit code

## stripe cli command for webhook

`stripe listen --forward-to localhost:5000/api/payment/webhook`

## todo fixes

- simulate stripe failures
- handle double subscription & cancel sub
