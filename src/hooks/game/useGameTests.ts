import api from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { TestGame } from "@/types/test"

export const useGameTests = () => {
	return useQuery<TestGame[], Error>({
		queryKey: ["game-tests"],
		queryFn: async () => {
			const { data } = await api.get<TestGame[]>("/tests/game-tests")
			return data
		},
	})
} 