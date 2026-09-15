import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AppLayout } from "@/app/layout"
import { NotFoundPage } from "@/app/NotFoundPage"
import { StatsPage } from "@/estadisticas/pages/StatsPage"
import { PqrCreatePage } from "@/pqr/pages/PqrCreatePage"
import { PqrDetailPage } from "@/pqr/pages/PqrDetailPage"
import { PqrListPage } from "@/pqr/pages/PqrListPage"

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<PqrListPage />} />
          <Route path="pqr/nueva" element={<PqrCreatePage />} />
          <Route path="pqr/:id" element={<PqrDetailPage />} />
          <Route path="estadisticas" element={<StatsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
