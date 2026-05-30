import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { useTranslation } from "react-i18next";
import "./i18n";
import { TOptions } from "i18next";

import {
  ErrorComponent,
  useNotificationProvider,
  RefineSnackbarProvider,
  ThemedLayout,
  // ThemedHeader нам больше не нужен из библиотеки, у нас свой!
  ThemedTitle,
  AuthPage,
} from "@refinedev/mui";
import TranslateIcon from "@mui/icons-material/Translate";
import HandshakeIcon from "@mui/icons-material/Handshake";
import SettingsIcon from "@mui/icons-material/Settings";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./authProvider";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { axiosInstance, API_URL } from "./utility/axios-instance";
import { AppSettingsProvider } from "./contexts/app-settings";

const baseProvider = dataProvider(API_URL, axiosInstance);

const customDataProvider = {
  ...baseProvider,
  getList: async ({ resource, ...rest }: any) => {
    if (resource === "faq") {
      const response = await axiosInstance.get(`${API_URL}/faq/admin`);
      return {
        data: Array.isArray(response.data) ? response.data : [],
        total: Array.isArray(response.data) ? response.data.length : 0,
      };
    }
    if (resource === "rental-leads") {
      const { pagination, sorters } = rest;
      const _start = pagination?.currentPage && pagination?.pageSize
        ? (pagination.currentPage - 1) * pagination.pageSize
        : 0;
      const _end = pagination?.currentPage && pagination?.pageSize
        ? pagination.currentPage * pagination.pageSize
        : 50;
      const _sort = sorters?.[0]?.field || "created_at";
      const _order = sorters?.[0]?.order || "desc";
      const response = await axiosInstance.get(
        `${API_URL}/rental-leads/admin/all`,
        { params: { _start, _end, _sort, _order } },
      );
      return {
        data: Array.isArray(response.data) ? response.data : [],
        total: parseInt(response.headers["x-total-count"] || "0", 10),
      };
    }
    if (resource === "features") {
      const { pagination, sorters } = rest;
      const _start = pagination?.currentPage && pagination?.pageSize
        ? (pagination.currentPage - 1) * pagination.pageSize
        : 0;
      const _end = pagination?.currentPage && pagination?.pageSize
        ? pagination.currentPage * pagination.pageSize
        : 50;
      const _sort = sorters?.[0]?.field || "internal_name";
      const _order = sorters?.[0]?.order || "asc";
      const response = await axiosInstance.get(`${API_URL}/features/admin/all`, {
        params: { _start, _end, _sort, _order },
      });
      return {
        data: Array.isArray(response.data) ? response.data : [],
        total: parseInt(response.headers["x-total-count"] || "0", 10),
      };
    }
    if (resource === "locations") {
      const { pagination, sorters } = rest;
      const _start = pagination?.currentPage && pagination?.pageSize
        ? (pagination.currentPage - 1) * pagination.pageSize
        : 0;
      const _end = pagination?.currentPage && pagination?.pageSize
        ? pagination.currentPage * pagination.pageSize
        : 50;
      const _sort = sorters?.[0]?.field || "name";
      const _order = sorters?.[0]?.order || "asc";
      const response = await axiosInstance.get(`${API_URL}/locations/admin/all`, {
        params: { _start, _end, _sort, _order },
      });
      return {
        data: Array.isArray(response.data) ? response.data : [],
        total: parseInt(response.headers["x-total-count"] || "0", 10),
      };
    }
    if (resource === "news") {
      const { pagination, sorters, filters } = rest;
      const _start = pagination?.currentPage && pagination?.pageSize
        ? (pagination.currentPage - 1) * pagination.pageSize
        : 0;
      const _end = pagination?.currentPage && pagination?.pageSize
        ? pagination.currentPage * pagination.pageSize
        : 10;
      const _sort = sorters?.[0]?.field || "created_at";
      const _order = sorters?.[0]?.order || "desc";
      const response = await axiosInstance.get(`${API_URL}/news/admin/all`, {
        params: { _start, _end, _sort, _order },
      });
      return {
        data: Array.isArray(response.data) ? response.data : [],
        total: parseInt(response.headers["x-total-count"] || "0", 10),
      };
    }
    if (resource === "reviews") {
      const { pagination, sorters, filters } = rest;
      const _start = pagination?.currentPage && pagination?.pageSize
        ? (pagination.currentPage - 1) * pagination.pageSize
        : 0;
      const _end = pagination?.currentPage && pagination?.pageSize
        ? pagination.currentPage * pagination.pageSize
        : 10;
      const _sort = sorters?.[0]?.field || "created_at";
      const _order = sorters?.[0]?.order || "desc";
      const params: Record<string, any> = { _start, _end, _sort, _order };
      if (filters) {
        const ratingFilter = filters.find((f: any) => f.field === "rating");
        if (ratingFilter?.value) params.rating = ratingFilter.value;
      }
      if (rest.meta?.car_id) params.car_id = rest.meta.car_id;
      const response = await axiosInstance.get(`${API_URL}/reviews/admin/all`, {
        params,
      });
      return {
        data: Array.isArray(response.data) ? response.data : [],
        total: parseInt(response.headers["x-total-count"] || "0", 10),
      };
    }
    if (resource === "transactions") {
      const { pagination, sorters, filters } = rest;
      const _start = pagination?.currentPage && pagination?.pageSize
        ? (pagination.currentPage - 1) * pagination.pageSize
        : 0;
      const _end = pagination?.currentPage && pagination?.pageSize
        ? pagination.currentPage * pagination.pageSize
        : 25;
      const _sort = sorters?.[0]?.field || "created_at";
      const _order = sorters?.[0]?.order || "desc";
      const params: Record<string, any> = { _start, _end, _sort, _order };
      if (filters) {
        const payoutFilter = filters.find((f: any) => f.field === "payout_status");
        if (payoutFilter?.value) params.payout_status = payoutFilter.value;
        const typeFilter = filters.find((f: any) => f.field === "type");
        if (typeFilter?.value) params.type = typeFilter.value;
        const fromDateFilter = filters.find((f: any) => f.field === "from_date");
        if (fromDateFilter?.value) params.from_date = fromDateFilter.value;
        const toDateFilter = filters.find((f: any) => f.field === "to_date");
        if (toDateFilter?.value) params.to_date = toDateFilter.value;
      }
      const response = await axiosInstance.get(`${API_URL}/transactions/admin/all`, {
        params,
      });
      return {
        data: Array.isArray(response.data) ? response.data : [],
        total: parseInt(response.headers["x-total-count"] || "0", 10),
      };
    }
    if (resource === "settings") {
      const response = await axiosInstance.get(`${API_URL}/settings`);
      const data = Array.isArray(response.data)
        ? response.data.map((item: any) => ({ ...item, id: item.key }))
        : [];
      return { data, total: data.length };
    }
    return baseProvider.getList({ resource, ...rest });
  },
  getOne: async ({ resource, id }: any) => {
    if (resource === "transactions") {
      const response = await axiosInstance.get(`${API_URL}/transactions/${id}`);
      return { data: response.data };
    }
    if (resource === "settings") {
      const response = await axiosInstance.get(`${API_URL}/settings/${id}`);
      return { data: { ...response.data, id: response.data.key } };
    }
    return baseProvider.getOne({ resource, id });
  },
};

import { UserList } from "./pages/users/list";
import { Header } from "./components/header";
import { UserEdit } from "./pages/users/edit";
import { UserCreate } from "./pages/users/create";
import { UserShow } from "./pages/users/show";
import { CarList } from "./pages/cars/list";
import { CarCreate } from "./pages/cars/create";
import { CarEdit } from "./pages/cars/edit";
import { CarShow } from "./pages/cars/show";
import { RentalList } from "./pages/rentals/list";
import { RentalCreate } from "./pages/rentals/create";
import { RentalEdit } from "./pages/rentals/edit";
import { RentalShow } from "./pages/rentals/show";
import { TranslationList } from "./pages/translations/list";
import { TranslationCreate } from "./pages/translations/create";
import { TranslationEdit } from "./pages/translations/edit";
import { PartnershipRequestList } from "./pages/partnership-requests/list";
import { PartnershipRequestShow } from "./pages/partnership-requests/show";
import { DocumentList } from "./pages/documents/list";
import { FaqList } from "./pages/faq/list";
import { FaqCreate } from "./pages/faq/create";
import { FaqEdit } from "./pages/faq/edit";
import { NewsList } from "./pages/news/list";
import { NewsCreate } from "./pages/news/create";
import { NewsEdit } from "./pages/news/edit";
import { NewsShow } from "./pages/news/show";
import { LocationList } from "./pages/locations/list";
import { LocationCreate } from "./pages/locations/create";
import { LocationEdit } from "./pages/locations/edit";
import { FeatureList } from "./pages/features/list";
import { FeatureCreate } from "./pages/features/create";
import { FeatureEdit } from "./pages/features/edit";
import { RentalLeadList } from "./pages/rental-leads/list";
import { ReviewList } from "./pages/reviews/list";
import { ReviewCreate } from "./pages/reviews/create";
import { ReviewEdit } from "./pages/reviews/edit";
import { ReviewShow } from "./pages/reviews/show";
import { TransactionList } from "./pages/transactions/list";
import { TransactionShow } from "./pages/transactions/show";
import { SettingList } from "./pages/settings/list";
import { SettingCreate } from "./pages/settings/create";
import { SettingEdit } from "./pages/settings/edit";

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params?: TOptions) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      <AppSettingsProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineKbarProvider>
            <RefineSnackbarProvider>
              <Refine
                dataProvider={customDataProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                i18nProvider={i18nProvider}
                authProvider={authProvider}
                resources={[
                  {
                    name: "users",
                    list: "/users",
                    create: "/users/create",
                    edit: "/users/edit/:id",
                    show: "/users/show/:id",
                    meta: { canDelete: false },
                  },
                  {
                    name: "rentals",
                    list: "/rentals",
                    show: "/rentals/show/:id",
                    create: "/rentals/create",
                    edit: "/rentals/edit/:id",
                  },
                  {
                    name: "documents",
                    list: "/documents",
                    // show, edit, create пока не нужны, мы управляем ими из UserShow
                  },
                  {
                    name: "cars",
                    list: "/cars",
                    create: "/cars/create",
                    edit: "/cars/edit/:id",
                    show: "/cars/show/:id",
                    meta: {
                      label: "Cars",
                      // icon: <DirectionsCarIcon /> // Можно добавить иконку, если импортируешь
                    },
                  },
                  {
                    name: "partnership-requests",
                    list: "/partnership-requests",
                    show: "/partnership-requests/show/:id",
                    meta: {
                      label: "Partner Requests",
                      icon: <HandshakeIcon />,
                    },
                  },
                  {
                    name: "translations",
                    list: "/translations",
                    create: "/translations/create",
                    edit: "/translations/edit/:id",
                    meta: {
                      canDelete: true,
                      icon: <TranslateIcon />,
                    },
                  },
                  {
                    name: "faq",
                    list: "/faq",
                    create: "/faq/create",
                    edit: "/faq/edit/:id",
                    meta: { canDelete: true },
                  },
                  {
                    name: "news",
                    list: "/news",
                    create: "/news/create",
                    edit: "/news/edit/:id",
                    show: "/news/show/:id",
                    meta: { canDelete: true },
                  },
                  {
                    name: "locations",
                    list: "/locations",
                    create: "/locations/create",
                    edit: "/locations/edit/:id",
                    meta: { canDelete: true },
                  },
                  {
                    name: "features",
                    list: "/features",
                    create: "/features/create",
                    edit: "/features/edit/:id",
                    meta: { canDelete: true },
                  },
                  {
                    name: "rental-leads",
                    list: "/rental-leads",
                    meta: { label: "Rental Leads" },
                  },
                  {
                    name: "reviews",
                    list: "/reviews",
                    create: "/reviews/create",
                    edit: "/reviews/edit/:id",
                    show: "/reviews/show/:id",
                    meta: { canDelete: true },
                  },
                  {
                    name: "transactions",
                    list: "/transactions",
                    show: "/transactions/show/:id",
                    meta: { label: "Transactions" },
                  },
                  {
                    name: "settings",
                    list: "/settings",
                    create: "/settings/create",
                    edit: "/settings/edit/:id",
                    meta: { canDelete: true, label: "Settings", icon: <SettingsIcon /> },
                  },
                  {
                    name: "car-damages",
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "car4rent-admin",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                        loading={<div>Loading...</div>}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<AuthPage type="login" />} />
                  </Route>

                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        {/* 👇 ВСТАВЛЯЕМ СВОЙ ХЕДЕР СЮДА */}
                        <ThemedLayout
                          Header={Header}
                          Title={({ collapsed }) => (
                            <ThemedTitle
                              collapsed={collapsed}
                              text="Car4Rent"
                              icon={collapsed ? "C" : "Car4Rent"}
                            />
                          )}
                        >
                          <Outlet />
                        </ThemedLayout>
                      </Authenticated>
                    }
                  >
                    <Route path="/users">
                      <Route index element={<UserList />} />
                      <Route path="create" element={<UserCreate />} />
                      <Route path="edit/:id" element={<UserEdit />} />
                      <Route path="show/:id" element={<UserShow />} />
                    </Route>

                    <Route path="/cars">
                      <Route index element={<CarList />} />
                      <Route path="create" element={<CarCreate />} />
                      <Route path="edit/:id" element={<CarEdit />} />
                      <Route path="show/:id" element={<CarShow />} />
                    </Route>

                    <Route path="/partnership-requests">
                      <Route index element={<PartnershipRequestList />} />
                      <Route
                        path="show/:id"
                        element={<PartnershipRequestShow />}
                      />
                    </Route>

                    <Route path="/rentals">
                      <Route index element={<RentalList />} />
                      <Route path="create" element={<RentalCreate />} />
                      <Route path="edit/:id" element={<RentalEdit />} />
                      <Route path="show/:id" element={<RentalShow />} />
                    </Route>

                    <Route path="/documents">
                      <Route index element={<DocumentList />} />
                    </Route>

                    <Route path="/translations">
                      <Route index element={<TranslationList />} />
                      <Route path="create" element={<TranslationCreate />} />
                      <Route path="edit/:id" element={<TranslationEdit />} />
                    </Route>

                    <Route path="/faq">
                      <Route index element={<FaqList />} />
                      <Route path="create" element={<FaqCreate />} />
                      <Route path="edit/:id" element={<FaqEdit />} />
                    </Route>

                    <Route path="/news">
                      <Route index element={<NewsList />} />
                      <Route path="create" element={<NewsCreate />} />
                      <Route path="edit/:id" element={<NewsEdit />} />
                      <Route path="show/:id" element={<NewsShow />} />
                    </Route>

                    <Route path="/locations">
                      <Route index element={<LocationList />} />
                      <Route path="create" element={<LocationCreate />} />
                      <Route path="edit/:id" element={<LocationEdit />} />
                    </Route>

                    <Route path="/features">
                      <Route index element={<FeatureList />} />
                      <Route path="create" element={<FeatureCreate />} />
                      <Route path="edit/:id" element={<FeatureEdit />} />
                    </Route>

                    <Route path="/rental-leads">
                      <Route index element={<RentalLeadList />} />
                    </Route>

                    <Route path="/reviews">
                      <Route index element={<ReviewList />} />
                      <Route path="create" element={<ReviewCreate />} />
                      <Route path="edit/:id" element={<ReviewEdit />} />
                      <Route path="show/:id" element={<ReviewShow />} />
                    </Route>

                    <Route path="/transactions">
                      <Route index element={<TransactionList />} />
                      <Route path="show/:id" element={<TransactionShow />} />
                    </Route>

                    <Route path="/settings">
                      <Route index element={<SettingList />} />
                      <Route path="create" element={<SettingCreate />} />
                      <Route path="edit/:id" element={<SettingEdit />} />
                    </Route>

                    <Route
                      index
                      element={<NavigateToResource resource="users" />}
                    />
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
            </RefineSnackbarProvider>
          </RefineKbarProvider>
        </ColorModeContextProvider>
      </AppSettingsProvider>
    </BrowserRouter>
  );
}

export default App;
