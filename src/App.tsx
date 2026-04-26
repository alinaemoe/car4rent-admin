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
import { TranslationList } from "./pages/translations/list";
import { TranslationCreate } from "./pages/translations/create";
import { TranslationEdit } from "./pages/translations/edit";
import { PartnershipRequestList } from "./pages/partnership-requests/list";
import { PartnershipRequestShow } from "./pages/partnership-requests/show";

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
                dataProvider={dataProvider(API_URL, axiosInstance)}
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
                  { name: "locations" }, // Нужно для Location
                  { name: "features" },
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
                      {/* <Route path="edit/:id" element={<RentalEdit />} />
                       <Route path="show/:id" element={<RentalShow />} />  */}
                    </Route>

                    <Route path="/translations">
                      <Route index element={<TranslationList />} />
                      <Route path="create" element={<TranslationCreate />} />
                      <Route path="edit/:id" element={<TranslationEdit />} />
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
