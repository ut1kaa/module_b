# **Подсказки по React**

## **Документация по Api**

### **Аутентификация пользователя**

#### **Регистрация нового аккаунта**
- **Endpoint:** `POST /registration`
- **Body Parameters:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword",
    "first_name": "John",
    "last_name": "Doe"
  }
  ```
- **Response:**
  - **200 OK**: `{ "token": "your_jwt_token", "message": "User registered successfully" }`
  - **400 BAD REQUEST**: `{ "detail": "Email already registered" }`

#### **Вход в существующий аккаунт**
- **Endpoint:** `POST /authorization`
- **Body Parameters:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - **200 OK**: `{ "token": "your_jwt_token", "message": "Login successful" }`
  - **401 UNAUTHORIZED**: `{ "detail": "Invalid credentials" }`

#### **Выход из аккаута**
- **Endpoint:** `GET /logout`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  - **200 OK**: `{ "message": "Logout successful" }`

### **Менеджмент файлов**

#### **Загрузка файла**
- **Endpoint:** `POST /files`
- **Headers:** `Authorization: Bearer <token>`
- **Body Parameters:**
  - `files`: Form-data with the file to upload (supports `doc`, `pdf`, `docx`, `zip`, `jpeg`, `jpg`, `png`).
- **Response:**
  - **200 OK**: 
    ```json
    {
      "success": true,
      "message": "File uploaded",
      "file_name": "example.pdf",
      "file_url": "uploads/12345678.pdf",
      "file_id": 12345678
    }
    ```
  - **400 BAD REQUEST**: If file type is not allowed or size exceeds 2MB.

#### **Переименование файла**
- **Endpoint:** `PATCH /files/{file_id}`
- **Headers:** `Authorization: Bearer <token>`
- **Path Parameters:** `file_id` (int)
- **Body Parameters:**
  ```json
  {
    "new_name": "new_filename.pdf"
  }
  ```
- **Response:**
  - **200 OK**: `{ "success": true, "message": "File renamed" }`
  - **404 NOT FOUND**: `{ "detail": "File not found or forbidden" }`

#### **Удаление файла**
- **Endpoint:** `DELETE /files/{file_id}`
- **Headers:** `Authorization: Bearer <token>`
- **Path Parameters:** `file_id` (int)
- **Response:**
  - **200 OK**: `{ "success": true, "message": "File deleted" }`
  - **404 NOT FOUND**: `{ "detail": "File not found" }`

#### **Скачивание файла**
- **Endpoint:** `GET /files/{file_id}`
- **Headers:** `Authorization: Bearer <token>`
- **Path Parameters:** `file_id` (int)
- **Response:**
  - **200 OK**: Returns the file content.
  - **404 NOT FOUND**: `{ "detail": "File not found" }`

### **Менеджмент файлового доступа**

#### **Добавить доступ пользователю**
- **Endpoint:** `POST /files/{file_id}/accesses`
- **Headers:** `Authorization: Bearer <token>`
- **Path Parameters:** `file_id` (int)
- **Body Parameters:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  - **200 OK**: List of users with access.
  - **404 NOT FOUND**: If file or user is not found.

#### **Удалить доступ пользоваателю**
- **Endpoint:** `DELETE /files/{file_id}/accesses`
- **Headers:** `Authorization: Bearer <token>`
- **Path Parameters:** `file_id` (int)
- **Body Parameters:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  - **200 OK**: `{ "success": true, "message": "Access removed" }`
  - **404 NOT FOUND**: If file or user is not found.
  - **403 FORBIDDEN**: If trying to remove own access.

### **Доступ к файлам**

#### **Получить все файлы пользователя**
- **Endpoint:** `GET /files`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  - **200 OK**: List of files and their accesses.
  - Example response:
    ```json
    [
      {
        "file_id": 12345678,
        "name": "example.pdf",
        "url": "uploads/12345678.pdf",
        "accesses": {
          "fullname": "John Doe",
          "email": "user@example.com",
          "type": "author"
        }
      }
    ]
    ```

#### **Получить все доступные файлы**
- **Endpoint:** `GET /shared`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  - **200 OK**: List of files shared with the user.
  - Example response:
    ```json
    [
      {
        "file_id": 87654321,
        "name": "shared_file.pdf",
        "url": "uploads/87654321.pdf"
      }
    ]
    ```

---

## **Теперь к реакту**

