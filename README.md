# NNPTUDM-day6

API auth da duoc cap nhat voi:
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/change-password`

JWT su dung thuat toan `RS256` voi cap khoa RSA 2048-bit trong thu muc `keys/`.

## Chay local

```bash
npm install
npm run seed
npm start
```

Base URL:

```text
http://127.0.0.1:3000
```

Tai khoan test:

```text
username: postmanuser
password: Password@123
newPassword de test doi mat khau: Newpass@123
```

Postman collection:

```text
postman/NNPTUDM-day6.postman_collection.json
```
