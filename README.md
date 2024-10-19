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

## **Теперь к запуску**

### **Api server**

Переходим в папку:

```bash
cd api
```

#### 1. Создание виртуального окружения

Создайте виртуальное окружение с помощью `venv`:

```bash
python -m venv venv
```

Активируйте виртуальное окружение:

- На Windows:
  ```bash
  venv\Scripts\activate
  ```
- На MacOS и Linux:
  ```bash
  source venv/bin/activate
  ```

#### 2. Установка зависимостей

Установите зависимости из `requirements.txt`:

```bash
pip install -r requirements.txt
```

#### 3. Запуск программы

После установки зависимостей можно запускать программу.

```bash
cd src
```

```bash
python run.py
```

#### 4. Деактивация виртуального окружения

После завершения работы с проектом деактивируйте виртуальное окружение:

```bash
deactivate
```

### **Теперь к React приложению**

Переходим в папку:

```bash
cd app
```

#### 1. Установка зависимостей

У вас должен быть установлен  [NodeJs](https://nodejs.org/).

```bash
npm install
```

#### 2. Запуск проекта

```bash
npm run dev
```


#### Объяснениия


### 1. Структура приложения `App`

```javascript
  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isTokenValidClientSide ? <AuthSignIn /> : <Navigate to="/" />} />
        <Route path="/register" element={!isTokenValidClientSide ? <AuthSignUp /> : <Navigate to="/" />} />
        <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
        <Route path="/files" element={<PrivateRoute><PageFiles /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

```

### Объяснение:

- **Маршруты**: 
  - Используем `react-router-dom` для определения маршрутов. 
  - Если пользователь не аутентифицирован (`!isTokenValidClientSide`), он перенаправляется на страницу входа или регистрации. 
  - Если аутентифицирован, доступ к `/` и `/files` защищен с помощью компонента `PrivateRoute`.
  
- **Аутентификация**:
  - Токен берётся из `localStorage` и проверяется на валидность с помощью функции `isTokenValid`.
  
- **Навигация**: 
  - `Navigate` используется для редиректа, если пользователь уже вошёл в систему и пытается зайти на страницы входа или регистрации.

### 2. Компонент `AuthSignIn` для входа

```javascript
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const response = await fetch('http://127.0.0.1:8000/authorization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } else {
      console.error('Login failed:', response.statusText);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### Объяснение:

- **Метод `handleSubmit`**: Обрабатывает отправку формы для входа в систему.
- **`fetch`**: Отправляет POST-запрос на сервер для авторизации. В случае успешного ответа сохраняется токен в `localStorage`.
- **Перенаправление**: После успешного входа перенаправляем пользователя на главную страницу (`/`).

### 3. Защищённый маршрут `PrivateRoute`

```javascript
const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const token = localStorage.getItem('token');
  const isTokenValidClientSide = isTokenValid(token);

  return isTokenValidClientSide ? children : <Navigate to="/login" />;
};
```

### Объяснение:

- **Защита маршрута**: Проверяет, есть ли валидный токен. Если да, возвращает запрашиваемый компонент (`children`).
- **Редирект**: Если токен недействителен или отсутствует, пользователь перенаправляется на страницу входа (`/login`).

### 4. Загрузка файлов на сервер (компонент `Index`)

```javascript
const handleFileUpload = async () => {
  if (!selectedFile) return;
  const token = localStorage.getItem('token');

  const formData = new FormData();
  formData.append('files', selectedFile);

  try {
    const response = await fetch('http://127.0.0.1:8000/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      alert(data.message);
      setSelectedFile(null);
      fetchFiles();
    } else {
      console.error('Error uploading file:', response.statusText);
    }
  } catch (error) {
    console.error('Upload error:', error);
  }
};
```

### Объяснение:

- **Метод `handleFileUpload`**: Загружает файл на сервер.
- **`fetch` с `FormData`**: Используется для отправки POST-запроса с файлом. Заголовок `Authorization` передаёт токен для аутентификации.
- **Обновление списка файлов**: После успешной загрузки вызывается `fetchFiles` для обновления отображаемого списка файлов.

### 5. Валидация токена

```javascript
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error('Invalid token', error);
    return false;
  }
};
```

### Объяснение:

- **Проверка токена**: Декодирует токен и проверяет, истёк ли его срок действия.
- **Используется в `PrivateRoute`**: Для защиты маршрутов и проверки, имеет ли пользователь доступ к защищённым страницам.

### `useState`

Хук `useState` позволяет добавлять состояние в функциональные компоненты. Он возвращает массив из двух элементов: текущее состояние и функцию для его обновления.

```javascript
const [files, setFiles] = useState<any[]>([]); // Список файлов
```

Здесь `files` — это переменная состояния, которая изначально является пустым массивом. `setFiles` — функция, используемая для обновления `files`.

```javascript
const [selectedFile, setSelectedFile] = useState<File | null>(null); // Выбранный файл
```

`selectedFile` хранит выбранный пользователем файл, и его значение обновляется с помощью `setSelectedFile`.

### `useEffect`

Хук `useEffect` выполняет побочные эффекты в функциональных компонентах. Он принимает два аргумента: функцию эффекта и массив зависимостей.

```javascript
useEffect(() => {
    fetchFiles();
}, []);
```

В этом примере `useEffect` вызывается один раз при монтировании компонента `Index`, так как массив зависимостей пустой (`[]`). В результате вызывается функция `fetchFiles()`, которая загружает файлы с сервера.

## ОЧЕНЬ ПОДРОБНОЕ ОБЪЯСНЕНИЕ

# Инструкция по созданию приложения на React с использованием `react-router-dom` и `fetch`

## Структура проекта

1. `src/`
   - `App.tsx` — Главный компонент приложения.
   - `pages/`
     - `Index.js` — Компонент домашней страницы.
     - `PageFiles.tsx` — Компонент страниув доступных файлов.
     - `AuthSignIn.tsx` — Компонент авторизации.
     - `AuthSignUp.tsx` — Компонент регистрации.
   - `components/`
     - `ModalWindow.tsx` — Компонент модального окна для действия над файлами.
     - `PrivateRoute.tsx` — Компонент для защиты страниц от неавторизованных польователей.
     - `TokenValidator.tsx` — Компонент для валидации токена авторизации.
     - `styles/` — стандартные стили

## 1. Настройка `react-router-dom`

Для организации маршрутизации в React используем библиотеку `react-router-dom`. Это позволяет создавать навигацию между различными компонентами без перезагрузки страницы.

###  `App.js`:

```javascript
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthSignIn from './pages/AuthSignIn';
import AuthSignUp from './pages/AuthSignUp';
import Index from './pages/Index';
import PageFiles from './pages/PageFiles';
import PrivateRoute from './components/PrivateRoute';
import { isTokenValid } from './components/TokenValidator';

function App() {
  const token = localStorage.getItem('token');
  const isTokenValidClientSide = isTokenValid(token);


  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isTokenValidClientSide ? <AuthSignIn />: <Navigate to="/"/>} />
        <Route path="/register" element={!isTokenValidClientSide ? <AuthSignUp />: <Navigate to="/"/>} />
        <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
        <Route path="/files" element={<PrivateRoute><PageFiles /></PrivateRoute>} />
      </Routes>
    </Router>
  )
}

export default App

```

### Пояснение:

- `BrowserRouter` оборачивает все приложение и позволяет использовать маршрутизацию.
- `Routes` и `Route` задают различные пути (`path`) и компоненты, которые рендерятся при переходе по этим путям.
- `Navigate` используется для переадресации.
- Мы используем компонент isTokenValid, передавая в него токен авторизации из локального хранилища, чтобы переадесовать пользователя, если он невалиден на страицу авторизации, если валиден на главную страницу.

## 2. Страницы `pages`

Чтобы переделать html страницу в React Copmponent нужно:

### 1. Создать компонент

```javascript

const Page = () => {

  return (

  )
} 

```

### 2. Перенести html код в return (`ТУТ КОД`)

```javascript

const Page = () => {

  return (
    <div>
      HTML CODE
    </div>
  )
} 

```

### 3. Заменить `class` на `className`

```javascript

const Page = () => {

  return (
    <div className="code">
      HTML CODE
    </div>
  )
} 

```

### 4. Импортируем классы

```javascript

import "тут путь к файлу css"

const Page = () => {

  return (
    <div className="code">
      HTML CODE
    </div>
  )
} 

```


## 3. Страница авторизации


```javascript
import React, { useState, useEffect } from 'react';


const AuthSignIn = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const response = await fetch('http://127.0.0.1:8000/authorization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } else {
      console.error('Login failed:', response.statusText);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};

  return (
    <div>
      Код
    </div>
  );
}

export default AuthSignIn;
```

### Пояснение:

- **`useState`**:
  - `email` — хранит информацию о почте.
  - `setEmail` — функция для изменения `email`, пример: `setEmail("Тут почта")`.
- **`useEffect`**:
  - Хук запускается при первом рендере компонента и выполняет запрос к API.
  - Пустой массив `[]` в качестве второго аргумента указывает, что эффект должен выполняться только при первом рендере (аналогично `componentDidMount` в классовых компонентах).
  - Используем `fetch` для выполнения запроса к API с заголовком `Authorization`, содержащим токен.


```javascript

<form  onSubmit={handleSubmit}>

```


Используем функцию handleSubmit при нажатии на кнопку с типом `submit`. Она делает POST запос к api передавая в теле JSON с данными о почте и пароле. Если сервер вернул код 200, значит авторизация прошла успешна и в теле ответа содержится токен авторизации, который мы сохраняем в локально хранилище для дальнейшего использования. 


```javascript

        <input className="floating-input form-control" value={email} type="email" placeholder=" " required  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>


```

В value указываем значение из состояния `useState`, а в onChange подобную конструкцию чтобы изменять наше состояние. Это нужно чтобы  компонент имел доступ к тому, что вводит пользователь. Тем самым в состояние email будет хранится ввод пользователя.


**Страница Регистрании сделана абсолютно по такому же  принципу, но добавлено несколько больше полей ввода**

### 4. Страница файлов

