# 📋 DAILY QUESTION ADDITION ROUTINE FOR QUIZ APP

## 🎯 PURPOSE
This document explains how to set up a daily automated routine to add new questions to the Quiz application database, ensuring continuous growth and freshness of the question bank.

## 📁 FILES INVOLVED
- `add-daily.mjs` - Main script to add daily questions
- `questions_backup.json` - Backup of all questions (updated automatically)
- Package dependencies: `@supabase/supabase-js`, `ws` (for WebSocket support in Node.js < 22)

## 🔧 SETUP INSTRUCTIONS

### 1. PREREQUISITES
Make sure you have installed the required dependencies:
```bash
npm install @supabase/supabase-js ws
```

### 2. CONFIGURATION
Edit `add-daily.mjs` to:
- Update your Supabase URL and anon key if different
- Modify the question arrays to add fresh, non-duplicate questions each day
- Adjust the number of questions per category as needed

### 3. TESTING THE SCRIPT
Before automating, test manually:
```bash
node add-daily.mjs
```

Verify:
- No duplicate questions are added (check output for "Duplicadas: X")
- New questions are relevant and correctly formatted
- Backup is updated correctly
- Build still passes: `npx next build`

### 4. AUTOMATION SETUP

#### Option A: Linux/macOS (using cron)
1. Make the script executable:
   ```bash
   chmod +x add-daily.mjs
   ```

2. Edit your crontab:
   ```bash
   crontab -e
   ```

3. Add a line to run daily at 2:00 AM:
   ```
   0 2 * * * cd /path/to/quiz && /usr/bin/node add-daily.mjs >> /path/to/quiz/daily.log 2>&1
   ```

#### Option B: Windows (using Task Scheduler)
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily, at preferred time
4. Action: Start a program
   - Program: `node`
   - Arguments: `C:\path\to\quiz\add-daily.mjs`
   - Start in: `C:\path\to\quiz`
5. Finish and verify settings

### 5. MONITORING & MAINTENANCE
- Check `daily.log` (if configured) for any errors
- Weekly: Review the backup file to ensure quality
- Monthly: Rotate or archive old backups
- Quarterly: Assess if question quality needs improvement

### 6. BEST PRACTICES FOR QUESTION CREATION
When adding new questions to the script:
- Ensure all questions are in Portuguese (pt-PT) with proper accents
- Provide clear, unambiguous correct answers
- Include helpful hints in the metadata
- Distribute difficulty across age ratings (8, 12, 16)
- Avoid controversial or sensitive topics
- Verify facts before adding
- Make questions engaging and educational

### 7. TROUBLESHOOTING
- **"Duplicate questions" high**: Your question pool needs refreshing - create more novel questions
- **Build fails**: Check recent questions for syntax or formatting issues
- **Backup not updating**: Verify file permissions and disk space
- **Supabase connection errors**: Check network and API credentials

### 8. EXAMPLE DAILY QUESTION FORMAT
```javascript
{
  text: "Qual é o processo pelas plantas liberam vapor d'água para a atmosfera?",
  options: ["Fotossíntese", "Respiração", "Transpiração", "Germinação"],
  correct_option: 2,
  category: "CIENCIA",
  age_rating: 10,
  metadata: { hint: "Ocorre principalmente através dos estômatos foliares" }
}
```

## 📅 SUGGESTED WEEKLY ROTATION
To maintain variety and prevent burnout:
- Monday: Focus on Science & Math
- Tuesday: History & Geography
- Wednesday: Literature & Arts
- Thursday: Sports & Entertainment
- Friday: Technology & Current Events
- Weekend: Mixed review or user-requested topics

## 🔄 VERSION CONTROL
Consider committing the `add-daily.mjs` script to your git repository to track changes to your question addition logic over time.

## 📞 SUPPORT
For issues with this routine, consult:
- Supabase documentation: https://supabase.com/docs
- Node.js documentation: https://nodejs.org/en/docs
- Cron documentation: `man 5 crontab` (Linux/macOS)
- Windows Task Scheduler help