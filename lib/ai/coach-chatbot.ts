import { createClient } from '@/lib/supabase/server';
import type {
  AIChatSession,
  ChatMessage,
  ChatRequest,
  ChatResponse,
} from '@/types/ai';

/**
 * AI Coach Chatbot
 * ChatGPT-style interface with user context
 * Answers questions about form, modifications, nutrition, recovery
 * 
 * NOTE: Requires OpenAI API key in environment:
 * OPENAI_API_KEY=sk-...
 * 
 * Install: npm install openai
 */
export class CoachChatbot {
  private useAI: boolean;

  constructor() {
    this.useAI = !!process.env.OPENAI_API_KEY;
  }

  /**
   * Send a message to the AI coach
   */
  async chat(user_id: string, request: ChatRequest): Promise<ChatResponse> {
    const { session_id, message, context } = request;

    // Get or create session
    const session = session_id
      ? await this.getSession(session_id, user_id)
      : await this.createSession(user_id);

    // Get user context
    const userContext = await this.getUserContext(user_id);

    // Generate response
    let responseMessage: string;
    let suggestions: string[] = [];
    let workoutGenerated = false;

    if (this.useAI) {
      // Use GPT-4 when available
      const aiResponse = await this.generateAIResponse(
        message,
        session.messages,
        userContext,
        context
      );
      responseMessage = aiResponse.message;
      suggestions = aiResponse.suggestions;
      workoutGenerated = aiResponse.workoutGenerated;
    } else {
      // Use rule-based responses
      const ruleResponse = this.generateRuleBasedResponse(message, userContext);
      responseMessage = ruleResponse.message;
      suggestions = ruleResponse.suggestions;
    }

    // Save messages
    await this.saveMessages(session.id, user_id, [
      {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      },
      {
        role: 'assistant',
        content: responseMessage,
        timestamp: new Date().toISOString(),
      },
    ]);

    return {
      session_id: session.id,
      message: responseMessage,
      suggestions,
      workout_generated: workoutGenerated,
    };
  }

  /**
   * Generate AI response using GPT-4 (when available)
   */
  private async generateAIResponse(
    message: string,
    history: ChatMessage[],
    userContext: any,
    additionalContext?: Record<string, any>
  ): Promise<{
    message: string;
    suggestions: string[];
    workoutGenerated: boolean;
  }> {
    // This would use OpenAI API when installed
    console.warn('OpenAI not configured, using rule-based responses');
    return this.generateRuleBasedResponse(message, userContext);
  }

  /**
   * Generate rule-based response
   */
  private generateRuleBasedResponse(
    message: string,
    userContext: any
  ): {
    message: string;
    suggestions: string[];
    workoutGenerated: boolean;
  } {
    const lowerMessage = message.toLowerCase();

    // Form questions
    if (lowerMessage.includes('form') || lowerMessage.includes('technique')) {
      return {
        message: this.getFormAdvice(lowerMessage),
        suggestions: [
          'How do I improve my squat depth?',
          'What are common deadlift mistakes?',
          'Tips for better bench press form',
        ],
        workoutGenerated: false,
      };
    }

    // Modification questions
    if (lowerMessage.includes('modify') || lowerMessage.includes('alternative') || lowerMessage.includes('substitute')) {
      return {
        message: this.getModificationAdvice(lowerMessage),
        suggestions: [
          'Alternatives to barbell squats',
          'Exercises for lower back pain',
          'Bodyweight alternatives',
        ],
        workoutGenerated: false,
      };
    }

    // Nutrition questions
    if (lowerMessage.includes('nutrition') || lowerMessage.includes('diet') || lowerMessage.includes('protein') || lowerMessage.includes('calories')) {
      return {
        message: this.getNutritionAdvice(lowerMessage, userContext),
        suggestions: [
          'How much protein should I eat?',
          'Best pre-workout meal',
          'Calorie deficit for weight loss',
        ],
        workoutGenerated: false,
      };
    }

    // Recovery questions
    if (lowerMessage.includes('recovery') || lowerMessage.includes('rest') || lowerMessage.includes('sore') || lowerMessage.includes('sleep')) {
      return {
        message: this.getRecoveryAdvice(lowerMessage),
        suggestions: [
          'How much sleep do I need?',
          'Active recovery exercises',
          'When should I take a rest day?',
        ],
        workoutGenerated: false,
      };
    }

    // Workout generation
    if (lowerMessage.includes('create workout') || lowerMessage.includes('generate workout') || lowerMessage.includes('workout plan')) {
      return {
        message: this.getWorkoutGenerationResponse(userContext),
        suggestions: [
          'Create a chest workout',
          'Generate a leg day',
          'Full body workout for beginners',
        ],
        workoutGenerated: true,
      };
    }

    // Progress questions
    if (lowerMessage.includes('progress') || lowerMessage.includes('plateau') || lowerMessage.includes('stuck')) {
      return {
        message: this.getProgressAdvice(lowerMessage, userContext),
        suggestions: [
          'How to break through a plateau',
          'Am I making progress?',
          'When should I increase weight?',
        ],
        workoutGenerated: false,
      };
    }

    // Default response
    return {
      message: `I'm your AI fitness coach! I can help you with:

• **Form & Technique**: Get tips on proper exercise execution
• **Workout Modifications**: Find alternatives for injuries or equipment limitations
• **Nutrition Guidance**: Learn about protein, calories, and meal timing
• **Recovery Strategies**: Optimize rest, sleep, and active recovery
• **Custom Workouts**: Generate personalized workout plans
• **Progress Tracking**: Understand your fitness journey

What would you like to know about?`,
      suggestions: [
        'How do I improve my squat form?',
        'What should I eat before a workout?',
        'Create a workout for me',
        'How much rest do I need?',
      ],
      workoutGenerated: false,
    };
  }

  // Response generators
  private getFormAdvice(message: string): string {
    if (message.includes('squat')) {
      return `**Squat Form Tips:**

1. **Stance**: Feet shoulder-width apart, toes slightly out
2. **Depth**: Hip crease below knee level for full ROM
3. **Knees**: Track over toes, don't cave inward
4. **Back**: Maintain neutral spine, chest up
5. **Breathing**: Inhale down, exhale up

**Common Mistakes:**
- Knees caving inward (valgus collapse)
- Excessive forward lean
- Rising hips faster than chest
- Not reaching proper depth

**Cues to Remember:**
- "Spread the floor" with your feet
- "Chest proud"
- "Sit back" into the squat`;
    }

    if (message.includes('deadlift')) {
      return `**Deadlift Form Tips:**

1. **Setup**: Bar over mid-foot, shins close to bar
2. **Grip**: Shoulder-width, mixed or double overhand
3. **Back**: Neutral spine, lats engaged
4. **Pull**: Drive through heels, hips and shoulders rise together
5. **Lockout**: Stand tall, squeeze glutes

**Common Mistakes:**
- Rounded lower back
- Bar drifting away from body
- Hyperextending at the top
- Starting with hips too low or high

**Safety First:**
- Brace your core before each rep
- Keep the bar close to your body
- Don't jerk the weight off the floor`;
    }

    if (message.includes('bench')) {
      return `**Bench Press Form Tips:**

1. **Setup**: Feet flat, shoulder blades retracted
2. **Grip**: Slightly wider than shoulders
3. **Path**: Bar to lower chest, elbows 45° angle
4. **Arch**: Slight arch in lower back
5. **Drive**: Press up and slightly back

**Common Mistakes:**
- Flaring elbows too wide (90°)
- Bouncing bar off chest
- Lifting butt off bench
- Uneven bar path

**Pro Tips:**
- "Bend the bar" to engage lats
- Drive feet into ground
- Touch chest, don't bounce`;
    }

    return `**General Form Principles:**

1. **Control**: Slow eccentric (lowering), explosive concentric (lifting)
2. **Range of Motion**: Full ROM unless limited by injury
3. **Breathing**: Exhale on exertion, inhale on return
4. **Core**: Brace your core on every rep
5. **Mind-Muscle**: Focus on the target muscle

**Red Flags:**
- Sharp pain (stop immediately)
- Loss of control
- Compensatory movements
- Excessive momentum

Consider recording your sets to review form or work with a coach!`;
  }

  private getModificationAdvice(message: string): string {
    return `**Exercise Modifications & Alternatives:**

**For Injuries:**
- **Lower back pain**: Avoid loaded spinal flexion, try goblet squats, trap bar deadlifts
- **Knee pain**: Reduce range of motion, try box squats, leg press
- **Shoulder pain**: Avoid overhead pressing, try landmine press, floor press

**Equipment Alternatives:**
- **No barbell**: Dumbbells, resistance bands, bodyweight
- **No squat rack**: Goblet squats, Bulgarian split squats, pistol squats
- **No bench**: Floor press, push-ups, dips

**Common Substitutions:**
- Barbell Squat → Goblet Squat, Front Squat
- Deadlift → Romanian Deadlift, Trap Bar Deadlift
- Bench Press → Dumbbell Press, Push-ups
- Pull-ups → Lat Pulldown, Inverted Rows
- Overhead Press → Landmine Press, Pike Push-ups

What specific exercise do you need an alternative for?`;
  }

  private getNutritionAdvice(message: string, userContext: any): string {
    const goal = userContext?.fitness_goal || 'general fitness';

    if (message.includes('protein')) {
      return `**Protein Guidelines:**

**Daily Target:**
- Muscle building: 0.8-1g per lb bodyweight
- Maintenance: 0.6-0.8g per lb bodyweight
- Fat loss: 1-1.2g per lb bodyweight (preserves muscle)

**Timing:**
- Distribute evenly across meals (20-40g per meal)
- Post-workout: Within 2 hours (not critical)
- Before bed: Casein or slow-digesting protein

**Sources:**
- Lean meats: Chicken, turkey, fish
- Dairy: Greek yogurt, cottage cheese
- Plant-based: Tofu, tempeh, legumes
- Supplements: Whey, casein (if needed)

Your goal (${goal}) suggests focusing on adequate protein for recovery and growth.`;
    }

    if (message.includes('calorie') || message.includes('deficit') || message.includes('surplus')) {
      return `**Calorie Guidelines:**

**For Muscle Gain:**
- Surplus: +300-500 calories above maintenance
- Protein: 0.8-1g per lb
- Carbs: Moderate to high (fuel workouts)
- Fats: 20-30% of calories

**For Fat Loss:**
- Deficit: -300-500 calories below maintenance
- Protein: 1-1.2g per lb (preserve muscle)
- Carbs: Moderate (prioritize around workouts)
- Fats: 20-30% of calories

**For Maintenance:**
- Eat at maintenance calories
- Protein: 0.7-0.8g per lb
- Balanced macros

**Tips:**
- Track for 1-2 weeks to establish baseline
- Adjust based on weekly progress
- Don't cut too aggressively (max 1-2 lbs/week loss)`;
    }

    return `**Nutrition Fundamentals:**

1. **Calories**: Energy balance determines weight change
2. **Protein**: Builds and repairs muscle
3. **Carbs**: Fuel for workouts and recovery
4. **Fats**: Hormone production and health
5. **Hydration**: 0.5-1 oz per lb bodyweight

**Meal Timing:**
- Pre-workout (1-2h): Carbs + moderate protein
- Post-workout: Protein + carbs for recovery
- Throughout day: Regular meals every 3-4 hours

**Quality Matters:**
- Whole foods > processed
- Variety for micronutrients
- Consistent eating patterns

What specific nutrition question do you have?`;
  }

  private getRecoveryAdvice(message: string): string {
    return `**Recovery Optimization:**

**Sleep (Most Important):**
- Target: 7-9 hours per night
- Quality > Quantity
- Consistent schedule
- Cool, dark room

**Active Recovery:**
- Light cardio (walking, cycling)
- Yoga or stretching
- Swimming
- Mobility work

**Rest Days:**
- Take 1-2 per week minimum
- Listen to your body
- Deload every 4-6 weeks

**Soreness Management:**
- DOMS is normal (24-72h post-workout)
- Light movement helps
- Foam rolling, massage
- Adequate protein and hydration

**Signs You Need Rest:**
- Persistent fatigue
- Decreased performance
- Mood changes
- Elevated resting heart rate
- Frequent illness

**Recovery Tools:**
- Sleep (priority #1)
- Nutrition (protein, calories)
- Hydration
- Stress management
- Massage, foam rolling (supplementary)

Remember: You grow during recovery, not during workouts!`;
  }

  private getWorkoutGenerationResponse(userContext: any): string {
    const goal = userContext?.fitness_goal || 'general fitness';
    const level = userContext?.experience_level || 'intermediate';

    return `I can create a custom workout for you! Based on your profile:

**Your Goal**: ${goal}
**Experience**: ${level}

To generate the perfect workout, I need to know:
1. What muscle groups? (e.g., chest, legs, full body)
2. How much time do you have? (30, 45, 60+ minutes)
3. What equipment is available?
4. Any limitations or preferences?

Or try these quick options:
- "Create a 45-minute chest workout"
- "Generate a full body workout with dumbbells"
- "Make me a leg day for hypertrophy"

What type of workout would you like?`;
  }

  private getProgressAdvice(message: string, userContext: any): string {
    return `**Breaking Through Plateaus:**

**Progressive Overload Methods:**
1. **Increase Weight**: Add 5-10 lbs when you can complete all sets
2. **Increase Reps**: Add 1-2 reps per set
3. **Increase Sets**: Add an extra set
4. **Decrease Rest**: Reduce rest periods by 10-15 seconds
5. **Improve Form**: Better technique = more muscle activation
6. **Increase Frequency**: Train muscle groups more often

**Plateau Breakers:**
- **Deload Week**: Reduce volume by 40-50% for recovery
- **Exercise Variation**: Change exercises to provide new stimulus
- **Tempo Changes**: Slow down eccentric (3-4 seconds)
- **Intensity Techniques**: Drop sets, supersets, rest-pause

**When to Progress:**
- Completing all sets with RPE 7-8
- Good form maintained throughout
- Adequate recovery between sessions
- No pain or discomfort

**Signs of Overtraining:**
- Persistent fatigue
- Decreased performance
- Poor sleep
- Loss of motivation

**Remember:**
- Progress isn't always linear
- Small improvements compound over time
- Consistency > perfection
- Recovery is part of progress

Track your workouts to identify patterns and progress!`;
  }

  // Session management
  private async createSession(user_id: string): Promise<AIChatSession> {
    const supabase = await createClient();

    const session: Partial<AIChatSession> = {
      user_id,
      title: 'New Chat',
      messages: [],
      context: {},
      token_count: 0,
    };

    const { data, error } = await supabase
      .from('ai_chat_sessions')
      .insert(session)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  private async getSession(session_id: string, user_id: string): Promise<AIChatSession> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('ai_chat_sessions')
      .select('*')
      .eq('id', session_id)
      .eq('user_id', user_id)
      .single();

    if (error) throw error;
    return data;
  }

  private async saveMessages(
    session_id: string,
    user_id: string,
    newMessages: ChatMessage[]
  ): Promise<void> {
    const supabase = await createClient();

    const session = await this.getSession(session_id, user_id);
    const updatedMessages = [...session.messages, ...newMessages];

    // Generate title from first user message if needed
    const title = session.title === 'New Chat' && newMessages[0]?.role === 'user'
      ? newMessages[0].content.slice(0, 50) + (newMessages[0].content.length > 50 ? '...' : '')
      : session.title;

    await supabase
      .from('ai_chat_sessions')
      .update({
        messages: updatedMessages,
        title,
        last_message_at: new Date().toISOString(),
        token_count: session.token_count + this.estimateTokens(newMessages),
      })
      .eq('id', session_id);
  }

  private async getUserContext(user_id: string): Promise<any> {
    const supabase = await createClient();

    const { data: profile } = await supabase
      .from('user_fitness_profile')
      .select('*')
      .eq('user_id', user_id)
      .single();

    const { data: recentWorkouts } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(5);

    return {
      ...profile,
      recent_workouts: recentWorkouts || [],
    };
  }

  private estimateTokens(messages: ChatMessage[]): number {
    // Rough estimate: 1 token ≈ 4 characters
    const totalChars = messages.reduce((sum, msg) => sum + msg.content.length, 0);
    return Math.ceil(totalChars / 4);
  }

  /**
   * Get user's chat sessions
   */
  async getUserSessions(user_id: string): Promise<AIChatSession[]> {
    const supabase = await createClient();

    const { data } = await supabase
      .from('ai_chat_sessions')
      .select('*')
      .eq('user_id', user_id)
      .eq('archived', false)
      .order('last_message_at', { ascending: false });

    return data || [];
  }

  /**
   * Archive a session
   */
  async archiveSession(session_id: string, user_id: string): Promise<void> {
    const supabase = await createClient();

    await supabase
      .from('ai_chat_sessions')
      .update({ archived: true })
      .eq('id', session_id)
      .eq('user_id', user_id);
  }
}
