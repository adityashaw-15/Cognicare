package com.jarvis.config;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.jarvis.entity.Caregiver;
import com.jarvis.entity.CaregiverAlert;
import com.jarvis.entity.CognitiveGame;
import com.jarvis.entity.DailyActivity;
import com.jarvis.entity.GameResult;
import com.jarvis.entity.GameSession;
import com.jarvis.entity.HealthcareWorker;
import com.jarvis.entity.Memory;
import com.jarvis.entity.MemoryCategory;
import com.jarvis.entity.MoodEntry;
import com.jarvis.entity.Patient;
import com.jarvis.entity.Reminder;
import com.jarvis.entity.Role;
import com.jarvis.entity.UserAccount;
import com.jarvis.repository.CaregiverAlertRepository;
import com.jarvis.repository.CaregiverRepository;
import com.jarvis.repository.CognitiveGameRepository;
import com.jarvis.repository.DailyActivityRepository;
import com.jarvis.repository.GameResultRepository;
import com.jarvis.repository.GameSessionRepository;
import com.jarvis.repository.HealthcareWorkerRepository;
import com.jarvis.repository.MemoryCategoryRepository;
import com.jarvis.repository.MemoryRepository;
import com.jarvis.repository.MoodEntryRepository;
import com.jarvis.repository.PatientRepository;
import com.jarvis.repository.ReminderRepository;
import com.jarvis.repository.UserAccountRepository;
import com.jarvis.security.PasswordService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataSeeder implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserAccountRepository users;
    private final PatientRepository patients;
    private final CaregiverRepository caregivers;
    private final HealthcareWorkerRepository workers;
    private final MemoryCategoryRepository categories;
    private final MemoryRepository memories;
    private final CognitiveGameRepository games;
    private final GameSessionRepository sessions;
    private final GameResultRepository results;
    private final ReminderRepository reminders;
    private final MoodEntryRepository moods;
    private final DailyActivityRepository activities;
    private final CaregiverAlertRepository alerts;
    private final PasswordService passwords;

    public DataSeeder(
            UserAccountRepository users,
            PatientRepository patients,
            CaregiverRepository caregivers,
            HealthcareWorkerRepository workers,
            MemoryCategoryRepository categories,
            MemoryRepository memories,
            CognitiveGameRepository games,
            GameSessionRepository sessions,
            GameResultRepository results,
            ReminderRepository reminders,
            MoodEntryRepository moods,
            DailyActivityRepository activities,
            CaregiverAlertRepository alerts,
            PasswordService passwords) {
        this.users = users;
        this.patients = patients;
        this.caregivers = caregivers;
        this.workers = workers;
        this.categories = categories;
        this.memories = memories;
        this.games = games;
        this.sessions = sessions;
        this.results = results;
        this.reminders = reminders;
        this.moods = moods;
        this.activities = activities;
        this.alerts = alerts;
        this.passwords = passwords;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (users.count() > 0) {
            return;
        }
        log.info("Seeding JARVIS demo data");

        Patient patient = new Patient();
        patient.setId("patient-anjali");
        patient.setUser(user("user-patient-anjali", "Anjali Sharma", "patient@jarvis.demo", Role.PATIENT));
        patient.setAge(68);
        patient.setCity("Guwahati");
        patient.setPreferredLanguage("en");
        patient.setDifficultyLevel(2);
        patient.setCareNotes("Demo patient profile for cognitive support and routine assistance.");
        patients.save(patient);

        Caregiver caregiver = new Caregiver();
        caregiver.setId("caregiver-rahul");
        caregiver.setUser(user("user-caregiver-rahul", "Rahul Sharma", "caregiver@jarvis.demo", Role.CAREGIVER));
        caregiver.setRelationship("Son");
        caregiver.setPhone("+91 90000 00000");
        caregiver.getPatients().add(patient);
        caregivers.save(caregiver);

        HealthcareWorker worker = new HealthcareWorker();
        worker.setId("worker-demo");
        worker.setUser(user("user-worker-demo", "Dr. Meera Iyer", "worker@jarvis.demo", Role.HEALTHCARE_WORKER));
        worker.setOrganization("Demo Memory Support Clinic");
        worker.getPatients().add(patient);
        workers.save(worker);

        MemoryCategory family = category("cat-family", patient, "Family");
        MemoryCategory places = category("cat-places", patient, "Local Places");
        MemoryCategory favorites = category("cat-favorites", patient, "Favorites");
        categories.saveAll(List.of(family, places, favorites));

        memories.saveAll(List.of(
                memory("memory-ananya", patient, family, "Ananya", "Daughter", "Family home",
                        "Evening tea together", null, "Rice and vegetables", "Old Hindi classics",
                        "/assets/family-photo.svg", "Ananya visits on weekends and likes to bring jasmine flowers.",
                        "Who is Ananya, and how is she connected to you?"),
                memory("memory-darjeeling", patient, places, "Rahul", "Son", "Darjeeling",
                        "Family trip in 2023", "Blue shawl", null, null,
                        "/assets/darjeeling-memory.svg", "The family visited Darjeeling together in 2023.",
                        "Where did you visit with Rahul in 2023?"),
                memory("memory-festival", patient, favorites, "Family", "Loved ones", "Guwahati",
                        "Bihu celebration", "Traditional scarf", "Pitha", "Folk songs",
                        "/assets/festival-memory.svg", "The family enjoys Bihu celebrations and familiar songs.",
                        "Which festival is connected with this family memory?")));

        List<CognitiveGame> seededGames = List.of(
                game("game-memory-match", "Memory Matching", "MEMORY_MATCHING", "Match familiar objects and exercise short-term recall.", 2),
                game("game-sequence", "Sequence Recall", "SEQUENCE_RECALL", "Repeat a gentle sequence of colors.", 2),
                game("game-pattern", "Pattern Recognition", "PATTERN_RECOGNITION", "Choose the item that completes the pattern.", 2),
                game("game-object", "Familiar Object Quiz", "OBJECT_RECOGNITION", "Answer questions from familiar memories.", 1),
                game("game-routine", "Daily Routine Recall", "ROUTINE_RECALL", "Recall the next step in today's routine.", 2),
                game("game-attention", "Attention Focus", "ATTENTION", "Tap target cards while ignoring distractions.", 3));
        games.saveAll(seededGames);

        LocalDate today = LocalDate.now();
        reminders.saveAll(List.of(
                reminder("reminder-medicine", patient, "Morning medicine", "Take morning medicine after breakfast.", today, LocalTime.of(9, 0), "Medicine", "high", false),
                reminder("reminder-hydration", patient, "Hydration", "Drink a full glass of water.", today, LocalTime.of(10, 30), "Hydration", "medium", false),
                reminder("reminder-memory", patient, "Memory activity", "Complete one JARVIS memory activity.", today, LocalTime.of(11, 0), "Cognitive Activity", "medium", false),
                reminder("reminder-appointment", patient, "Doctor appointment", "Clinic appointment with caregiver support.", today, LocalTime.of(16, 0), "Appointment", "high", false)));

        activities.saveAll(List.of(
                activity("activity-medicine", patient, "Morning Medicine", LocalTime.of(8, 0), "Medicine", true),
                activity("activity-breakfast", patient, "Breakfast", LocalTime.of(9, 0), "Meals", true),
                activity("activity-memory", patient, "Memory Activity", LocalTime.of(11, 0), "Cognitive Activity", false),
                activity("activity-lunch", patient, "Lunch", LocalTime.of(13, 0), "Meals", true),
                activity("activity-appointment", patient, "Doctor Appointment", LocalTime.of(16, 0), "Appointment", false),
                activity("activity-walk", patient, "Walk / Exercise", LocalTime.of(18, 0), "Exercise", false)));

        moods.saveAll(List.of(
                mood("mood-1", patient, today.minusDays(3), "Okay", "Calm morning routine."),
                mood("mood-2", patient, today.minusDays(2), "Good", "Enjoyed family photos."),
                mood("mood-3", patient, today.minusDays(1), "Neutral", "Needed a reminder for hydration.")));

        seedResults(patient, seededGames);

        CaregiverAlert alert = new CaregiverAlert();
        alert.setId("alert-memory-activity");
        alert.setPatient(patient);
        alert.setCaregiver(caregiver);
        alert.setMessage("Patient has not completed today's cognitive activity.");
        alert.setSeverity("INFO");
        alert.setGeneratedAt(Instant.now());
        alerts.save(alert);
    }

    private UserAccount user(String id, String name, String email, Role role) {
        UserAccount account = new UserAccount();
        account.setId(id);
        account.setDisplayName(name);
        account.setEmail(email);
        account.setRole(role);
        account.setPasswordHash(passwords.hash("demo123"));
        return account;
    }

    private MemoryCategory category(String id, Patient patient, String name) {
        MemoryCategory category = new MemoryCategory();
        category.setId(id);
        category.setPatient(patient);
        category.setName(name);
        return category;
    }

    private Memory memory(String id, Patient patient, MemoryCategory category, String personName, String relationship,
                          String placeName, String eventName, String favoriteObject, String favoriteFood,
                          String favoriteSong, String imageUrl, String note, String promptSeed) {
        Memory memory = new Memory();
        memory.setId(id);
        memory.setPatient(patient);
        memory.setCategory(category);
        memory.setPersonName(personName);
        memory.setRelationship(relationship);
        memory.setPlaceName(placeName);
        memory.setEventName(eventName);
        memory.setFavoriteObject(favoriteObject);
        memory.setFavoriteFood(favoriteFood);
        memory.setFavoriteSong(favoriteSong);
        memory.setImageUrl(imageUrl);
        memory.setNote(note);
        memory.setPromptSeed(promptSeed);
        return memory;
    }

    private CognitiveGame game(String id, String name, String type, String description, int difficulty) {
        CognitiveGame game = new CognitiveGame();
        game.setId(id);
        game.setName(name);
        game.setType(type);
        game.setDescription(description);
        game.setSuggestedDifficulty(difficulty);
        return game;
    }

    private Reminder reminder(String id, Patient patient, String title, String description, LocalDate date,
                              LocalTime time, String category, String priority, boolean completed) {
        Reminder reminder = new Reminder();
        reminder.setId(id);
        reminder.setPatient(patient);
        reminder.setTitle(title);
        reminder.setDescription(description);
        reminder.setDate(date);
        reminder.setTime(time);
        reminder.setCategory(category);
        reminder.setPriority(priority);
        reminder.setCompleted(completed);
        reminder.setRepeatRule("daily");
        return reminder;
    }

    private DailyActivity activity(String id, Patient patient, String title, LocalTime time, String category, boolean completed) {
        DailyActivity activity = new DailyActivity();
        activity.setId(id);
        activity.setPatient(patient);
        activity.setTitle(title);
        activity.setTime(time);
        activity.setCategory(category);
        activity.setCompleted(completed);
        return activity;
    }

    private MoodEntry mood(String id, Patient patient, LocalDate date, String mood, String note) {
        MoodEntry entry = new MoodEntry();
        entry.setId(id);
        entry.setPatient(patient);
        entry.setEntryDate(date);
        entry.setMood(mood);
        entry.setNote(note);
        return entry;
    }

    private void seedResults(Patient patient, List<CognitiveGame> seededGames) {
        int score = 64;
        for (int i = 0; i < seededGames.size(); i++) {
            CognitiveGame game = seededGames.get(i);
            GameSession session = new GameSession();
            session.setId("session-demo-" + i);
            session.setPatient(patient);
            session.setGame(game);
            session.setDifficulty(Math.min(5, 1 + i % 3));
            session.setStartedAt(Instant.now().minusSeconds(86_400L * (i + 1)));
            session.setCompletedAt(Instant.now().minusSeconds(86_200L * (i + 1)));
            session.setStatus("COMPLETED");
            sessions.save(session);

            GameResult result = new GameResult();
            result.setId("result-demo-" + i);
            result.setPatient(patient);
            result.setGameSession(session);
            result.setClientOperationId("seed-result-" + i);
            result.setAccuracy(Math.min(94, score + i * 4));
            result.setResponseTimeSeconds(Math.max(22, 48 - i * 3));
            result.setAttempts(Math.max(2, 6 - i % 3));
            result.setScore(Math.min(96, score + i * 5));
            result.setHintsUsed(i % 2);
            result.setDifficulty(session.getDifficulty());
            result.setSessionDurationSeconds(80 + i * 9);
            result.setSummary("Demo progress sample for activity tracking.");
            results.save(result);
        }
    }
}

