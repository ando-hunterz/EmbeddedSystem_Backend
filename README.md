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

after installing check the env required by find which process use .env, then make the .env file by using command

```bash
touch .env
vi .env
or
nano .env
```

use command to start the server

```bash
npm start
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
    userData: {
        _id: id,
        uid: uid,
        name: name,
        id: id
        },
    id: id
    },
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

### Update Record

Update selected record of user who has logged.

* **URL**
 `/api/user/record/:id`
* **Method**
  `PATCH`
* **URL Params**
  `id=[user_id]`
* **Data Params**

  ```json5
  {
    uid: uid
  }
  ```

  OR

  ```json5
  {
    temperature: temperature
  } 
  ```

  OR

  ```json5
  {
    uid: uid,
    temperature: temperature
  }
  ```

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
    status: "OK"/"Warning",
    createdAt: CreatedDate,
    updatedAt: UpdatedDate,
    __v: 0,
    id: id
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

  ```json5
  {
    message: "Record with id user_id has been deleted"
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

### UserData Endpoint

User endpoint to access userData database collection

### Get UserData

Get userData which has been uploaded to database via csv file

* **URL**
 `/api/user/userData`
* **Method**
  `GET`
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
    name: name,
    __v: 0,
    createdAt: CreatedDate,
    updatedAt: UpdatedDate,
    id: id
    }
  ]
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

### Post UserData

Post userData with CSV files

* **URL**
 `/api/user/userData`
* **Method**
  `POST`
* **Data Params**
  .csv file with structure as following
  
  |uid|name|
  |---|---|
  |`user_uid`|`user_name`|

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
    name: name,
    __v: 0,
    createdAt: CreatedDate,
    updatedAt: UpdatedDate,
    id: id
    }
  ]
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

### Update UserData

Update userData which has been uploaded to database via csv file

* **URL**
 `/api/user/userData/:id`
* **Method**
  `PATCH`
* **Cookie Params**
  `db_id`
* **Data params**
  
  ```json5
  {
    uid: uid
  }
  ```

  OR

  ```json5
  {
    name: name
  }
  ```
  
  OR

  ```json5
  {
    uid: uid,
    name: name
  }
  ```

* **Success Response**\
  Status Code : **200**\
  Content:

  ```json5
  {
    _id: id,
    uid: uid,
    name: name,
    __v: 0,
    createdAt: CreatedDate,
    updatedAt: UpdatedDate,
    id: id
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

### Delete UserData

Delete userData which has been uploaded to database via csv file

* **URL**
 `/api/user/userData/:id`
* **Method**
  `DELETE`
* **Cookie Params**
  `db_id`
* **Success Response**\
  Status Code : **200**\
  Content:

  ```json5
  { 
    message: `User with id ${userId} deleted`
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

### -- Endpoint is WIP --

## TODO

* ~~Error Endpoint for Delete Record~~

* ~~User Data return message and code~~

* ~~Delete user JSON response~~

* Search Endpoint

* ~~JWT Verification~~

* Function and Route documentation

* Websocket Emit Event message

* ~~POST userData Error~~
