import { AnalysisResult } from '../types';

/**
 * Mock function to simulate resume analysis against a job description
 * In a real application, this would be an API call to a backend service
 */
export const mockAnalyzeResume = async (jobDescription: string): Promise<AnalysisResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Extract some keywords from the job description to use in the analysis
  const keywords = extractKeywords(jobDescription);
  
  // Calculate scores based on the job description length and complexity
  const overallScore = Math.floor(65 + Math.random() * 20);
  
  return {
    score: {
      overall: overallScore,
      keywords: Math.floor(60 + Math.random() * 30),
      experience: Math.floor(55 + Math.random() * 35),
      education: Math.floor(70 + Math.random() * 25),
      skills: Math.floor(50 + Math.random() * 40),
    },
    feedback: [
      {
        section: 'Professional Experience',
        score: Math.floor(60 + Math.random() * 30),
        suggestions: [
          'Quantify your achievements with metrics and numbers',
          'Use more action verbs to describe your responsibilities',
          'Highlight specific technologies and tools you used'
        ],
        missingKeywords: keywords.slice(0, 3),
      },
      {
        section: 'Skills',
        score: Math.floor(50 + Math.random() * 35),
        suggestions: [
          'Add more technical skills relevant to the job',
          'Organize skills by categories (technical, soft, etc.)',
        ],
        missingKeywords: keywords.slice(3, 7),
      },
      {
        section: 'Education',
        score: Math.floor(75 + Math.random() * 25),
        suggestions: [],
        missingKeywords: [],
      },
      {
        section: 'Projects',
        score: Math.floor(55 + Math.random() * 30),
        suggestions: [
          'Include more details about your contribution to each project',
          'Mention technologies used in your projects',
        ],
        missingKeywords: keywords.slice(7, 9),
      },
    ],
    missingFields: jobDescription.length > 500 
      ? ['Certifications', 'Awards'] 
      : ['Certifications'],
    improvementTips: [
      'Tailor your resume for each job application',
      'Use industry-specific keywords and phrases',
      'Keep your resume formatting consistent and ATS-friendly',
      'Highlight accomplishments rather than just listing responsibilities',
      'Remove outdated or irrelevant experience'
    ],
  };
};

// Helper function to extract keywords from job description
const extractKeywords = (jobDescription: string): string[] => {
  // In a real app, this would use NLP to extract relevant keywords
  // Here we're just splitting text and finding common tech/skills terms
  
  const commonKeywords = [
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'API', 
    'AWS', 'Cloud', 'Docker', 'CI/CD', 'Agile', 'Scrum',
    'Python', 'Java', 'C#', 'SQL', 'NoSQL', 'MongoDB',
    'REST', 'GraphQL', 'Redux', 'Vue', 'Angular', 'Express',
    'Machine Learning', 'AI', 'Data Science', 'Kubernetes',
    'Leadership', 'Communication', 'Problem-solving'
  ];
  
  // Filter keywords that appear in the job description
  const text = jobDescription.toLowerCase();
  const matchedKeywords = commonKeywords.filter(keyword => 
    text.includes(keyword.toLowerCase())
  );
  
  // Add some random keywords to simulate missing skills
  const randomKeywords = commonKeywords
    .filter(keyword => !matchedKeywords.includes(keyword))
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);
  
  return [...matchedKeywords.slice(0, 5), ...randomKeywords];
};