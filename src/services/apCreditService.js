/**
 * AP Credit Service
 * 
 * Loads real College Board AP Credit Policy data from CSV at runtime
 * Data includes 2,135 colleges and ~91,000 AP credit policies
 * Last updated: May 22, 2026
 */

import Papa from 'papaparse';

// Cache for loaded data
let creditDataCache = null;
let collegeUrlsCache = null;
let loadingPromise = null;

/**
 * Load college URLs from CSV
 */
const loadCollegeUrls = async () => {
  if (collegeUrlsCache) {
    return collegeUrlsCache;
  }
  
  const response = await fetch('/college_urls.csv');
  const csvText = await response.text();
  
  return new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      complete: (results) => {
        const urlMap = {};
        results.data.forEach(row => {
          if (row.college && row.url) {
            urlMap[row.college.trim()] = row.url;
          }
        });
        collegeUrlsCache = urlMap;
        resolve(urlMap);
      }
    });
  });
};

/**
 * Load and parse the CSV data
 */
const loadCreditData = async () => {
  if (creditDataCache) {
    return creditDataCache;
  }
  
  if (loadingPromise) {
    return loadingPromise;
  }
  
  loadingPromise = fetch('/ap_credits_master.csv')
    .then(response => response.text())
    .then(csvText => {
      return new Promise((resolve) => {
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            // Organize data by college and course
            const organized = {};
            
            results.data.forEach(row => {
              if (!row.college || !row.ap_course) return;
              
              const college = row.college.trim();
              const course = row.ap_course.trim();
              
              if (!organized[college]) {
                organized[college] = {};
              }
              
              if (!organized[college][course]) {
                organized[college][course] = [];
              }
              
              organized[college][course].push({
                minScore: parseInt(row.min_score) || row.min_score,
                credits: row.credits,
                notes: row.notes
              });
            });
            
            creditDataCache = organized;
            loadingPromise = null;
            resolve(organized);
          }
        });
      });
    });
  
  return loadingPromise;
};

/**
 * Get credit policy for a specific course at a specific university
 */
const getCreditPolicy = (course, university, creditData) => {
  const universityName = university.label;
  const courseName = course.label;
  
  const universityData = creditData[universityName];
  
  if (!universityData) {
    return {
      course,
      university,
      accepted: false,
      minScore: null,
      creditHours: null,
      notes: 'No credit policy data available for this institution.'
    };
  }
  
  const coursePolicies = universityData[courseName];
  
  if (!coursePolicies || coursePolicies.length === 0) {
    return {
      course,
      university,
      accepted: false,
      minScore: null,
      creditHours: null,
      notes: 'This institution does not offer credit for this AP course.'
    };
  }
  
  const primaryPolicy = coursePolicies[0];
  let notes = primaryPolicy.notes;
  
  if (coursePolicies.length > 1) {
    const scoreLevels = coursePolicies.map(p => 
      `Score ${p.minScore}: ${p.credits} credits${p.notes ? ' (' + p.notes + ')' : ''}`
    ).join('; ');
    notes = `Credit varies by score: ${scoreLevels}`;
  }
  
  return {
    course,
    university,
    accepted: true,
    minScore: primaryPolicy.minScore,
    creditHours: primaryPolicy.credits,
    notes: notes
  };
};

/**
 * Search credit policies for given courses and universities
 */
export const searchCreditPolicies = async (courses, universities) => {
  // Load data first
  const creditData = await loadCreditData();
  const collegeUrls = await loadCollegeUrls();
  
  // Group results by university
  const results = universities.map(university => ({
    university,
    url: collegeUrls[university.label] || null,
    credits: courses.map(course => getCreditPolicy(course, university, creditData))
  }));

  return results;
};

/**
 * Export results to CSV format
 */
export const exportToCSV = (results) => {
  const headers = ['University', 'AP Course', 'Credit Accepted', 'Minimum Score', 'Credit Hours', 'Notes'];
  const rows = [headers.join(',')];
  
  results.forEach(({ university, credits }) => {
    credits.forEach(policy => {
      const row = [
        `"${university.label}"`,
        `"${policy.course.label}"`,
        policy.accepted ? 'Yes' : 'No',
        policy.minScore || 'N/A',
        policy.creditHours || 'N/A',
        `"${(policy.notes || '').replace(/"/g, '""')}"`
      ];
      rows.push(row.join(','));
    });
  });
  
  return rows.join('\n');
};
