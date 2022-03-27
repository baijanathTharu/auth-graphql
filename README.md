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
