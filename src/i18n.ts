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
        },
      },
      ru: {
        translation: {
          errors: {
            required: {
              field: "Поле обязательно для заполнения",
            },
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
        },
      },
    },
  });

export default i18n;
