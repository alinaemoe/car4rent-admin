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

import { UserList } from "./pages/users/list";
import { Header } from "./components/header";
import { UserEdit } from "./pages/users/edit";
import { UserCreate } from "./pages/users/create";
import { UserShow } from "./pages/users/show";

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params?: TOptions) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
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
                  // edit, create пока не обязательно, если мы только смотрим
                },
                {
                  name: "documents",
                  list: "/documents",
                  // show, edit, create пока не нужны, мы управляем ими из UserShow
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
    </BrowserRouter>
  );
}

export default App;
