// resources/js/pages/Backend/JobListings/Steps/SkillsStep.jsx

import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaInfoCircle } from 'react-icons/fa';

export default function SkillsStep({
  skills, setSkills,
  responsibilities, setResponsibilities,
  benefits, setBenefits,
  keywords, setKeywords,
  formData, setFormData,
  description, requirements,
  errors
}) {
  const [newSkill, setNewSkill] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  // Comprehensive stop words including connectors, common CV/resume words, and filler words
  const stopWords = new Set([
    // Articles and connectors
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that', 'the',
    'to', 'was', 'we', 'will', 'with', 'have', 'they', 'this', 'you', 'your',
    'their', 'them', 'would', 'could', 'should', 'may', 'might', 'can', 'do',
    'does', 'did', 'been', 'being', 'were', 'are', 'our', 'us', 'my', 'me',
    'i', 'am', 'very', 'just', 'like', 'then', 'than', 'also', 'only', 'not',
    'such', 'other', 'more', 'most', 'less', 'few', 'many', 'much', 'some',
    'any', 'no', 'nor', 'both', 'each', 'every', 'either', 'neither', 'one',
    'two', 'three', 'four', 'five', 'first', 'second', 'third', 'etc', 'etc.',

    // Common CV/Resume filler words
    'including', 'including:', 'especially', 'particularly', 'specifically',
    'generally', 'usually', 'typically', 'often', 'frequently', 'rarely',
    'occasionally', 'sometimes', 'always', 'never', 'must', 'required', 'need',
    'able', 'ability', 'capable', 'experience', 'knowledge', 'understanding',
    'proficiency', 'skill', 'skills', 'abilities', 'good', 'great',
    'excellent', 'strong', 'solid', 'basic', 'advanced', 'intermediate',
    'year', 'years', 'month', 'months', 'week', 'weeks', 'day', 'days',
    'hour', 'hours', 'team', 'work', 'working', 'works', 'job', 'role',
    'position', 'candidate', 'applicant', 'person', 'people', 'someone',
    'anyone', 'everyone', 'who', 'whom', 'whose', 'which', 'what', 'when',
    'where', 'why', 'how', 'using', 'use', 'used', 'uses', 'provide', 'provides',
    'providing', 'ensure', 'ensuring', 'maintain', 'maintaining', 'support',
    'supporting', 'assist', 'assisting', 'coordinate', 'coordinating',
    'manage', 'managing', 'lead', 'leading', 'develop', 'developing',
    'create', 'creating', 'implement', 'implementing', 'design', 'designing',
    'analyze', 'analyzing', 'evaluate', 'evaluating', 'review', 'reviewing',
    'prepare', 'preparing', 'present', 'presenting', 'communicate', 'communicating',
    'collaborate', 'collaborating', 'coordinate', 'coordinating', 'organize',
    'organizing', 'plan', 'planning', 'execute', 'executing', 'deliver', 'delivering',
    'responsible', 'responsibilities', 'duties', 'tasks', 'functions',

    // Additional common words
    'minimum', 'maximum', 'preferred', 'required', 'qualification', 'qualifications',
    'requirement', 'requirements', 'experience', 'experienced', 'expertise',
    'background', 'degree', 'certification', 'certifications', 'license',
    'licenses', 'proven', 'track', 'record', 'demonstrated', 'ability', 'abilities',
    'capacity', 'capability', 'competence', 'competencies', 'proficiency',
    'fluency', 'fluent', 'native', 'professional', 'working', 'knowledge',
    'familiarity', 'understanding', 'awareness', 'insight', 'exposure',

    // Action verbs often used in job descriptions
    'responsible', 'accountable', 'oversee', 'overseeing', 'supervise', 'supervising',
    'direct', 'directing', 'coordinate', 'coordinating', 'facilitate', 'facilitating',
    'assist', 'assisting', 'support', 'supporting', 'advise', 'advising',
    'consult', 'consulting', 'recommend', 'recommending', 'monitor', 'monitoring',
    'track', 'tracking', 'report', 'reporting', 'document', 'documenting',
    'maintain', 'maintaining', 'update', 'updating', 'improve', 'improving',
    'enhance', 'enhancing', 'optimize', 'optimizing', 'streamline', 'streamlining'
  ]);

  // Technical keywords that should be prioritized (common in job listings)
  const technicalKeywords = new Set([
    'javascript', 'python', 'java', 'php', 'react', 'vue', 'angular', 'node',
    'laravel', 'django', 'flask', 'spring', 'aws', 'azure', 'gcp', 'docker',
    'kubernetes', 'git', 'github', 'sql', 'mongodb', 'postgresql', 'mysql',
    'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap', 'typescript',
    'jquery', 'redux', 'graphql', 'rest', 'api', 'microservices', 'devops',
    'ci/cd', 'agile', 'scrum', 'kanban', 'jira', 'confluence', 'slack',
    'figma', 'adobe', 'photoshop', 'illustrator', 'ui/ux', 'responsive',
    'mobile', 'ios', 'android', 'flutter', 'reactnative', 'swift', 'kotlin'
  ]);

  const extractKeywords = (text) => {
    if (!text) return [];

    // Remove HTML tags
    const plainText = text.replace(/<[^>]*>/g, ' ');

    // Convert to lowercase and clean special characters
    const cleaned = plainText
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Split into words
    const words = cleaned.split(' ');

    // Filter and score words
    const wordScores = {};
    const wordCount = {};

    words.forEach(word => {
      if (word.length < 3) return;
      if (stopWords.has(word)) return;
      if (/^\d+$/.test(word)) return;

      // Count occurrences
      wordCount[word] = (wordCount[word] || 0) + 1;

      // Calculate score based on importance
      let score = 1;

      // Technical keywords get higher score
      if (technicalKeywords.has(word)) {
        score += 2;
      }

      // Longer words might be more specific
      if (word.length > 6) {
        score += 0.5;
      }

      // Score based on frequency
      score += (wordCount[word] * 0.5);

      wordScores[word] = (wordScores[word] || 0) + score;
    });

    // Extract multi-word phrases (2-3 word combinations that might be meaningful)
    const phrases = [];
    for (let i = 0; i < words.length - 1; i++) {
      const twoWordPhrase = `${words[i]} ${words[i + 1]}`;
      if (twoWordPhrase.split(' ').every(w => w.length >= 3 && !stopWords.has(w))) {
        phrases.push(twoWordPhrase);
      }

      if (i < words.length - 2) {
        const threeWordPhrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
        if (threeWordPhrase.split(' ').every(w => w.length >= 3 && !stopWords.has(w))) {
          phrases.push(threeWordPhrase);
        }
      }
    }

    // Score phrases
    phrases.forEach(phrase => {
      const phraseKey = phrase;
      let score = 1.5;

      // Check if phrase contains technical keywords
      phrase.split(' ').forEach(word => {
        if (technicalKeywords.has(word)) {
          score += 1;
        }
      });

      wordScores[phraseKey] = (wordScores[phraseKey] || 0) + score;
    });

    // Sort by score
    const sortedKeywords = Object.entries(wordScores)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    // Remove duplicates and limit to 30 keywords
    return [...new Set(sortedKeywords)].slice(0, 30);
  };

  // Auto-extract keywords from all text sources
  useEffect(() => {
    // Combine all text sources
    const allText = [
      ...skills,
      ...responsibilities,
      // ...benefits,
      description || '',
      requirements || ''
    ].join(' ');

    const extracted = extractKeywords(allText);
    setKeywords(extracted);
  }, [skills, responsibilities, benefits, description, requirements]);

  const addToList = (list, setList, value, setValue) => {
    if (value.trim()) {
      if (list.includes(value.trim())) {
        alert('This item already exists!');
        return;
      }
      setList([...list, value.trim()]);
      setValue('');
    }
  };

  const removeFromList = (list, setList, index) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Skills & Benefits</h2>

      {/* Skills */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Required Skills <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-gray-500">{skills.length} skills added</span>
        </div>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addToList(skills, setSkills, newSkill, setNewSkill)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="e.g., JavaScript, Project Management, Communication"
          />
          <button
            type="button"
            onClick={() => addToList(skills, setSkills, newSkill, setNewSkill)}
            className="px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
          >
            <FaPlus size={14} /> Add
          </button>
        </div>

        {skills.length > 0 ? (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full text-sm border border-blue-200 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <span className="font-medium">{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeFromList(skills, setSkills, index)}
                    className="hover:text-red-600 transition-colors duration-200"
                  >
                    <FaTrash size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-dashed border-gray-300">
            <p className="text-sm text-gray-500">No skills added yet. Add skills above.</p>
          </div>
        )}

        {errors.skills && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <FaInfoCircle size={12} /> {errors.skills}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
          <FaInfoCircle size={10} /> Add key skills required for this position. These will help candidates find your job.
        </p>
      </div>

      {/* Responsibilities */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Key Responsibilities <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-gray-500">{responsibilities.length} responsibilities</span>
        </div>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newResponsibility}
            onChange={(e) => setNewResponsibility(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addToList(responsibilities, setResponsibilities, newResponsibility, setNewResponsibility)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="e.g., Lead development team, Manage client relationships"
          />
          <button
            type="button"
            onClick={() => addToList(responsibilities, setResponsibilities, newResponsibility, setNewResponsibility)}
            className="px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
          >
            <FaPlus size={14} /> Add
          </button>
        </div>

        {responsibilities.length > 0 ? (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="space-y-2">
              {responsibilities.map((resp, index) => (
                <div key={index} className="flex items-start justify-between group p-2 hover:bg-white rounded-lg transition-all duration-200">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-blue-500 font-bold mt-0.5">•</span>
                    <span className="text-gray-700 flex-1">{resp}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromList(responsibilities, setResponsibilities, index)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-dashed border-gray-300">
            <p className="text-sm text-gray-500">No responsibilities added yet. Add responsibilities above.</p>
          </div>
        )}

        {errors.responsibilities && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <FaInfoCircle size={12} /> {errors.responsibilities}
          </p>
        )}
      </div>

      {/* Benefits */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Benefits & Perks
          </label>
          <span className="text-xs text-gray-500">{benefits.length} benefits</span>
        </div>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newBenefit}
            onChange={(e) => setNewBenefit(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addToList(benefits, setBenefits, newBenefit, setNewBenefit)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="e.g., Health Insurance, Remote Work, Flexible Hours"
          />
          <button
            type="button"
            onClick={() => addToList(benefits, setBenefits, newBenefit, setNewBenefit)}
            className="px-4 py-2 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
          >
            <FaPlus size={14} /> Add
          </button>
        </div>

        {benefits.length > 0 ? (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center justify-between group p-2 hover:bg-white rounded-lg transition-all duration-200">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700 flex-1">{benefit}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromList(benefits, setBenefits, index)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-dashed border-gray-300">
            <p className="text-sm text-gray-500">No benefits added yet. Add benefits to attract more candidates.</p>
          </div>
        )}
      </div>

      {/* Auto-extracted Keywords */}
      <div className="border-t pt-6">
        <div className="flex items-start gap-2 mb-3">
          <FaInfoCircle className="text-blue-500 mt-0.5" size={16} />
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Auto-generated Keywords
            </label>
            <p className="text-xs text-gray-500">
              Keywords automatically extracted from skills, responsibilities, benefits, description, and requirements.
              These help with SEO and CV/resume matching.
            </p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto">
          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Add skills, responsibilities, and descriptions above to generate keywords</p>
          )}
        </div>
      </div>

      {/* Publishing Options */}
      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">
            Publish immediately (make active)
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Applicant Information
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Select what information applicants must provide when applying
          </p>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="show_linkedin"
                checked={formData.show_linkedin}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Require LinkedIn Profile
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="show_facebook"
                checked={formData.show_facebook}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Require Facebook Profile
              </label>
            </div>
          </div>
          <p className="mt-2 text-xs text-blue-600">
            <FaInfoCircle className="inline mr-1" size={12} />
            When enabled, applicants will be required to provide their social profile links
          </p>
        </div>
      </div>
    </div>
  );
}