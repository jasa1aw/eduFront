import api from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

// Типы для статистики
export interface SystemStats {
	totalUsers: number
	totalTests: number
	totalAttempts: number
	totalCompetitions: number
	totalQuestions: number
	totalResults: number
	studentsCount: number
	teachersCount: number
	completedAttempts: number
	activeCompetitions: number
	completionRate: number
}

export interface MyStats {
	user: {
		id: string
		name: string
		email: string
		role: string
		createdAt: string
	}
	stats: {
		testsCreated: number
		totalAttempts: number
		completedAttempts: number
		completionRate: number
		totalResults: number
		avgScore: number
		bestScore: number
		competitionsCreated: number
		competitionsParticipated: number
	}
	recentAttempts: [{
		id: string
		userId: string
		testId: string
		startTime: string
		endTime: string
		status: string
		mode: string
		progress: any
		test: {
			title: string
		}
	}]
}


export interface TopUser {
	id: string
	name: string
	email: string
	role: string
	results: [{
		score: number
		test: {
			title: string
		}
	}]
	_count: {
		results: number
		attempts: number
	}
	avgScore: number
	totalScore: number
}
export interface TopTest {
	id: string
	title: string
	createdAt: string
	creator: {
		name: string
		email: string
	}
	_count: {
		attempts: number
		results: number
		questions: number
	}
}


export interface UsersByRole {
	role: string
	count: number
}

export interface TestResult {
		id: string
		userId: string
		testId: string
		attemptId: string
		score: number
		test: {
			title: string
			id: string
		_count: { attempts: number, results: number }
	}
}

export interface Competition {
	created: [{
		id: string
		code: string
		title: string
		testId: string
		creatorId: string
		status: string
		maxTeams: number
		startedAt: string
		endedAt: string
		createdAt: string
		_count: {
			participants: number
			teams: number
		}
	}]
	participated: []
	byStatus: [{
		status: string
		count: number
	}]
}

export interface TestAttempt {
	id: string
	userId: string
	testId: string
	startTime: string
	endTime: string
	status: string
	mode: string
	progress: any
	test: {
		title: string
	}
}

// Хуки для статистики
export const useSystemStats = () => {
	return useQuery<SystemStats, Error>({
		queryKey: ["system-stats"],
		queryFn: async () => {
			const { data } = await api.get<SystemStats>("/statistics/system")
			return data
		},
	})
}

export const useMyStats = () => {
	return useQuery<MyStats, Error>({
		queryKey: ["my-stats"],
		queryFn: async () => {
			const { data } = await api.get<MyStats>("/statistics/my-stats")
			return data
		},
	})
}

export const useTopUsers = () => {
	return useQuery<TopUser[], Error>({
		queryKey: ["top-users"],
		queryFn: async () => {
			const { data } = await api.get<TopUser[]>(`/statistics/users/top`)
			return data
		},
	})
}

export const useTopTests = () => {
	return useQuery<TopTest[], Error>({
		queryKey: ["top-tests"],
		queryFn: async () => {
			const { data } = await api.get<TopTest[]>(`/statistics/tests/top`)
			return data
		},
	})
}

export const useUsersByRole = () => {
	return useQuery<UsersByRole[], Error>({
		queryKey: ["users-by-role"],
		queryFn: async () => {
			const { data } = await api.get<UsersByRole[]>("/statistics/users/by-role")
			return data
		},
	})
}

export const useMyResults = () => {
	return useQuery<TestResult[], Error>({
		queryKey: ["my-results"],
		queryFn: async () => {
			const { data } = await api.get<TestResult[]>("/statistics/results")
			return data
		},
	})
}

export const useMyAttempts = () => {
	return useQuery<TestAttempt[], Error>({
		queryKey: ["my-attempts"],
		queryFn: async () => {
			const { data } = await api.get<TestAttempt[]>("/statistics/attempts")
			return data
		},
	})
}

export const useMyCompetitions = () => {
	return useQuery<Competition[], Error>({
		queryKey: ["my-competitions"],
		queryFn: async () => {
			const { data } = await api.get<Competition[]>("/statistics/competitions")
			return data
		},
	})
} 