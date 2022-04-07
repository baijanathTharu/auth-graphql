# Authentication with Access Token and Refresh Token

Simple Example of token based authentication with token rotation

## Test the authentication with following resolvers

```graphql
query me {
  me {
    id
    name
    email
  }
}

mutation signUp {
  signUp(
    signUpInput: {
      email: "ram@test.com"
      name: "ram"
      password: "ram@Password"
    }
  ) {
    done
  }
}

mutation login {
  login(loginInput: { email: "ram@test.com", password: "ram@Password" }) {
    done
    accessToken
    refreshToken
  }
}

query newToken {
  newToken {
    done
    accessToken
    refreshToken
  }
}
```

## Testing the prescription

### Creating Prescription By doctor

If user has not DOCTOR role, he will be forbidden to create prescription.

```graphql
mutation createPrescription {
  createPrescription(
    input: { prescribedTo: 3, prescribedBy: 4, prescription: "one" }
  ) {
    data {
      id
      prescribedTo {
        id
        name
      }
      prescribedBy {
        id
        name
      }
      prescription
    }
  }
}
```
