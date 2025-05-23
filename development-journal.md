## [2024-01-15] Добавление полей имени пользователя

### Изменения:
- **Модель пользователя**: Добавлены новые поля:
  - `firstname` (Имя)
  - `lastname` (Фамилия) 
  - `midlename` (Отчество)
  
### Обновления:
- **API**:
  - Обновлены эндпоинты для работы с новыми полями
  - Добавлена валидация обязательных полей (firstname, lastname)
  
- **Фронтенд**:
  - Добавлены поля ввода в интерфейс администратора
  - Обновлена таблица пользователей для отображения новых полей
  - Изменена локализация (русский язык)
  
- **База данных**:
  - Созданы миграции для добавления новых колонок
  - Добавлен скрипт для заполнения значений по умолчанию
  - Обновлен скрипт проверки БД

### Технические детали:
- Добавлены новые зависимости (bcrypt, sqlite3)
- Обновлены существующие пакеты
- Добавлены скрипты для миграций (dev/prod)

## [2024-01-15] Обновление полей пользователя и локализация ролей

### Изменения:
- **API**:
  - Добавлены поля `firstname` и `midlename` в SQL-запросы для получения пользователей.
  - Обновлён запрос в `userRoutes.ts` для включения всех необходимых полей (`lastname`, `firstname`, `midlename`, `role`, `status`, `created_at`).

- **Фронтенд**:
  - Исправлено отображение данных в колонках "Фамилия" и "Имя" в компоненте `UserManagement`.
  - Реализован перевод ролей на русский язык с помощью утилиты `roleToRu`:
    ```typescript
    const roleToRu: Record<User['role'], string> = {
      admin: 'Администратор',
      employee: 'Сотрудник',
      news_manager: 'Менеджер новостей',
    };
    ```
  - Обновлён интерфейс `User` в `frontend/src/types/index.ts` для согласованности с бэкендом.

- **База данных**:
  - Добавлена миграция `0004-add-status-column.ts` для включения поля `status` в таблицу `users`.

- **Прочее**:
  - Удалён ненужный файл `SELECT`.
  - Обновлены зависимости и исправлены детали в `Tasks.md`.

### Технические детали:
- **Файлы**:
  - `backend/src/routes/userRoutes.ts` — обновлён SQL-запрос.
  - `frontend/src/pages/Admin.tsx` — добавлен перевод ролей.
  - `frontend/src/types/index.ts` — уточнены типы полей.
  - `backend/src/migrations/0004-add-status-column.ts` — новая миграция.

## [2024-01-16] Добавление сортировки пользователей в разделе "Управление пользователями"

### Изменения:
1. **Фронтенд**:
   - Добавлена сортировка по полям: Фамилия, Имя, Email, Роль в компоненте `UserManagement`.
   - Реализованы:
     - Состояние для хранения конфигурации сортировки (`sortConfig`).
     - Функция `sortedUsers` для применения текущей сортировки к списку пользователей.
     - Обработчик `handleSort` для переключения направления сортировки.
   - Обновлен интерфейс таблицы:
     - Заголовки столбцов стали кликабельными.
     - Добавлены индикаторы направления сортировки (стрелки вверх/вниз).

2. **Бэкенд**:
   - Подтверждена корректная работа существующего API для получения пользователей.
   - Доработки не потребовались, так как сортировка выполняется на клиенте.

### Технические детали:
- **Файлы**:
  - `frontend/src/pages/Admin.tsx` — основная логика сортировки.
  - `frontend/src/types/index.ts` — уточнены типы для полей сортировки.
- **Зависимости**: Изменения не потребовали обновления.

### Комментарии:
Сортировка реализована на клиентской стороне для:
- Оптимизации нагрузки на сервер.
- Упрощения логики (не требуется изменять API).
- Быстрого отклика интерфейса.

## [2024-01-15] Исправление ошибки загрузки пользователей после добавления строки поиска

### Изменения:
1. **Фронтенд**:
   - Исправлен запрос в компоненте `UserManagement`:
     - Добавлен полный URL к API (`http://localhost:5000/api/users`).
     - Добавлены заголовки авторизации (`getAuthHeaders()`).
     - Улучшена обработка ошибок (теперь выводится детализированное сообщение).
   - Обновлена логика работы строки поиска:
     - Параметр `search` теперь корректно передается в бэкенд.

2. **Бэкенд**:
   - Подтверждена корректная работа эндпоинта `/api/users` с параметром `search`.

### Технические детали:
- **Файлы**:
  - `frontend/src/pages/Admin.tsx` — исправлен метод `fetchUsers`.
  - `backend/src/routes/userRoutes.ts` — проверена логика поиска.
- **Зависимости**: Изменения не потребовали обновления.