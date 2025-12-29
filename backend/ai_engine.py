import re
import os
from typing import Dict, List, Tuple, Optional

try:
    import google.generativeai as genai
except ImportError:
    genai = None

class AIResumeEngine:
    """AI Engine for resume optimization and keyword matching"""
    
    # Common action verbs for resume enhancement
    ACTION_VERBS = [
        "developed", "implemented", "designed", "created", "managed", "led",
        "optimized", "improved", "increased", "reduced", "achieved", "delivered",
        "coordinated", "collaborated", "executed", "established", "enhanced",
        "streamlined", "facilitated", "analyzed", "resolved", "maintained",
        "built", "integrated", "deployed", "monitored", "troubleshot"
    ]
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize AI Resume Engine.
        If api_key is provided, will use Google Gemini API for enhanced processing.
        Otherwise, uses regex-based processing.
        """
        # Prefer explicit api_key, otherwise read from GEMINI_API_KEY env var
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        self.use_gemini = bool(self.api_key) and genai is not None

        if self.use_gemini:
            genai.configure(api_key=self.api_key)
    
    def extract_keywords(self, job_description: str) -> List[str]:
        """
        Extract keywords from job description using simple regex patterns.
        Looks for technical terms, skills, and important phrases.
        """
        if not job_description:
            return []
        
        # Convert to lowercase for processing
        text = job_description.lower()
        
        # Common technical keywords patterns
        # Look for capitalized words (likely technologies/tools)
        tech_keywords = re.findall(r'\b[A-Z][a-zA-Z]{2,}\b', job_description)
        
        # Look for common skill patterns (languages, frameworks, tools)
        common_patterns = [
            r'\b(java|python|javascript|typescript|react|angular|vue|node|sql|mongodb|aws|docker|kubernetes|git|agile|scrum)\b',
            r'\b(html|css|api|rest|graphql|microservices|ci/cd|devops|machine learning|ai|nlp)\b',
            r'\b(management|leadership|communication|problem solving|analytical|strategic)\b'
        ]
        
        keywords = []
        for pattern in common_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            keywords.extend(matches)
        
        # Add capitalized tech terms
        keywords.extend([kw.lower() for kw in tech_keywords if len(kw) > 2])
        
        # Remove duplicates and filter short words
        keywords = list(set([kw.lower() for kw in keywords if len(kw) > 2]))
        
        return keywords[:30]  # Limit to top 30 keywords
    
    def calculate_match_score(self, skills: str, job_keywords: List[str]) -> int:
        """
        Calculate job match score (0-100) based on skills vs job keywords.
        """
        if not skills or not job_keywords:
            return 0
        
        # Parse skills (comma-separated)
        user_skills = [s.strip().lower() for s in skills.split(',') if s.strip()]
        
        if not user_skills:
            return 0
        
        # Count matches
        matches = 0
        for keyword in job_keywords:
            keyword_lower = keyword.lower()
            # Check if keyword appears in any skill
            for skill in user_skills:
                if keyword_lower in skill or skill in keyword_lower:
                    matches += 1
                    break
        
        # Calculate percentage score (capped at 100)
        if len(job_keywords) == 0:
            return 0
        
        score = min(100, int((matches / len(job_keywords)) * 100))
        return max(0, score)
    
    def enhance_experience_gemini(self, experience: str, job_description: str = "") -> str:
        """
        Use Google Gemini API to enhance work experience descriptions.
        """
        if not self.use_gemini:
            return self.enhance_experience(experience)

        try:
            model = genai.GenerativeModel("gemini-1.5-flash")

            prompt = f"""You are a professional resume writer. Transform the following work experience description into optimized, ATS-friendly bullet points.

Use strong action verbs, quantify achievements where possible, and make it professional and concise.

Original experience:
{experience}

{f"Target job context (for better alignment): {job_description[:500]}" if job_description else ""}

Return ONLY the enhanced bullet points, one per line, each starting with "• ". Do not include any other text or explanations."""

            response = model.generate_content(prompt)
            enhanced_text = (getattr(response, "text", "") or "").strip()

            # Ensure bullets start with •
            lines = enhanced_text.split('\n')
            formatted_lines = []
            for line in lines:
                line = line.strip("-•\t ").strip()
                if not line:
                    continue
                if not line.startswith('•'):
                    line = '• ' + line
                formatted_lines.append(line)

            return '\n'.join(formatted_lines) if formatted_lines else self.enhance_experience(experience)

        except Exception as e:
            print(f"Gemini API error: {e}. Falling back to regex-based enhancement.")
            return self.enhance_experience(experience)
    
    def enhance_experience(self, experience: str) -> str:
        """
        Enhance work experience with better action verbs and formatting (regex-based fallback).
        Converts paragraphs to bullet points with action verbs.
        """
        if not experience:
            return "• Worked on various projects and tasks"
        
        # Split into sentences
        sentences = re.split(r'[.!?]\s+', experience.strip())
        enhanced_bullets = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            
            # Check if sentence already starts with action verb
            sentence_lower = sentence.lower()
            starts_with_action = any(sentence_lower.startswith(verb) for verb in self.ACTION_VERBS)
            
            # If not, try to add an appropriate action verb
            if not starts_with_action:
                # Look for common weak starters
                weak_starters = ['i', 'we', 'responsible', 'worked', 'did', 'helped']
                words = sentence.split()
                if words and words[0].lower() in weak_starters:
                    # Replace with a stronger action verb
                    enhanced = "Developed " + ' '.join(words[1:]) if len(words) > 1 else "Developed " + sentence
                    sentence = enhanced
            
            # Capitalize first letter
            sentence = sentence[0].upper() + sentence[1:] if len(sentence) > 1 else sentence.upper()
            
            # Ensure it ends with period
            if not sentence.endswith(('.', '!', '?')):
                sentence += '.'
            
            enhanced_bullets.append("• " + sentence)
        
        # Join bullets with newlines
        enhanced_text = "\n".join(enhanced_bullets)
        
        # If no bullets were created, return a default formatted version
        if not enhanced_bullets:
            enhanced_text = "• " + experience.strip()
            if not enhanced_text.endswith('.'):
                enhanced_text += '.'
        
        return enhanced_text
    
    def process_resume(self, data: Dict) -> Dict:
        """
        Main processing function that takes user input and returns enhanced resume data.
        """
        # Extract keywords from job description
        job_keywords = self.extract_keywords(data.get('jobDescription', ''))
        
        # Calculate match score
        match_score = self.calculate_match_score(data.get('skills', ''), job_keywords)
        
        # Enhance experience (use Gemini if available, otherwise use regex-based)
        experience_text = data.get('experience', '')
        if self.use_gemini:
            enhanced_experience = self.enhance_experience_gemini(
                experience_text,
                data.get('jobDescription', '')
            )
        else:
            enhanced_experience = self.enhance_experience(experience_text)
        
        # Process skills (split and clean)
        skills_list = [s.strip() for s in data.get('skills', '').split(',') if s.strip()]
        
        # Build response
        result = {
            "fullName": data.get('fullName', ''),
            "jobTitle": data.get('jobTitle', ''),
            "email": data.get('email', ''),
            "phone": data.get('phone', ''),
            "location": data.get('location', ''),
            "portfolio": data.get('portfolio', ''),
            "skills": skills_list,
            "experience": enhanced_experience,
            "score": match_score,
            "matchedKeywords": job_keywords[:10],  # Top 10 matched keywords
            "aiEnhanced": self.use_gemini  # Flag indicating if AI was used
        }
        
        return result

