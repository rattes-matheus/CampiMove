import axios from 'axios'
import { ReportFilterParams, PageData, ReportResponse } from '@/types/reports'

const API_URL = 'http://localhost:8080/api/reports'

export async function getFilteredReports(
  params: ReportFilterParams
): Promise<PageData<ReportResponse>> {

  const response = await axios.get(`${API_URL}/search`, {
    params: {
      page: params.page,
      size: params.pageSize,
      searchTerm: params.searchTerm,
      status: params.status,
      category: params.category,
    },
  })

  return response.data
}
