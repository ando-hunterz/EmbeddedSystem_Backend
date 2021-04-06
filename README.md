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

  ```json5
  {
      username: username,
      password: password
  }
  ```

* **Success Response**\
  Status Code : **200**\
  Content:

  ```json5
  {
      db_id: database_id, 
      jwtToken: jwtToken
  }
  ```

* **Error Response**\
  Status Code: **400**\
  Content:

  ```json5
  { 
      messages: [message], 
      fields: [error_fields] 
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

  ```json5
  {
      uid: uid,
      temperature: temperature,
      status: "Ok"/"Warning"
  }
  ```

* **Success Response**\
  Status Code : **200**\
  Content:

  ```json5
  {
      message: "User Submitted", 
      user: {
        _id: id,
        uid: uid,
        temperature: temperature,
        status: "Ok"/"Warning",
        createdAt: createDate,
        updatedAt: updateDate,
        __v: 0,
         id: id
    }
  }
  ```

* **Error Response**\
  Status Code: **400**\
  Content:

  ```json5
  { 
      messages: [message], 
      fields: [error_fields] 
  }
  ```

### User Endpoint

User endpoint to access database

### Get Records

Get all records of users who has logged.

* **URL**
 `/api/user/records`
* **Method**
  `GET`
* **URL Params**
  None
* **Cookie Params**
  `db_id`
* **Success Response**\
  Status Code : **200**\
  Content:

  ```json5
  [
    {
        _id: id,
        uid: uid,
        temperature: temperature,
        status: "Ok"/"Warning",
        createdAt: CreatedDate,
        updatedAt: UpdatedDate,
        __v: 0,
        userData: {
            _id: id,
            uid: uid,
            name: name,
            id: id
        },
        id: id
    },
  ]
  ```

### -- Endpoint is WIP --
### Get User Record

Get record of user who has logged.

* **URL**
 `/api/user/records/:id`
* **Method**
  `GET`
* **URL Params**
  `id=[user_id]`
* **Cookie Params**
  `db_id`
* **Success Response**\
  Status Code : **200**\
  Content:

  ```json5
  {
    _id: id,
    uid: uid,
    temperature: temperature,
    status: "Ok"/"Warning",
    createdAt: CreatedDate,
    updatedAt: UpdatedDate,
    __v: 0
  }
  ```

  * **Error Response**\
  Status Code: **400**\
  Content:

  ```json5
  { 
      messages: [message], 
      fields: [error_fields] 
  }
  ```

### Delete Record

Delete records of user who has logged.

* **URL**
 `/api/user/record/:id`
* **Method**
  `DELETE`
* **URL Params**
  `id=[user_id]`
* **Cookie Params**
  `db_id`
* **Success Response**\
  Status Code : **200**\
  Content:

  `Record with id 606b2e9cc9c161485cefeda8 has been deleted`

* **Error Response**
  -- **WIP** --

## TODO

* ~~Error Endpoint for Delete Record~~

* ~~User Data return message and code~~

* ~~Delete user JSON response~~

* Search Endpoint

* ~~JWT Verification~~

* Function and Route documentation
