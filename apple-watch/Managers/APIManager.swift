//
//  APIManager.swift
//  FitnessApp Watch App
//
//  Manages backend API communication
//

import Foundation

class APIManager {
    static let shared = APIManager()
    
    // MARK: - Configuration
    private let baseURL = "https://api.scorpion26.com" // TODO: Update with actual URL
    private var authToken: String?
    
    enum APIError: Error {
        case invalidURL
        case noData
        case decodingError
        case unauthorized
        case serverError(Int)
        case networkError(Error)
    }
    
    // MARK: - Initialization
    private init() {
        loadAuthToken()
    }
    
    // MARK: - Authentication
    
    private func loadAuthToken() {
        // Load from UserDefaults or Keychain
        authToken = UserDefaults.standard.string(forKey: "auth_token")
    }
    
    func setAuthToken(_ token: String) {
        authToken = token
        UserDefaults.standard.set(token, forKey: "auth_token")
    }
    
    // MARK: - Workout Endpoints
    
    func uploadWorkout(_ session: WorkoutSession) async throws {
        let endpoint = "/api/workouts/sessions"
        let url = try buildURL(endpoint: endpoint)
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        let workoutData = session.toDictionary()
        request.httpBody = try JSONSerialization.data(withJSONObject: workoutData)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.serverError(0)
        }
        
        guard (200...299).contains(httpResponse.statusCode) else {
            if httpResponse.statusCode == 401 {
                throw APIError.unauthorized
            }
            throw APIError.serverError(httpResponse.statusCode)
        }
        
        print("Workout uploaded successfully")
    }
    
    func fetchWorkoutLibrary() async throws -> [Workout] {
        let endpoint = "/api/workouts?platform=watch"
        let url = try buildURL(endpoint: endpoint)
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        
        if let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.serverError(0)
        }
        
        guard (200...299).contains(httpResponse.statusCode) else {
            throw APIError.serverError(httpResponse.statusCode)
        }
        
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        
        struct WorkoutResponse: Codable {
            let workouts: [Workout]
        }
        
        let workoutResponse = try decoder.decode(WorkoutResponse.self, from: data)
        return workoutResponse.workouts
    }
    
    func fetchUserStats() async throws -> UserStats {
        let endpoint = "/api/progress/stats"
        let url = try buildURL(endpoint: endpoint)
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        
        if let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.serverError(0)
        }
        
        guard (200...299).contains(httpResponse.statusCode) else {
            throw APIError.serverError(httpResponse.statusCode)
        }
        
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        
        let stats = try decoder.decode(UserStats.self, from: data)
        return stats
    }
    
    // MARK: - Helper Methods
    
    private func buildURL(endpoint: String) throws -> URL {
        guard let url = URL(string: baseURL + endpoint) else {
            throw APIError.invalidURL
        }
        return url
    }
}
