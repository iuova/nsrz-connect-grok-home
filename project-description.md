# НСРЗ Коннект

## Обзор

НСРЗ Коннект - это корпоративный портал для Находкинского судоремонтного завода (НСРЗ). Проект представляет собой веб-приложение, разделенное на бэкенд и фронтенд части. Портал предоставляет сотрудникам доступ к новостям компании, организационной структуре, справочнику телефонов, информации об отпусках, а также панели администрирования для управления пользователями и настройкой сервера электронной почты. Доступ к функциям разграничен на основе ролей пользователей.

## Структура Проекта

### Бэкенд (Node.js, Express, SQLite, TypeScript)
```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── departmentController.ts
│   │   ├── employeeController.ts
│   │   ├── exportController.ts
│   │   ├── newsController.ts
│   │   └── vacationController.ts
│   ├── middlewares/
│   │   └── auth.ts
│   ├── models/
│   │   ├── department.ts
│   │   ├── employee.ts
│   │   ├── news.ts
│   │   ├── user.ts
│   │   └── vacation.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── departmentRoutes.ts
│   │   ├── employeeRoutes.ts
│   │   ├── exportRoutes.ts
│   │   ├── newsRoutes.ts
│   │   ├── userRoutes.ts
│   │   └── vacationRoutes.ts
│   ├── types/
│   │   ├── express.d.ts
│   │   └── index.d.ts
│   └── index.ts
│
├── database.db
├── package.json
├── tsconfig.json
└── yarn.lock
```
#### Описание файлов бэкенда:

-   `backend/src/index.ts`: Главный файл запуска приложения. Настраивает Express, подключает маршруты и запускает сервер.
-   `backend/src/config/database.ts`: Настройки подключения к базе данных SQLite, инициализация Sequelize.
-   `backend/src/controllers/`:
    -   `authController.ts`: Контроллер для аутентификации и регистрации пользователей. Содержит функции `register` и `login`.
    -   `departmentController.ts`: Контроллер для управления подразделениями. (Пока не реализовано)
    -   `employeeController.ts`: Контроллер для управления сотрудниками. (Пока не реализовано)
    -   `exportController.ts`: Контроллер для экспорта данных. (Пока не реализовано)
    -   `newsController.ts`: Контроллер для управления новостями. (Пока не реализовано)
    -   `vacationController.ts`: Контроллер для управления отпусками. (Пока не реализовано)
-   `backend/src/middlewares/auth.ts`: Промежуточное ПО для аутентификации пользователей с использованием JWT.
-   `backend/src/models/`:
    -   `department.ts`: Модель для таблицы подразделений.
    -   `employee.ts`: Модель для таблицы сотрудников.
    -   `news.ts`: Модель для таблицы новостей.
    -   `user.ts`: Модель для таблицы пользователей.
    -   `vacation.ts`: Модель для таблицы отпусков.
-   `backend/src/routes/`:
    -   `authRoutes.ts`: Маршруты для аутентификации.
    -   `departmentRoutes.ts`: Маршруты для управления подразделениями. (Пока не реализовано)
    -   `employeeRoutes.ts`: Маршруты для управления сотрудниками. (Пока не реализовано)
    -   `exportRoutes.ts`: Маршруты для экспорта данных. (Пока не реализовано)
    -   `newsRoutes.ts`: Маршруты для управления новостями. (Пока не реализовано)
    - `userRoutes.ts`: Маршруты для управления пользователями (получение, обновление, удаление).
    -   `vacationRoutes.ts`: Маршруты для управления отпусками. (Пока не реализовано)
-   `backend/src/types/`:
    -   `express.d.ts`: Расширение типов Express.
    -   `index.d.ts`: Общие типы, используемые в проекте.
-   `backend/database.db`: Файл базы данных SQLite.
-   `backend/package.json`: Файл зависимостей и скриптов для бэкенда.
-   `backend/tsconfig.json`: Файл конфигурации TypeScript для бэкенда.
-   `backend/yarn.lock`: Файл с зафиксированными версиями зависимостей.

### Фронтенд (React, TypeScript, Material-UI, Vite)
```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── NewsCard.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Admin.tsx
│   │   ├── Departments.tsx
│   │   ├── Employees.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── News.tsx
│   │   └── Vacations.tsx
│   ├── styles/
│   │   └── theme.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── api.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── yarn.lock
```
#### Описание файлов фронтенда:

-   `frontend/public/vite.svg`: Иконка Vite.
-   `frontend/src/assets/react.svg`: Иконка React.
-   `frontend/src/components/`:
    -   `Navbar.tsx`: Компонент навигационной панели.
    -   `NewsCard.tsx`: Компонент карточки новости.
-   `frontend/src/contexts/AuthContext.tsx`: Контекст для управления состоянием аутентификации.
-   `frontend/src/pages/`:
    -   `Admin.tsx`: Страница администрирования, управление пользователями.
    -   `Departments.tsx`: Страница подразделений.
    -   `Employees.tsx`: Страница сотрудников.
    -   `Home.tsx`: Главная страница.
    -   `Login.tsx`: Страница авторизации.
    -   `News.tsx`: Страница новостей.
    -   `Vacations.tsx`: Страница отпусков.
-   `frontend/src/styles/theme.ts`: Определение темы Material-UI.
-   `frontend/src/types/index.ts`: Общие типы, используемые во фронтенде (например, `News`, `User`, `Employee`, `Department`, `Vacation`).
-   `frontend/src/utils/api.ts`: Вспомогательные функции для взаимодействия с бэкендом.
-   `frontend/src/App.css`: Глобальные стили для приложения.
-   `frontend/src/App.tsx`: Главный компонент приложения, маршрутизация, отображение страниц.
-   `frontend/src/index.css`: Глобальные стили.
-   `frontend/src/main.tsx`: Точка входа для React приложения.
-   `frontend/src/vite-env.d.ts`: Определение типов для Vite.
- `frontend/index.html`: Главная html страница
-   `frontend/package.json`: Файл зависимостей и скриптов для фронтенда.
-   `frontend/tsconfig.app.json`: Конфигурация типов для приложения.
-   `frontend/tsconfig.json`: Общая конфигурация типов.
-   `frontend/tsconfig.node.json`: Конфигурация типов для node.
-   `frontend/vite.config.ts`: Конфигурация для Vite.
-   `frontend/yarn.lock`: Файл с зафиксированными версиями зависимостей.

## Реализованный Функционал

### Бэкенд

-   **Аутентификация и Авторизация**: Реализована система входа по email и паролю с использованием JWT. Роли: `admin`, `news_manager`, `user`. Управление пользователями только из панели администрирования.
-   **Управление Новостями**: CRUD-операции для новостей, доступные для `admin` и `news_manager`.
-   **Управление Сотрудниками**: CRUD-операции для сотрудников.
-   **Управление Подразделениями**: CRUD-операции для подразделений.
- **Управление Отпусками**: CRUD-операции для отпусков.
- **Экспорт Данных**: Реализован экспорт данных.

### Фронтенд

-   **Аутентификация**: Реализована форма входа с проверкой email и пароля.
-   **Отображение Новостей**: Лента новостей, доступная для всех авторизованных пользователей.
- **Список Сотрудников**: Отображение списка сотрудников.
- **Список Подразделений**: Отображение списка подразделений.
- **Список Отпусков**: Отображение списка отпусков.
-   **Управление Пользователями (Панель Администратора)**: Доступна для `admin` роли. Позволяет добавлять, редактировать и удалять пользователей.
-   **Общий UI/UX**: Минималистичный интерфейс в стиле продуктов Apple, светлые тона, мягкие тени, плавные переходы. Все элементы интерфейса на русском языке.

## Используемые Технологии

### Бэкенд

-   Node.js: Среда выполнения JavaScript.
-   Express: Фреймворк для создания веб-серверов.
-   SQLite: Встроенная реляционная база данных.
-   TypeScript: Язык программирования, добавляющий статическую типизацию в JavaScript.
- bcrypt: Библиотека для хеширования паролей.
- jsonwebtoken: Библиотека для работы с JWT.

### Фронтенд

-   React: Библиотека для создания пользовательских интерфейсов.
-   TypeScript: Язык программирования, добавляющий статическую типизацию в JavaScript.
-   Material-UI: Библиотека компонентов пользовательского интерфейса.
-   Vite: Инструмент для сборки и разработки фронтенд приложений.