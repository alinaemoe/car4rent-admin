import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector) // Авто-определение языка браузера
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "ru"],
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React сам экранирует
    },
    resources: {
      en: {
        translation: {
          errors: {
            required: {
              field: "This field is required",
            },
          },
          actions: {
            list: "List",
            create: "Create",
            edit: "Edit",
            show: "Show",
          },
          buttons: {
            addNewPhotos: "Add New Photos",
          },
          locations: {
            titles: {
              list: "Locations",
              create: "Create Location",
              edit: "Edit Location",
            },
            fields: {
              name: "Name",
              address: "Address",
              latitude: "Latitude",
              longitude: "Longitude",
            },
            sections: {
              details: "Details",
              coordinates: "Coordinates",
            },
            messages: {
              deleteConfirm: "Delete this location?",
            },
          },
          notifications: {
            imagesUploaded: "New images uploaded",
            imageDeleted: "Image deleted",
            errorUploading: "Error uploading images",
            errorDeleting: "Error deleting image",
            documentVerified: "Document verified",
            documentRejected: "Document rejected",
          },
          users: {
            titles: {
              list: "Users",
            },
            fields: {
              id: "ID",
              avatar: "Avatar",
              email: "Email",
              fullName: "Full Name",
              roles: "Roles",
              status: "Status",
              verified: "Verified",
              createdAt: "Created At",
              actions: "Actions",
              firstName: "First Name",
              lastName: "Last Name",
              phone: "Phone",
              adminComment: "Admin Comment",
            },
            placeholders: {
              adminComment: "Notes visible only to administrators",
              notAvailable: "N/A",
              rentalsEmptyTitle: "Rental history will be here",
              rentalsEmptyDescription:
                "We need to create the resource Rentals to display the table.",
              documentsEmptyTitle: "User documents",
              documentsEmptyDescription:
                "Here will be passport and driving license scans. A Documents resource is needed.",
            },
            tabs: {
              details: "Details",
              rentals: "Rentals",
              documents: "Documents",
            },
            chip: {
              verified: "Verified",
              notVerified: "Not Verified",
            },

            enums: {
              roles: {
                ADMIN: "Admin",
                MANAGER: "Manager",
                CLIENT: "Client",
              },
              status: {
                ACTIVE: "Active",
                BANNED: "Banned",
                PENDING_VERIFICATION: "Pending",
              },
            },
          },
          documents: {
            titles: {
              list: "Documents",
            },
            fields: {
              user: "User",
              type: "Type",
              status: "Status",
              documentNumber: "Document No.",
              createdAt: "Created At",
            },
            status: {
              PENDING: "Pending",
              VERIFIED: "Verified",
              REJECTED: "Rejected",
            },
            type: {
              PASSPORT: "Passport",
              DRIVER_LICENSE: "Driver's License",
            },
            actions: {
              verify: "Verify",
              reject: "Reject",
              rejectReason: "Reason for rejection",
              verifyAll: "Verify All",
            },
          },
          faq: {
            titles: {
              list: "FAQ",
              create: "Create FAQ",
              edit: "Edit FAQ",
            },
            fields: {
              question: "Question",
              answer: "Answer",
              order_index: "Order",
              is_active: "Active",
              created_at: "Created At",
            },
            sections: {
              question: "Question",
              answer: "Answer",
            },
            messages: {
              deleteConfirm: "Delete this FAQ?",
            },
          },
          news: {
            titles: {
              list: "News",
              create: "Create News",
              edit: "Edit News",
              show: "News Details",
            },
            fields: {
              id: "ID",
              title: "Title",
              text: "Text",
              badge: "Badge",
              image: "Image",
              is_active: "Active",
              created_at: "Created At",
            },
            sections: {
              title: "Title",
              text: "Text",
              badge: "Badge",
              image: "Image",
              preview: "Preview",
            },
            messages: {
              deleteConfirm: "Delete this news item?",
            },
            uploading: "Uploading...",
            uploadImage: "Upload Image",
          },
          features: {
            titles: {
              list: "Features",
              create: "Create Feature",
              edit: "Edit Feature",
            },
            fields: {
              internal_name: "Internal Name",
              description: "Description",
              icon: "Icon",
              icon_url: "Icon URL",
            },
            sections: {
              details: "Details",
              description: "Description",
            },
            messages: {
              deleteConfirm: "Delete this feature?",
            },
          },
          rental_leads: {
            titles: {
              list: "Rental Leads",
            },
            fields: {
              name: "Name",
              phone: "Phone",
              car: "Car",
              start_date: "Start Date",
              end_date: "End Date",
              comment: "Comment",
              status: "Status",
              created_at: "Created At",
            },
            new: "New",
            processed: "Processed",
            rejected: "Rejected",
            process: "Process",
            reject: "Reject",
            notSpecified: "Not specified",
            hint: "Click the status to change, or use the action buttons",
          },
          reviews: {
            titles: {
              list: "Reviews",
              create: "Create Review",
              edit: "Edit Review",
              show: "Review Details",
            },
            fields: {
              id: "ID",
              user: "User",
              car: "Car",
              rating: "Rating",
              comment: "Comment",
              createdAt: "Created At",
              actions: "Actions",
            },
            sections: {
              userAndCar: "User & Car",
              review: "Review",
            },
            filters: {
              car: "Car",
              all: "All",
            },
            companyReview: "Company Review",
            ratingOutOf: "5",
          },
          transactions: {
            titles: {
              list: "Transactions",
              dashboard: "Analytics Dashboard",
            },
            fields: {
              id: "ID",
              rental: "Rental ID",
              car: "Car",
              lessor: "Lessor",
              totalAmount: "Total",
              systemFee: "Fee",
              lessorIncome: "Income",
              payoutStatus: "Payout",
              type: "Type",
              createdAt: "Created",
            },
            stats: {
              totalRevenue: "Total Revenue",
              pendingPayouts: "Pending Payouts",
              systemFees: "System Fees",
              transactionCount: "Transactions",
            },
            charts: {
              monthlyRevenue: "Monthly Revenue (Last 6 Months)",
              payoutStatus: "Payout Status",
            },
            filters: {
              payoutStatus: "Payout Status",
              type: "Type",
              fromDate: "From",
              toDate: "To",
              all: "All",
              clear: "Clear Filters",
            },
            payoutStatus: {
              notApplicable: "N/A",
              pending: "Pending",
              paid: "Paid",
            },
            type: {
              rentalPayment: "Rental Payment",
              penalty: "Penalty",
              damageCompensation: "Damage Comp.",
            },
          },
          cars: {
            sections: {
              basicInfo: "Basic Info",
              pricing: "Identification & Pricing",
              configuration: "Configuration & Relations",
              localization: "Localization",
              images: "Images",
            },
            fields: {
              car: "Car",
              price: "Price / Day",
              status: "Status",
              brand: "Brand",
              model: "Model",
              year: "Year",
              plate: "License Plate",
              transmission: "Transmission",
              fuel: "Fuel",
              mileageLimit: "Limit (km/day)",
              overLimitPrice: "Over limit ($/km)",
              color: "Color",
              description: "Description",
              owner: {
                label: "Owner",
                placeholder: "Select User",
                helperText: "Who owns this car?",
                company: "Company (Our Fleet)",
              },
              location: {
                label: "Location",
                placeholder: "Select Location",
              },
              features: {
                label: "Features",
                placeholder: "Select Features",
              },
            },
            enums: {
              transmission: {
                AUTOMATIC: "Automatic",
                MANUAL: "Manual",
                ROBOT: "Robot",
              },
              fuel: {
                PETROL: "Petrol",
                DIESEL: "Diesel",
                ELECTRIC: "Electric",
                HYBRID: "Hybrid",
              },
              status: {
                AVAILABLE: "Available",
                RENTED: "Rented",
                MAINTENANCE: "Maintenance",
              },
            },
          },
          rentals: {
            titles: {
              list: "Rentals",
              create: "New Rental",
              edit: "Edit Rental",
              show: "Rental Details",
            },
            fields: {
              id: "ID",
              idLabel: "Rental",
              car: "Car",
              user: "Driver",
              status: "Status",
              startDate: "Start Date",
              endDate: "End Date",
              price: "Price",
            },
            enums: {
              status: {
                CREATED: "Created",
                APPROVED: "Approved",
                ACTIVE: "Active",
                COMPLETED: "Completed",
                CANCELED: "Canceled",
                REJECTED: "Rejected",
                OVERDUE: "Overdue",
              },
            },
            tabs: {
              details: "Details",
              damages: "Damages",
              timeline: "Timeline",
            },
            details: {
              client: "Client",
              vehicle: "Vehicle",
              dates: "Dates",
              finances: "Finances",
              mileage: "Mileage & Fuel",
              locations: "Locations",
              actualReturn: "Actual Return",
              notReturned: "Not returned",
              basePrice: "Base Price",
              penalty: "Penalty",
              total: "Total",
              startMileage: "Start Mileage",
              endMileage: "End Mileage",
              startFuel: "Start Fuel",
              endFuel: "End Fuel",
              pickUp: "Pick-up Location",
              dropOff: "Drop-off Location",
            },
            timeline: {
              created: "Rental Created",
              approved: "Approved by Manager",
              pendingApproval: "Awaiting Approval",
              started: "Rental Started (Car Handed Over)",
              notStarted: "Not Started",
              completed: "Rental Completed (Car Returned)",
              overdue: "Overdue",
              canceled: "Canceled",
              notCompleted: "Not Completed",
            },
            edit: {
              statusSection: "Status & Actions",
              datesSection: "Dates",
              clientSection: "Client & Car",
              finishRental: "Finish Rental",
              cancelRental: "Cancel Rental",
              finishDialogTitle: "Finish Rental",
              endMileage: "End Mileage (km)",
              endFuel: "End Fuel (%)",
              actualReturnDate: "Actual Return Date",
              confirmFinish: "Confirm Finish",
            },
            messages: {
              statusUpdated: "Status updated successfully",
              statusError: "Failed to update status",
              rentalFinished: "Rental finished successfully",
              finishError: "Failed to finish rental",
            },
          },
        },
      },
      ru: {
        translation: {
          errors: {
            required: {
              field: "Поле обязательно для заполнения",
            },
          },
          actions: {
            list: "Список",
            create: "Создать",
            edit: "Редактировать",
            show: "Просмотр",
          },
          buttons: {
            addNewPhotos: "Добавить фото",
          },
          locations: {
            titles: {
              list: "Локации",
              create: "Создать локацию",
              edit: "Редактировать локацию",
            },
            fields: {
              name: "Название",
              address: "Адрес",
              latitude: "Широта",
              longitude: "Долгота",
            },
            sections: {
              details: "Детали",
              coordinates: "Координаты",
            },
            messages: {
              deleteConfirm: "Удалить эту локацию?",
            },
          },
          notifications: {
            imagesUploaded: "Новые изображения загружены",
            imageDeleted: "Изображение удалено",
            errorUploading: "Ошибка при загрузке",
            errorDeleting: "Ошибка при удалении",
            documentVerified: "Документ подтвержден",
            documentRejected: "Документ отклонен",
          },
          users: {
            titles: {
              list: "Пользователи",
            },
            fields: {
              id: "ID",
              avatar: "Аватар",
              email: "Email",
              fullName: "ФИО",
              roles: "Роли",
              status: "Статус",
              verified: "Вериф.",
              createdAt: "Дата создания",
              actions: "Действия",
              firstName: "Имя",
              lastName: "Фамилия",
              phone: "Телефон",
              adminComment: "Комментарий админа",
            },
            placeholders: {
              adminComment: "Заметки видны только администраторам",
              notAvailable: "Н/Д",
              rentalsEmptyTitle: "История аренд будет здесь",
              rentalsEmptyDescription:
                "Нам нужно создать ресурс **Rentals**, чтобы отобразить таблицу.",
              documentsEmptyTitle: "Документы пользователя",
              documentsEmptyDescription:
                "Здесь будут сканы паспорта и прав. Нужен ресурс **Documents**.",
            },
            tabs: {
              details: "Детали",
              rentals: "Аренды",
              documents: "Документы",
            },
            chip: {
              verified: "Вериф.",
              notVerified: "Не вериф.",
            },

            enums: {
              roles: {
                ADMIN: "Админ",
                MANAGER: "Менеджер",
                CLIENT: "Клиент",
              },
              status: {
                ACTIVE: "Активен",
                BANNED: "Забанен",
                PENDING_VERIFICATION: "На проверке",
              },
            },
          },
          documents: {
            titles: {
              list: "Документы",
            },
            fields: {
              user: "Пользователь",
              type: "Тип",
              status: "Статус",
              documentNumber: "Номер документа",
              createdAt: "Дата создания",
            },
            status: {
              PENDING: "На проверке",
              VERIFIED: "Подтвержден",
              REJECTED: "Отклонен",
            },
            type: {
              PASSPORT: "Паспорт",
              DRIVER_LICENSE: "Водительские права",
            },
            actions: {
              verify: "Подтвердить",
              reject: "Отклонить",
              rejectReason: "Причина отказа",
              verifyAll: "Подтвердить все",
            },
          },
          faq: {
            titles: {
              list: "FAQ",
              create: "Создать FAQ",
              edit: "Редактировать FAQ",
            },
            fields: {
              question: "Вопрос",
              answer: "Ответ",
              order_index: "Порядок",
              is_active: "Активен",
              created_at: "Дата создания",
            },
            sections: {
              question: "Вопрос",
              answer: "Ответ",
            },
            messages: {
              deleteConfirm: "Удалить этот вопрос?",
            },
          },
          news: {
            titles: {
              list: "Новости",
              create: "Создать новость",
              edit: "Редактировать новость",
              show: "Детали новости",
            },
            fields: {
              id: "ID",
              title: "Заголовок",
              text: "Текст",
              badge: "Бейдж",
              image: "Изображение",
              is_active: "Активен",
              created_at: "Дата создания",
            },
            sections: {
              title: "Заголовок",
              text: "Текст",
              badge: "Бейдж",
              image: "Изображение",
              preview: "Просмотр",
            },
            messages: {
              deleteConfirm: "Удалить эту новость?",
            },
            uploading: "Загрузка...",
            uploadImage: "Загрузить изображение",
          },
          features: {
            titles: {
              list: "Опции",
              create: "Создать опцию",
              edit: "Редактировать опцию",
            },
            fields: {
              internal_name: "Внутреннее имя",
              description: "Описание",
              icon: "Иконка",
              icon_url: "URL иконки",
            },
            sections: {
              details: "Детали",
              description: "Описание",
            },
            messages: {
              deleteConfirm: "Удалить эту опцию?",
            },
          },
          rental_leads: {
            titles: {
              list: "Заявки с лендинга",
            },
            fields: {
              name: "Имя",
              phone: "Телефон",
              car: "Автомобиль",
              start_date: "Дата начала",
              end_date: "Дата окончания",
              comment: "Комментарий",
              status: "Статус",
              created_at: "Дата создания",
            },
            new: "Новая",
            processed: "Обработана",
            rejected: "Отклонена",
            process: "Обработать",
            reject: "Отклонить",
            notSpecified: "Не указан",
            hint: "Нажмите на статус чтобы изменить, или используйте кнопки действий",
          },
          reviews: {
            titles: {
              list: "Отзывы",
              create: "Создать отзыв",
              edit: "Редактировать отзыв",
              show: "Детали отзыва",
            },
            fields: {
              id: "ID",
              user: "Пользователь",
              car: "Автомобиль",
              rating: "Рейтинг",
              comment: "Комментарий",
              createdAt: "Дата создания",
              actions: "Действия",
            },
            sections: {
              userAndCar: "Пользователь и автомобиль",
              review: "Отзыв",
            },
            filters: {
              car: "Автомобиль",
              all: "Все",
            },
            companyReview: "Отзыв компании",
            ratingOutOf: "5",
          },
          transactions: {
            titles: {
              list: "Транзакции",
              dashboard: "Аналитика",
            },
            fields: {
              id: "ID",
              rental: "ID аренды",
              car: "Автомобиль",
              lessor: "Арентодатель",
              totalAmount: "Сумма",
              systemFee: "Комиссия",
              lessorIncome: "Доход",
              payoutStatus: "Выплата",
              type: "Тип",
              createdAt: "Создана",
            },
            stats: {
              totalRevenue: "Общий доход",
              pendingPayouts: "Ожидают выплаты",
              systemFees: "Комиссии систем",
              transactionCount: "Транзакций",
            },
            charts: {
              monthlyRevenue: "Месячный доход (последние 6 мес.)",
              payoutStatus: "Статус выплат",
            },
            filters: {
              payoutStatus: "Статус выплаты",
              type: "Тип",
              fromDate: "От",
              toDate: "До",
              all: "Все",
              clear: "Сбросить фильтры",
            },
            payoutStatus: {
              notApplicable: "Н/Д",
              pending: "В обработке",
              paid: "Выплачено",
            },
            type: {
              rentalPayment: "Аренда",
              penalty: "Штраф",
              damageCompensation: "Ущерб",
            },
          },
          cars: {
            sections: {
              basicInfo: "Основная информация",
              pricing: "Идентификация и цена",
              configuration: "Конфигурация и связи",
              localization: "Локализация",
              images: "Изображения",
            },
            fields: {
              car: "Автомобиль",
              price: "Цена / Сутки",
              status: "Статус",
              brand: "Марка",
              model: "Модель",
              year: "Год",
              plate: "Гос. номер",
              transmission: "Трансмиссия",
              fuel: "Топливо",
              mileageLimit: "Лимит (км/день)",
              overLimitPrice: "Доплата за перелимит ($/км)",
              color: "Цвет",
              description: "Описание",
              owner: {
                label: "Владелец",
                placeholder: "Выберите пользователя",
                helperText: "Кому принадлежит этот автомобиль?",
                company: "Компания (Наш парк)",
              },
              location: {
                label: "Локация",
                placeholder: "Выберите локацию",
              },
              features: {
                label: "Опции",
                placeholder: "Выберите опции",
              },
            },
            enums: {
              transmission: {
                AUTOMATIC: "Автомат",
                MANUAL: "Механика",
                ROBOT: "Робот",
              },
              fuel: {
                PETROL: "Бензин",
                DIESEL: "Дизель",
                ELECTRIC: "Электро",
                HYBRID: "Гибрид",
              },
              status: {
                AVAILABLE: "Доступен",
                RENTED: "В аренде",
                MAINTENANCE: "Обслуживание",
              },
            },
          },
          rentals: {
            titles: {
              list: "Аренды",
              create: "Новая аренда",
              edit: "Редактировать аренду",
              show: "Детали аренды",
            },
            fields: {
              id: "ID",
              idLabel: "Аренда",
              car: "Автомобиль",
              user: "Водитель",
              status: "Статус",
              startDate: "Начало",
              endDate: "Конец",
              price: "Стоимость",
            },
            enums: {
              status: {
                CREATED: "Создано",
                APPROVED: "Одобрено",
                ACTIVE: "В пути",
                COMPLETED: "Завершено",
                CANCELED: "Отменено",
                REJECTED: "Отклонено",
                OVERDUE: "Просрочено",
              },
            },
            tabs: {
              details: "Детали",
              damages: "Повреждения",
              timeline: "Хронология",
            },
            details: {
              client: "Клиент",
              vehicle: "Автомобиль",
              dates: "Даты",
              finances: "Финансы",
              mileage: "Пробег и топливо",
              locations: "Локации",
              actualReturn: "Факт. возврат",
              notReturned: "Не возвращена",
              basePrice: "Базовая цена",
              penalty: "Штраф",
              total: "Итого",
              startMileage: "Начальный пробег",
              endMileage: "Конечный пробег",
              startFuel: "Начальное топливо",
              endFuel: "Конечное топливо",
              pickUp: "Место выдачи",
              dropOff: "Место возврата",
            },
            timeline: {
              created: "Аренда создана",
              approved: "Подтверждена менеджером",
              pendingApproval: "Ожидает подтверждения",
              started: "Аренда начата (автомобиль выдан)",
              notStarted: "Не начата",
              completed: "Аренда завершена (автомобиль возвращён)",
              overdue: "Просрочена",
              canceled: "Отменена",
              notCompleted: "Не завершена",
            },
            edit: {
              statusSection: "Статус и действия",
              datesSection: "Даты",
              clientSection: "Клиент и автомобиль",
              finishRental: "Завершить аренду",
              cancelRental: "Отменить аренду",
              finishDialogTitle: "Завершение аренды",
              endMileage: "Конечный пробег (км)",
              endFuel: "Остаток топлива (%)",
              actualReturnDate: "Фактическая дата возврата",
              confirmFinish: "Подтвердить завершение",
            },
            messages: {
              statusUpdated: "Статус обновлён",
              statusError: "Ошибка обновления статуса",
              rentalFinished: "Аренда завершена",
              finishError: "Ошибка завершения аренды",
            },
          },
        },
      },
    },
  });

export default i18n;
