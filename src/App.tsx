import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

// 👇 БЕРЕМ ГОТОВЫЕ КОМПОНЕНТЫ UI (включая AuthPage)
import {
  ErrorComponent,
  useNotificationProvider,
  RefineSnackbarProvider,
  ThemedLayout,
  ThemedTitle, // Если будет ругаться, попробуй просто ThemedTitle
  AuthPage, // 👈 Вот она, готовая страница входа!
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";

// 👇 РОУТИНГ
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";

// 👇 DATA PROVIDER (который мы только что установили)
import dataProvider from "@refinedev/simple-rest";

import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

// 👇 НАШИ ФАЙЛЫ
import { authProvider } from "./authProvider";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { axiosInstance, API_URL } from "./utility/axios-instance";

function App() {
  return (
    <BrowserRouter>
      <ColorModeContextProvider>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
        <RefineKbarProvider>
          {/* Оборачиваем в SnackbarProvider для уведомлений */}
          <RefineSnackbarProvider>
            <Refine
              // 👇 Подключаем Data Provider с нашим axios (чтобы летели токены)
              dataProvider={dataProvider(API_URL, axiosInstance)}
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              resources={
                [
                  // Пока пусто, добавим ресурсы позже
                ]
              }
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "car4rent-admin",
              }}
            >
              <Routes>
                {/* 1. СТРАНИЦА ВХОДА (Используем готовую AuthPage) */}
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
                  {/* type="login" рисует форму входа */}
                  <Route path="/login" element={<AuthPage type="login" />} />
                </Route>

                {/* 2. АДМИНКА (Внутрянка) */}
                <Route
                  element={
                    <Authenticated
                      key="authenticated-inner"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <ThemedLayout
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
                  {/* Пока нет ресурсов, перекидываем на заглушку или 404 */}
                  <Route
                    index
                    element={<div>Welcome to the admin panel!</div>}
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
