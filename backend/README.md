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

## todo fixes

- handle free plan short circuit around fga check
- pro subscripton = basic + pro tuples
- use cust_id instead of email for stripe transactions
