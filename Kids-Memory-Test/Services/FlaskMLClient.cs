using System.Text;
using System.Text.Json;
using Kids_Memory_Test.DTOs;

namespace Kids_Memory_Test.Services
{
    public class FlaskMLClient
    {
        private readonly HttpClient _httpClient;

        public FlaskMLClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("http://127.0.0.1:5000/"); // Python URL
        }

        public async Task<string> GetImprovementPredictionAsync(List<DoctorDashboardDto> history, int age, string gender)
        {
            // 1. Calculate Current Scores
            var visual = CalculateAvg(history, 7, 9);
            var working = CalculateAvg(history, 1, 3);
            var auditory = CalculateAvg(history, 10, 12);
            var episodic = CalculateAvg(history, 4, 6);

            // 2. Build Payload (Matching EXACTLY what train_all.py expects)
            var payload = new
            {
                pre_Visual = visual,
                pre_Working = working,
                pre_Auditory = auditory,
                pre_Episodic = episodic,

                // Dummy "Post" values 
                post_Visual = visual,
                post_Working = working,
                post_Auditory = auditory,
                post_Episodic = episodic,

                Age = age,
                Gender = gender == "Male" ? 0 : 1
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                // 3. Send to Python
                var response = await _httpClient.PostAsync("predict", content);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(result);

                    if (doc.RootElement.TryGetProperty("improvement_prediction", out var predElement))
                    {
                        double val = predElement.GetDouble();
                        return GenerateInsightText(val);
                    }
                    return "Prediction format error.";
                }
                return "AI Service Error: " + response.ReasonPhrase;
            }
            catch
            {
                return "AI Service Unavailable (Is Python running?)";
            }
        }

        private double CalculateAvg(List<DoctorDashboardDto> history, int startId, int endId)
        {
            var scores = history.Where(h => h.GameId >= startId && h.GameId <= endId).Select(h => h.GameScore).ToList();
            return scores.Any() ? scores.Average() : 50;
        }

        private string GenerateInsightText(double improvement)
        {
            if (improvement > 10) return $"🚀 High Potential! AI predicts +{improvement:0.0}% improvement with current plan.";
            if (improvement > 0) return $"✅ Steady Progress. Predicted improvement: +{improvement:0.0}%.";
            return $"⚠️ Plateau Detected. AI predicts low improvement (+{improvement:0.0}%). Suggest changing game difficulty.";
        }
    }
}