# Backend For Embedded System

Backend Server made with express and mongoose for use in Embedded System.

## How to Use

To use this repository, clone this repo into your machine

```bash
git clone https://github.com/ando-hunterz/EmbeddedSystem_Backend.git
```

then use your default npm install to install the required modules

```bash
npm install
```

## API Function

### Auth Endpoint

Used for user related usage

### Login

login the user

* **URL**
 `/api/auth/login`
* **Method**
  `POST`
* **Data Params**

  ```json
  {
      "username": username,
      "password": password
  }
  ```

* **Success Response**
  Status Code : **200**
  Content:

  ```json
  {
      "db_id": database_id, 
      "jwtToken": jwtToken
  }
  ```

* **Error Response**
  Status Code: **400**
  Content:

  ```json
  { 
      "messages": [message], 
      "fields": [error_fields] 
  }
  ```

## Logging User Endpoint

Used for logging user from NodeMCU

### Log User

Logging User to database

* **URL**
 `/api/userlog/:db_id`
* **Method**
  `POST`
* **URL Params**
  ``db_id=database_name``
* **Data Params**

  ```json
  {
      "uid": uid,
      "temperature": temperature,
      "status": "Ok"/"Warning"
  }
  ```

* **Success Response**
  Status Code : **200**
  Content:

  ```json
  {
      message: "User Submitted", 
      user: {
        "_id": id,
        "uid": uid,
        "temperature": temperature,
        "status": "Ok"/"Warning",
        "createdAt": createDate,
        "updatedAt": updateDate,
        "__v": 0,
        "id": id
    }
  }
  ```

* **Error Response**
  Status Code: **400**
  Content:

  ```json
  { 
      "messages": [message], 
      "fields": [error_fields] 
  }
  ```
