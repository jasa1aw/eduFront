import api from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { TestUser } from "@/types/test"

export const useUserTests = () => {
	return useQuery<TestUser[], Error>({
		queryKey: ["user-tests"],
		queryFn: async () => {
			const { data } = await api.get<TestUser[]>("/tests/my-tests")
			return data
		},
	})
} 