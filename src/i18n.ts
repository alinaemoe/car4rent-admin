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
          buttons: {
            addNewPhotos: "Add New Photos",
          },
          notifications: {
            imagesUploaded: "New images uploaded",
            imageDeleted: "Image deleted",
            errorUploading: "Error uploading images",
            errorDeleting: "Error deleting image",
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
            fields: {
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
          buttons: {
            addNewPhotos: "Добавить фото",
          },
          notifications: {
            imagesUploaded: "Новые изображения загружены",
            imageDeleted: "Изображение удалено",
            errorUploading: "Ошибка при загрузке",
            errorDeleting: "Ошибка при удалении",
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
            fields: {
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
          },
        },
      },
    },
  });

export default i18n;
