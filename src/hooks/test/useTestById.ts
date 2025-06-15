import api from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import type { Test } from "./useUserTests"

export const useTestById = (id: string) => {
	return useQuery<Test, Error>({
		queryKey: ["test", id],
		queryFn: async () => {
			const { data } = await api.get<Test>(`/tests/${id}`)
			return data
		},
		enabled: !!id,
	})
} 