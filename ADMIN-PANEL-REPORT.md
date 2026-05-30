# Отчет по админ-панели Car4Rent

## 1. Существующие страницы (что уже готово)

| Ресурс                   | List | Create | Edit          | Show                       | Статус          |
| ------------------------ | ---- | ------ | ------------- | -------------------------- | --------------- |
| **users**                | ✅   | ✅     | ✅            | ✅ (с табами)              | **Полностью**   |
| **cars**                 | ✅   | ✅     | ✅ (с табами) | ✅ (с табами)              | **Полностью**   |
| **rentals**              | ✅   | ✅     | ❌            | ❌ (закомментировано)      | **Частично**    |
| **partnership-requests** | ✅   | ❌     | ❌            | ✅ (с approve/reject)      | **Частично**    |
| **translations**         | ✅   | ✅     | ✅            | ❌                         | **Частично**    |
| **documents**            | ❌   | ❌     | ❌            | ❌ (только таб в UserShow) | **Нет страниц** |
| **locations**            | ❌   | ❌     | ❌            | ❌ (только Autocomplete)   | **Нет страниц** |
| **features**             | ❌   | ❌     | ❌            | ❌ (только Autocomplete)   | **Нет страниц** |
| **car-damages**          | ❌   | ❌     | ❌            | ❌ (только в табах Car)    | **Нет страниц** |
| **rental-leads**         | ❌   | ❌     | ❌            | ❌                         | **Нет страниц** |
| **reviews**              | ❌   | ❌     | ❌            | ❌                         | **Нет страниц** |
| **faq**                  | ❌   | ❌     | ❌            | ❌                         | **Нет страниц** |
| **news**                 | ❌   | ❌     | ❌            | ❌                         | **Нет страниц** |
| **settings**             | ❌   | ❌     | ❌            | ❌                         | **Нет страниц** |
| **transactions**         | ❌   | ❌     | ❌            | ❌                         | **Нет страниц** |
| **languages**            | ❌   | ❌     | ❌            | ❌                         | **Нет страниц** |

---

## 2. Что нужно ДОБАВИТЬ (новые страницы)

### 2.1 Rental Show + Edit (ВЫСОКИЙ приоритет)

**Где:** `src/pages/rentals/show.tsx`, `src/pages/rentals/edit.tsx`
**Проблема:** Роуты закомментированы в App.tsx (строки 198-199). В листинге есть кнопки EditButton и ShowButton — ведут в 404.

**RentalShow должен содержать:**

- Хедер: инфо о машине (фото, бренд, модель, номер), инфо о пользователе (фото, имя, email)
- Статус аренды (Chip с цветом)
- Табы:
  - **Details**: user, car, start_date, end_date, actual_return_date, base_price, penalty_price, total_price, статусы топлива/пробега
  - **Damages**: таблица повреждений (тип, описание, стоимость, is_paid) с возможностью добавить/оплатить
  - **Timeline**: хронология статусов (создана → одобрена → активна → завершена)

**RentalEdit должен содержать:**

- Смена статуса (CREATED → APPROVED → ACTIVE → COMPLETED)
- Редактирование дат
- Завершение аренды (finishRentalDto: end_mileage, end_fuel, actual_return_date, damages)

**Данные для форм (select/dropdown):**

- `car_id` — GET /cars → Autocomplete
- `user_id` — GET /users → Autocomplete
- `status` — статический enum

### 2.2 Documents Page (ВЫСОКИЙ приоритет)

**Где:** `src/pages/documents/list.tsx`
**Бэкенд:** `GET /documents` (фильтр `userId`), `PATCH /documents/:id/verify`, `PATCH /documents/:id/reject`

**List:**

- Колонки: ID, User (аватар + имя + email), Тип (PASSPORT/DRIVER_LICENSE), Статус (PENDING/VERIFIED/REJECTED), Номер документа, Дата создания, Actions
- Фильтры: по статусу, по типу документа
- Действия: кнопка Verify (PATCH /documents/:id/verify), кнопка Reject (с модалкой причины)
- Bulk actions: массовое подтверждение

### 2.3 FAQ Management (ВЫСОКИЙ приоритет)

**Где:** `src/pages/faq/list.tsx`, `create.tsx`, `edit.tsx`
**Бэкенд:** `GET /faq/admin`, `POST /faq`, `PATCH /faq/:id`, `DELETE /faq/:id`

**List:**

- Колонки: ID, Question (по активному языку), is_active, order_index, Actions (Edit/Delete)

**Create/Edit:**

- `question` — LocalizedInput (Record<string, string>) — вопрос на нескольких языках
- `answer` — LocalizedInput (Record<string, string>) — ответ на нескольких языках
- `order_index` — NumberField (порядок сортировки)
- `is_active` — Checkbox

### 2.4 News Management (ВЫСОКИЙ приоритет)

**Где:** `src/pages/news/list.tsx`, `create.tsx`, `edit.tsx`, `show.tsx`
**Бэкенд:** `GET /news/admin/all`, `POST /news`, `PATCH /news/:id`, `DELETE /news/:id`

**List:**

- Колонки: ID, Title (по активному языку), Badge, is_active, created_at, Actions

**Create/Edit:**

- `title` — LocalizedInput (Record<string, string>)
- `text` — LocalizedInput (Record<string, string>) — RichText или multiline
- `badge` — LocalizedInput (Record<string, string>) — бейдж на нескольких языках
- `image_url` — File upload (+ Cloudinary)
- `is_active` — Checkbox

### 2.5 Locations CRUD (СРЕДНИЙ приоритет)

**Где:** `src/pages/locations/list.tsx`, `create.tsx`, `edit.tsx`
**Бэкенд:** `GET /locations`, `POST /locations`, `PATCH /locations/:id`, `DELETE /locations/:id`

**List:**

- Колонки: ID, Name, Address, Latitude, Longitude, Actions

**Create/Edit:**

- `name` — TextField (название, например "Minsk-2 Airport")
- `address` — TextField (адрес)
- `latitude` — NumberField
- `longitude` — NumberField

### 2.6 Features CRUD (СРЕДНИЙ приоритет)

**Где:** `src/pages/features/list.tsx`, `create.tsx`, `edit.tsx`
**Бэкенд:** `GET /features`, `POST /features`, `PATCH /features/:id`, `DELETE /features/:id`

**List:**

- Колонки: ID, Internal Name, Description (по языку), Icon, Actions

**Create/Edit:**

- `internal_name` — TextField (например "climate_control")
- `description` — LocalizedInput (Record<string, string>)
- `icon_url` — TextField (URL иконки)

### 2.7 Rental Leads Management (СРЕДНИЙ приоритет)

**Где:** `src/pages/rental-leads/list.tsx`, компонент для изменения статуса
**Бэкенд:** `GET /rental-leads`, `PATCH /rental-leads/:id/status`

**List:**

- Колонки: ID, Name, Phone, Car (бренд/модель), Start Date, End Date, Comment, Status (NEW/PROCESSED/REJECTED), Created At, Actions
- Действия: Process (PATCH → PROCESSED), Reject (PATCH → REJECTED), можно сделать inline select для смены статуса

### 2.8 Reviews Management (СРЕДНИЙ приоритет)

**Где:** `src/pages/reviews/list.tsx`, `show.tsx`
**Бэкенд:** `GET /reviews?car=...` (пока нет отдельного админского эндпоинта — нужно смотреть, возможно GET /reviews/car/:id)

**List:**

- Колонки: ID, User (аватар + имя), Car (бренд/модель), Rating (звезды), Comment, Created At, Actions
- Фильтры: по машине, по рейтингу
- Действие: Show (просмотр полного комментария), Delete (удаление)

### 2.9 Transactions Management (СРЕДНИЙ приоритет)

**Где:** `src/pages/transactions/list.tsx`
**Бэкенд:** `GET /transactions`, `PATCH /transactions/:id/payout-status`

**List:**

- Колонки: ID, Rental ID, Car, Lessor, Total Amount, System Fee, Lessor Income, Payout Status (NOT_APPLICABLE/PENDING/PAID), Type, Created At, Actions
- Действие: выпадающий список для смены `payout_status`
- Фильтры: по статусу выплаты, по типу транзакции

### 2.10 Settings Management (СРЕДНИЙ приоритет)

**Где:** `src/pages/settings/list.tsx`, `edit.tsx`
**Бэкенд:** `GET /settings`, `PATCH /settings/:key`, `POST /settings`, `DELETE /settings/:key`

**List:**

- Колонки: Key, Value, Description, Actions

**Create/Edit:**

- `key` — TextField (например "support_phone", "currency")
- `value` — TextField
- `description` — TextField (описание настройки)

**Важно:** В бэке `CreateSettingDto` пустой — надо фиксить бэкенд для нормального создания.

### 2.11 Languages Management (НИЗКИЙ приоритет)

**Где:** `src/pages/languages/list.tsx`, `create.tsx`, `edit.tsx`
**Бэкенд:** `GET /languages`, `POST /languages`, `PATCH /languages/:id`, `DELETE /languages/:id`

**List:**

- Колонки: Code, Name, Icon (флаг), is_active, Actions

**Create/Edit:**

- `code` — TextField (например "ru", "en", "de")
- `name` — TextField (например "Russian")
- `icon_url` — TextField (URL флага)
- `is_active` — Checkbox

### 2.12 Car Damages Page (НИЗКИЙ приоритет)

**Где:** `src/pages/car-damages/list.tsx`
**Бэкенд:** `GET /car-damages`, `POST /car-damages`, `PATCH /car-damages/:id/pay`, `DELETE /car-damages/:id`

**List:**

- Колонки: ID, Car, Rental (start-end), Type, Description, Repair Cost, Is Paid, Created At, Actions
- Действия: Pay (PATCH /car-damages/:id/pay), Delete
- Фильтры: по машине, по статусу оплаты

---

## 3. Что нужно ДОРАБОТАТЬ (существующие страницы)

### 3.1 CarShow — Details tab пустой

**Файл:** `src/pages/cars/show/index.tsx`
**Проблема:** Показывает только VIN и current_mileage.
**Нужно добавить:** brand, model, year, color, body_type, drive_type, transmission, fuel_type, price_per_day, deposit_amount, insurance_type, mileage_limit, owner, location, features, description (по активному языку), horsepower, fuel_consumption, discount_tiers, min_age, min_experience

### 3.2 CarDamagesTab — readOnly режим для Show

**Файл:** `src/pages/cars/edit/damages-tab.tsx`
**Проблема:** Переиспользуется в CarShow, но кнопки Add Damage / Delete / Pay видны. Нужен проп `readOnly`.

### 3.3 PartnershipRequestShow — переводы

**Файл:** `src/pages/partnership-requests/show.tsx`
**Проблема:** Много hardcoded английских строк. Нет переводов в `i18n.ts`.
**Нужно:** Добавить переводы в i18n.ts для ключей `partnership-requests.*`.

### 3.4 CarList — пагинация

**Файл:** `src/pages/cars/list.tsx`
**Проблема:** Использует `useList` с `pagination: { mode: "off" }` — грузит ВСЕ машины сразу.
**Нужно:** Переделать на `useDataGrid` с серверной пагинацией (как в RentalList).

### 3.5 PartnershipRequestList — пагинация

**Файл:** `src/pages/partnership-requests/list.tsx`
**Проблема:** Та же — `pagination: { mode: "off" }`.
**Нужно:** Переделать на `useDataGrid`.

### 3.6 TranslationList — пагинация

**Файл:** `src/pages/translations/list.tsx`
**Проблема:** Та же.
**Нужно:** Переделать на `useDataGrid`.

### 3.7 authProvider — getIdentity заглушка

**Файл:** `src/authProvider.ts`
**Проблема:** Возвращает hardcoded `{ id: 1, name: "Admin User", avatar: "..." }`.
**Нужно:** Раскомментировать запрос `GET /users/profile` и возвращать реальные данные пользователя.

### 3.8 authProvider — getPermissions заглушка

**Файл:** `src/authProvider.ts`
**Проблема:** Всегда возвращает `["ADMIN"]`. Нужно декодировать JWT или запрашивать роли.
**Нужно:** Декодировать access_token (jwtDecode) или стучаться на бэкенд.

### 3.9 UserCreate — нет поля аватар

**Файл:** `src/pages/users/create.tsx`
**Проблема:** `avatar_url` не редактируется. В бэке есть `POST /users/profile/avatar`.
**Нужно:** Добавить upload аватара в форму.

### 3.10 RentalCreate — поля формы

**Файл:** `src/pages/rentals/create.tsx`
**Проблема:** Использует `user_id` и `car_id`, но бэкенд может ожидать `{ user: { id } }` или `{ car: { id } }`.
**Нужно:** Проверить соответствие DTO (CreateRentalDto: `car_id: number`, `user_id` опционально).

---

## 4. Мертвый код (нужно удалить или переписать)

| Файл                                 | Описание                                            | Действие    |
| ------------------------------------ | --------------------------------------------------- | ----------- |
| `src/pages/cars/mockEdit.tsx`        | Дубликат CarEdit, не импортируется                  | **Удалить** |
| `src/pages/login/index.tsx`          | Создан, но App.tsx использует `<AuthPage>` напрямую | **Удалить** |
| `src/pages/register/index.tsx`       | Не импортируется, не зарегистрирован в роутах       | **Удалить** |
| `src/pages/forgotPassword/index.tsx` | Не импортируется, не зарегистрирован в роутах       | **Удалить** |
| `src/providers/auth.ts`              | Фейковый authProvider, не используется              | **Удалить** |
| `src/providers/data.ts`              | Фейковый dataProvider, не используется              | **Удалить** |
| `src/providers/constants.ts`         | Константы для фейкового API                         | **Удалить** |

---

## 5. Блокирующие / Важные проблемы

1. **Rental Edit/Show routes commented out** — клик по EditButton/ShowButton в RentalList ведет в 404.
2. **Documents page not found** — ресурс зарегистрирован в App.tsx, но файл `src/pages/documents/list.tsx` отсутствует.
3. **CarShow Details tab** — не хватает ~15 полей, код почти пустой.
4. **i18n** — нет переводов для partnership-requests, car-damages, некоторых полей в cars и rentals.
5. **getIdentity заглушка** — в хедере показывается фейковый аватар и имя.
6. **CarList грузит все машины** — при 500+ машинах страница будет тормозить.

---

## 6. Порядок работ (рекомендуемый)

1. **Срочно:** Rental Show + Edit (починить закомментированные роуты)
2. **Срочно:** Documents page (List с verify/reject)
3. **Срочно:** FAQ + News CRUD
4. **Средне:** Locations + Features CRUD
5. **Средне:** Rental Leads + Reviews + Transactions pages
6. **Средне:** Settings + Languages pages
7. **Средне:** Починить пагинацию в CarList, PartnershipRequestList, TranslationList
8. **Низко:** Чистка мертвого кода
9. **Низко:** getIdentity/getPermissions из бэкенда
10. **Низко:** CarDamages standalone page

---

## 7. Данные для dropdown/select (что подтягивать с бэкенда)

| Поле               | Ресурс/Эндпоинт                                          | Где используется                    |
| ------------------ | -------------------------------------------------------- | ----------------------------------- |
| Users list         | `GET /users`                                             | Car Owner, Rental Create, Documents |
| Locations list     | `GET /locations`                                         | Car Create/Edit                     |
| Features list      | `GET /features`                                          | Car Create/Edit                     |
| Cars list          | `GET /cars`                                              | Rental Create, Damages              |
| Languages list     | `GET /languages`                                         | Формы с LocalizedInput              |
| Settings (словари) | `GET /settings` (DICT_COLORS, DICT_TRANSMISSIONS и т.д.) | Car Create/Edit                     |
| Status enum        | Статические константы                                    | Rentals, Cars, Documents            |
| Roles enum         | Статические константы                                    | Users                               |

---

## 8. Схема новых роутов для App.tsx

```tsx
// FAQ
<Route path="/faq">
  <Route index element={<FaqList />} />
  <Route path="create" element={<FaqCreate />} />
  <Route path="edit/:id" element={<FaqEdit />} />
</Route>

// NEWS
<Route path="/news">
  <Route index element={<NewsList />} />
  <Route path="create" element={<NewsCreate />} />
  <Route path="edit/:id" element={<NewsEdit />} />
  <Route path="show/:id" element={<NewsShow />} />
</Route>

// LOCATIONS
<Route path="/locations">
  <Route index element={<LocationList />} />
  <Route path="create" element={<LocationCreate />} />
  <Route path="edit/:id" element={<LocationEdit />} />
</Route>

// FEATURES
<Route path="/features">
  <Route index element={<FeatureList />} />
  <Route path="create" element={<FeatureCreate />} />
  <Route path="edit/:id" element={<FeatureEdit />} />
</Route>

// RENTALS — раскомментировать
<Route path="/rentals">
  <Route index element={<RentalList />} />
  <Route path="create" element={<RentalCreate />} />
  <Route path="edit/:id" element={<RentalEdit />} />
  <Route path="show/:id" element={<RentalShow />} />
</Route>

// DOCUMENTS
<Route path="/documents">
  <Route index element={<DocumentList />} />
</Route>

// RENTAL LEADS
<Route path="/rental-leads">
  <Route index element={<RentalLeadList />} />
</Route>

// REVIEWS
<Route path="/reviews">
  <Route index element={<ReviewList />} />
</Route>

// TRANSACTIONS
<Route path="/transactions">
  <Route index element={<TransactionList />} />
</Route>

// SETTINGS
<Route path="/settings">
  <Route index element={<SettingList />} />
  <Route path="edit/:key" element={<SettingEdit />} />
</Route>

// LANGUAGES
<Route path="/languages">
  <Route index element={<LanguageList />} />
  <Route path="create" element={<LanguageCreate />} />
  <Route path="edit/:code" element={<LanguageEdit />} />
</Route>

// CAR-DAMAGES
<Route path="/car-damages">
  <Route index element={<CarDamageList />} />
</Route>
```

---

_Создан: май 2026_
