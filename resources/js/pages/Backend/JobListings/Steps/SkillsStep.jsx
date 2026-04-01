// resources/js/pages/Backend/JobListings/Steps/SkillsStep.jsx

import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaInfoCircle } from 'react-icons/fa';

export default function SkillsStep({
  skills, setSkills,
  responsibilities, setResponsibilities,
  benefits, setBenefits,
  keywords, setKeywords,
  formData, setFormData,
  errors
}) {
  const [newSkill, setNewSkill] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  // Stop words for keyword extraction
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that', 'the',
    'to', 'was', 'we', 'will', 'with', 'have', 'they', 'this', 'you', 'your',
    'their', 'them', 'would', 'could', 'should', 'may', 'might', 'can', 'do',
    'does', 'did', 'been', 'being', 'were', 'are', 'our', 'us', 'my', 'me',
    'i', 'am', 'very', 'just', 'like', 'then', 'than', 'also', 'only', 'not',
    'such', 'other', 'more', 'most', 'less', 'few', 'many', 'much', 'some',
    'any', 'no', 'nor', 'both', 'each', 'every', 'either', 'neither', 'one',
    'two', 'three', 'four', 'five', 'first', 'second', 'third', 'etc', 'etc.',
    'including', 'including:', 'especially', 'particularly', 'specifically',
    'generally', 'usually', 'typically', 'often', 'frequently', 'rarely',
    'occasionally', 'sometimes', 'always', 'never', 'must', 'required', 'need',
    'able', 'ability', 'capable', 'experience', 'knowledge', 'understanding',
    'proficiency', 'skill', 'skills', 'ability', 'abilities', 'good', 'great',
    'excellent', 'strong', 'solid', 'basic', 'advanced', 'intermediate',
    'year', 'years', 'month', 'months', 'week', 'weeks', 'day', 'days',
    'hour', 'hours', 'team', 'work', 'working', 'works', 'job', 'role',
    'position', 'candidate', 'applicant', 'person', 'people', 'someone',
    'anyone', 'everyone', 'who', 'whom', 'whose', 'which', 'what', 'when',
    'where', 'why', 'how', 'using', 'use', 'used', 'uses',
  ]);

  const extractKeywords = (text) => {
    if (!text) return [];
    const plainText = text.replace(/<[^>]*>/g, ' ');
    const cleaned = plainText
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const words = cleaned.split(' ');
    const filteredWords = words.filter(word => {
      if (word.length < 3) return false;
      if (stopWords.has(word)) return false;
      if (/^\d+$/.test(word)) return false;
      return true;
    });
    const wordCount = {};
    filteredWords.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    const sortedWords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    return [...new Set(sortedWords)].slice(0, 20);
  };

  // Auto-extract keywords
  useEffect(() => {
    // You would need access to description and requirements here
    // For now, just using skills and responsibilities
    const allText = [...skills, ...responsibilities].join(' ');
    const extracted = extractKeywords(allText);
    setKeywords(extracted);
  }, [skills, responsibilities]);

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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Required Skills <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addToList(skills, setSkills, newSkill, setNewSkill)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., JavaScript, Project Management, Communication"
          />
          <button
            type="button"
            onClick={() => addToList(skills, setSkills, newSkill, setNewSkill)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus size={14} /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {skill}
              <button
                type="button"
                onClick={() => removeFromList(skills, setSkills, index)}
                className="hover:text-red-600"
              >
                <FaTrash size={12} />
              </button>
            </span>
          ))}
        </div>
        {errors.skills && (
          <p className="mt-1 text-sm text-red-500">{errors.skills}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">Add key skills required for this position. These will help candidates find your job.</p>
      </div>

      {/* Responsibilities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Key Responsibilities <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newResponsibility}
            onChange={(e) => setNewResponsibility(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addToList(responsibilities, setResponsibilities, newResponsibility, setNewResponsibility)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Lead development team, Manage client relationships"
          />
          <button
            type="button"
            onClick={() => addToList(responsibilities, setResponsibilities, newResponsibility, setNewResponsibility)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus size={14} /> Add
          </button>
        </div>
        <ul className="list-disc list-inside space-y-1">
          {responsibilities.map((resp, index) => (
            <li key={index} className="flex justify-between items-center text-gray-700">
              <span className="flex-1">{resp}</span>
              <button
                type="button"
                onClick={() => removeFromList(responsibilities, setResponsibilities, index)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <FaTrash size={12} />
              </button>
            </li>
          ))}
        </ul>
        {errors.responsibilities && (
          <p className="mt-1 text-sm text-red-500">{errors.responsibilities}</p>
        )}
      </div>

      {/* Benefits */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Benefits & Perks
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newBenefit}
            onChange={(e) => setNewBenefit(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addToList(benefits, setBenefits, newBenefit, setNewBenefit)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Health Insurance, Remote Work, Flexible Hours"
          />
          <button
            type="button"
            onClick={() => addToList(benefits, setBenefits, newBenefit, setNewBenefit)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus size={14} /> Add
          </button>
        </div>
        <ul className="list-disc list-inside space-y-1">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex justify-between items-center text-gray-700">
              <span className="flex-1">{benefit}</span>
              <button
                type="button"
                onClick={() => removeFromList(benefits, setBenefits, index)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <FaTrash size={12} />
              </button>
            </li>
          ))}
        </ul>
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
              These keywords are automatically extracted from your skills and responsibilities.
              They help with SEO and job search visibility.
            </p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Add skills and responsibilities above to generate keywords</p>
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
            Social Sharing
          </label>
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
                Share on LinkedIn
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
                Share on Facebook
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}