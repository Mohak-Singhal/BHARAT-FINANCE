import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Play, 
  FileText, 
  Award, 
  TrendingUp,
  Clock,
  Users,
  Star,
  ChevronRight,
  Search,
  Filter,
  Globe,
  Target,
  CheckCircle,
  BarChart3
} from 'lucide-react';

interface Topic {
  category: string;
  topics: string[];
}

interface LessonProgress {
  topic: string;
  completed: boolean;
  score?: number;
  timeSpent?: number;
}

interface ComprehensiveGuide {
  topic: string;
  language: string;
  lesson: {
    content: string;
    key_points: string[];
    examples: string[];
    videos: any[];
    articles: any[];
    government_schemes: any[];
  };
  market_insights?: any;
  calculator_data?: any;
}

const ProfessionalLiteracyHub: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [selectedCategory, setSelectedCategory] = useState('Basic Finance');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<LessonProgress[]>([]);
  const [comprehensiveGuide, setComprehensiveGuide] = useState<ComprehensiveGuide | null>(null);

  useEffect(() => {
    fetchTopics();
    fetchLanguages();
    loadUserProgress();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch('http://localhost:8001/literacy/topics');
      const data = await response.json();
      setTopics(data.topics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      // Fallback data
      setTopics([
        {
          category: "Basic Finance",
          topics: ["Budgeting", "Saving", "Banking", "Digital Payments"]
        },
        {
          category: "Investments",
          topics: ["Mutual Funds", "SIP", "PPF", "NPS", "ELSS", "Fixed Deposits"]
        },
        {
          category: "Insurance",
          topics: ["Life Insurance", "Health Insurance", "Motor Insurance", "Crop Insurance"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await fetch('http://localhost:8001/literacy/languages');
      const data = await response.json();
      setLanguages(data.languages);
    } catch (error) {
      console.error('Error fetching languages:', error);
      setLanguages([
        { code: "english", name: "English", native: "English" },
        { code: "hindi", name: "Hindi", native: "हिंदी" },
        { code: "marathi", name: "Marathi", native: "मराठी" }
      ]);
    }
  };

  const loadUserProgress = () => {
    // Mock user progress data
    setUserProgress([
      { topic: 'Budgeting', completed: true, score: 85, timeSpent: 45 },
      { topic: 'Investing', completed: true, score: 92, timeSpent: 60 },
      { topic: 'Insurance', completed: false, timeSpent: 20 }
    ]);
  };

  const fetchComprehensiveGuide = async (topic: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8001/literacy/comprehensive-guide/${topic}?language=${selectedLanguage}`);
      const data = await response.json();
      setComprehensiveGuide(data);
    } catch (error) {
      console.error('Error fetching guide:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    const completed = userProgress.filter(p => p.completed).length;
    return Math.round((completed / userProgress.length) * 100);
  };

  const getTopicProgress = (topic: string) => {
    return userProgress.find(p => p.topic.toLowerCase() === topic.toLowerCase());
  };

  const filteredTopics = topics.filter(category => 
    selectedCategory === 'All' || category.category === selectedCategory
  );

  if (comprehensiveGuide) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={() => setComprehensiveGuide(null)}
            className="mb-6 flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
            Back to Topics
          </button>

          <div className="pro-card mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {comprehensiveGuide.topic} Guide
                </h1>
                <p className="text-gray-600">
                  Language: {languages.find(l => l.code === comprehensiveGuide.language)?.native || 'English'}
                </p>
              </div>
              <div className="badge badge-primary">Comprehensive</div>
            </div>

            <div className="prose max-w-none mb-8">
              <div className="text-gray-700 leading-relaxed">
                {comprehensiveGuide.lesson.content}
              </div>
            </div>

            {comprehensiveGuide.lesson.key_points.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Points</h3>
                <div className="space-y-3">
                  {comprehensiveGuide.lesson.key_points.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {comprehensiveGuide.lesson.examples.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Practical Examples</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comprehensiveGuide.lesson.examples.map((example, index) => (
                    <div key={index} className="p-4 bg-primary-50 rounded-lg border-l-4 border-primary-500">
                      <p className="text-gray-700">{example}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {comprehensiveGuide.lesson.government_schemes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Related Government Schemes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comprehensiveGuide.lesson.government_schemes.map((scheme, index) => (
                    <div key={index} className="p-4 bg-success-50 rounded-lg">
                      <h4 className="font-semibold text-success-800 mb-2">{scheme.name}</h4>
                      <p className="text-success-700 text-sm">{scheme.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="hero-professional">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Financial <span className="text-gradient">Literacy Hub</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8">
            Master financial concepts in your preferred language with AI-powered interactive learning
          </p>
          
          {/* Progress Overview */}
          <div className="glass-card max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">Your Progress</span>
              <span className="text-white font-bold">{getProgressPercentage()}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill bg-white" 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-white/80 mt-2">
              <span>{userProgress.filter(p => p.completed).length} completed</span>
              <span>{userProgress.length} total topics</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        {/* Controls */}
        <div className="glass-card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pro-input pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="pro-select"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pro-select"
              >
                <option value="All">All Categories</option>
                {topics.map((category) => (
                  <option key={category.category} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Topics</h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="pro-card">
                    <div className="skeleton h-6 w-1/3 mb-4"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="skeleton h-20 rounded-lg"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredTopics.map((category, categoryIndex) => (
                  <div key={category.category} className="pro-card fade-in" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{category.category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.topics
                        .filter(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((topic, topicIndex) => {
                          const progress = getTopicProgress(topic);
                          return (
                            <button
                              key={topic}
                              onClick={() => fetchComprehensiveGuide(topic)}
                              className="p-4 bg-gray-50 hover:bg-primary-50 rounded-lg border-2 border-transparent hover:border-primary-200 transition-all duration-300 text-left group"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <BookOpen className="w-5 h-5 text-primary-600" />
                                {progress?.completed && (
                                  <CheckCircle className="w-5 h-5 text-success-500" />
                                )}
                              </div>
                              <h4 className="font-semibold text-gray-900 mb-1">{topic}</h4>
                              {progress && (
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                  {progress.completed ? (
                                    <span className="text-success-600 font-medium">
                                      Score: {progress.score}%
                                    </span>
                                  ) : (
                                    <span>In Progress</span>
                                  )}
                                  <span>{progress.timeSpent}min</span>
                                </div>
                              )}
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors mt-2" />
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="pro-card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-600">Certificates</span>
                  </div>
                  <span className="font-bold text-gray-900">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-600">Time Spent</span>
                  </div>
                  <span className="font-bold text-gray-900">125min</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-600">Avg Score</span>
                  </div>
                  <span className="font-bold text-gray-900">88%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">Streak</span>
                  </div>
                  <span className="font-bold text-gray-900">7 days</span>
                </div>
              </div>
            </div>

            {/* Recommended */}
            <div className="pro-card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended</h3>
              <div className="space-y-3">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <h4 className="font-semibold text-primary-800 mb-1">Tax Planning</h4>
                  <p className="text-sm text-primary-600">Learn about tax-saving investments</p>
                </div>
                <div className="p-3 bg-secondary-50 rounded-lg">
                  <h4 className="font-semibold text-secondary-800 mb-1">Mutual Funds</h4>
                  <p className="text-sm text-secondary-600">Understand SIP and fund selection</p>
                </div>
                <div className="p-3 bg-success-50 rounded-lg">
                  <h4 className="font-semibold text-success-800 mb-1">Emergency Fund</h4>
                  <p className="text-sm text-success-600">Build your financial safety net</p>
                </div>
              </div>
            </div>

            {/* Language Support */}
            <div className="pro-card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Available Languages</h3>
              <div className="grid grid-cols-2 gap-2">
                {languages.slice(0, 6).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`p-2 text-sm rounded-lg border-2 transition-colors ${
                      selectedLanguage === lang.code
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-primary-200'
                    }`}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="pro-card text-center glow-effect">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Videos</h3>
            <p className="text-gray-600">Learn with engaging video content in your language</p>
          </div>

          <div className="pro-card text-center glow-effect">
            <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Real Examples</h3>
            <p className="text-gray-600">Practical examples from Indian financial markets</p>
          </div>

          <div className="pro-card text-center glow-effect">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Path</h3>
            <p className="text-gray-600">AI-curated learning path based on your goals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalLiteracyHub;