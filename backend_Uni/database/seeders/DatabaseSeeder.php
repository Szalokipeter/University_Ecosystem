<?php

namespace Database\Seeders;

use App\Models\Calendar;
use App\Models\Role;
use App\Models\UniUser;
use App\Models\User;
use App\Models\News;
use App\Models\PublicCalendar;
use App\Models\Schoolevent_user;
use App\Models\Todo;
use App\Models\User_Session;
use App\Models\User_Validation;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Role::factory()->create([
            "name" => "admin",
        ]);
        Role::factory()->create([
            "name" => "teacher",
        ]);
        Role::factory()->create([
            "name" => "user",
        ]);
        User_Session::factory()->create([
            'ip_address' => '127.0.0.2',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'payload' => 'a:0:{}',
            'last_activity' => now(),
        ]);
        User_Session::factory()->create([
            'ip_address' => '192.0.0.2',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'payload' => 'a:0:{}',
            'last_activity' => now(),
        ]);

        User_Validation::factory()->create([
            'validUntil' => now()->addDays(15),
            'approved' => 1,
            'approvedAt' => now()->addMinute(),
            'token' => '1234567890',
        ]);
        User_Validation::factory()->create([
            'validUntil' => now()->addDays(15),
            'approved' => 1,
            'approvedAt' => now()->addMinute(),
            'token' => '0987654321',
        ]);


        UniUser::factory()->create([
            'username' => 'admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('admin'),
            'roles_id' => 1,
            'sessions_id' => 1,
            'validations_id' => 1,
        ]);
        UniUser::factory()->create([
            'username' => 'teacher',
            'email' => 'teacher@teacher.com',
            'password' => bcrypt('teacher'),
            'roles_id' => 2,
            'sessions_id' => 1,
            'validations_id' => 1,
        ]);

        UniUser::factory()->create([
            'username' => 'user',
            'email' => 'user@user.com',
            'password' => bcrypt('user'),
            'roles_id' => 3,
            'sessions_id' => 1,
            'validations_id' => 1,
        ]);


        UniUser::factory(4)->create();

        $newsItems = [
    [
        'id' => 1,
        'title' => 'University Library Extends Weekend Hours',
        'body' => 'To better support students during exam preparation, the university library will now remain open until midnight on weekends starting May 10, 2023.',
        'created_at' => '2023-05-06 22:45:28',
        'updated_at' => '2023-05-10 13:52:10',
    ],
    [
        'id' => 2,
        'title' => 'Research Grant Awarded to Physics Department',
        'body' => 'The Physics Department has been awarded a $2 million research grant for renewable energy studies. The project is expected to begin in September 2023.',
        'created_at' => '2023-06-15 07:31:34',
        'updated_at' => '2023-06-18 15:00:00',
    ],
    [
        'id' => 3,
        'title' => 'Fall Semester Registration Now Open',
        'body' => 'Students can now register for fall semester courses. The registration period runs from July 1 to August 15, 2023. Late registration will incur a fee.',
        'created_at' => '2023-07-01 09:00:00',
        'updated_at' => '2023-07-01 09:00:00',
    ],
    [
        'id' => 4,
        'title' => 'New Campus Cafeteria Opens',
        'body' => 'A new cafeteria offering diverse meal options has opened in the Science Building. Students are encouraged to try the new menu.',
        'created_at' => '2023-08-20 12:00:00',
        'updated_at' => '2023-08-22 08:30:00',
    ],
    [
        'id' => 5,
        'title' => 'Annual Career Fair Scheduled for September',
        'body' => 'The university\'s Annual Career Fair will be held on September 25, 2023. Employers from various industries will be present to meet with students.',
        'created_at' => '2023-09-01 06:00:00',
        'updated_at' => '2023-09-01 08:00:00',
    ],
    [
        'id' => 6,
        'title' => 'Student Club Day Announced',
        'body' => 'Join us for Student Club Day on October 10, 2023, where you can learn about and join various student organizations on campus.',
        'created_at' => '2023-09-20 06:03:57',
        'updated_at' => '2023-10-01 09:00:00',
    ],
    [
    'id' => 7,
    'title' => 'Homecoming Weekend Events',
    'body' => 'Homecoming Weekend will feature a parade, sports events, and an alumni gala. Join us on October 25, 2023, to celebrate.',
    'created_at' => '2023-10-15 08:00:00',
    'updated_at' => '2023-10-20 18:00:00',
],
    [
        'id' => 8,
        'title' => 'Holiday Concert by Music Department',
        'body' => 'The Music Department will host its annual holiday concert on December 12, 2023, featuring performances by students and faculty.',
        'created_at' => '2023-11-01 10:00:00',
        'updated_at' => '2023-11-15 12:00:00',
    ],
    [
        'id' => 9,
        'title' => 'Spring Semester Orientation Scheduled',
        'body' => 'New students are invited to attend the Spring Semester Orientation on January 8, 2024, at the Student Center Auditorium.',
        'created_at' => '2023-12-15 14:00:00',
        'updated_at' => '2023-12-20 16:00:00',
    ],
    [
        'id' => 10,
        'title' => 'Scholarship Applications Open for 2024',
        'body' => 'Applications for the 2024 academic scholarships are now open. The deadline to apply is February 15, 2024.',
        'created_at' => '2024-01-02 09:00:00',
        'updated_at' => '2024-01-05 11:00:00',
    ],
];
        foreach ($newsItems as $news) {
            DB::table('news')->insert($news);
        }

        $events = [
            [
                'id' => 1,
                'title' => 'Mathematics Quiz - Algebra and Geometry',
                'body' => 'Participate in the upcoming quiz on algebra and geometry. It covers topics from chapters 4 to 6. Ensure you are prepared.',
                'uni_user_id' => 1,
                'event_type' => 'quiz',
                'dateofevent' => '2025-06-10 13:07:07',
                'created_at' => '2025-04-13 21:51:46',
                'updated_at' => '2025-04-13 21:51:46',
            ],
            [
                'id' => 2,
                'title' => 'Physics Quiz - Laws of Motion',
                'body' => 'This quiz focuses on the second and third laws of motion, including problem-solving scenarios. Be ready for practical applications.',
                'uni_user_id' => 1,
                'event_type' => 'quiz',
                'dateofevent' => '2025-06-15 05:27:07',
                'created_at' => '2025-04-13 21:51:46',
                'updated_at' => '2025-04-13 21:51:46',
            ],
            [
                'id' => 3,
                'title' => 'Library Orientation Session',
                'body' => 'Join the orientation session to familiarize yourself with library resources, digital catalogs, and research assistance services.',
                'uni_user_id' => 1,
                'event_type' => 'orientation',
                'dateofevent' => '2025-06-12 10:00:00',
                'created_at' => '2025-04-10 09:00:00',
                'updated_at' => '2025-04-10 09:00:00',
            ],
            [
                'id' => 4,
                'title' => 'Guest Lecture: Modern Astrophysics',
                'body' => 'Attend the guest lecture by Dr. Smith on recent advances in astrophysics and the discovery of exoplanets.',
                'uni_user_id' => 1,
                'event_type' => 'lecture',
                'dateofevent' => '2025-06-20 15:30:00',
                'created_at' => '2025-04-15 12:00:00',
                'updated_at' => '2025-04-15 12:00:00',
            ],
            [
                'id' => 5,
                'title' => 'Midterm Exam - Calculus',
                'body' => 'The midterm exam will cover differentiation and integration techniques discussed in the first half of the semester.',
                'uni_user_id' => 1,
                'event_type' => 'exam',
                'dateofevent' => '2025-06-25 09:00:00',
                'created_at' => '2025-04-20 08:00:00',
                'updated_at' => '2025-04-20 08:00:00',
            ],
            [
                'id' => 6,
                'title' => 'Study Group Meeting - Chemistry',
                'body' => 'Join your peers for a group study session focused on organic chemistry reactions and mechanisms.',
                'uni_user_id' => 1,
                'event_type' => 'study_group',
                'dateofevent' => '2025-06-05 18:00:00',
                'created_at' => '2025-04-18 16:00:00',
                'updated_at' => '2025-04-18 16:00:00',
            ],
            [
                'id' => 7,
                'title' => 'Final Exam - Biology 101',
                'body' => 'The final exam will cover all topics discussed in class, including cellular biology and genetics. Bring your ID and necessary supplies.',
                'uni_user_id' => 2,
                'event_type' => 'exam',
                'dateofevent' => '2025-06-10 05:43:40',
                'created_at' => '2025-04-13 21:51:46',
                'updated_at' => '2025-04-13 21:51:46',
            ],
            [
                'id' => 8,
                'title' => 'Chemistry Quiz - Periodic Table Trends',
                'body' => 'This quiz will focus on periodic table trends, including ionization energy and electronegativity. Prepare with the provided notes.',
                'uni_user_id' => 2,
                'event_type' => 'quiz',
                'dateofevent' => '2025-06-08 20:31:12',
                'created_at' => '2025-04-13 21:51:46',
                'updated_at' => '2025-04-13 21:51:46',
            ],
            [
                'id' => 9,
                'title' => 'Workshop - Lab Safety Procedures',
                'body' => 'A mandatory workshop on safety protocols and best practices in the laboratory environment.',
                'uni_user_id' => 2,
                'event_type' => 'workshop',
                'dateofevent' => '2025-06-05 14:00:00',
                'created_at' => '2025-04-20 09:00:00',
                'updated_at' => '2025-04-20 09:00:00',
            ],
            [
                'id' => 10,
                'title' => 'Biology Seminar - Genetic Engineering',
                'body' => 'Explore current research and ethical considerations in genetic engineering in this seminar led by Prof. Lee.',
                'uni_user_id' => 2,
                'event_type' => 'seminar',
                'dateofevent' => '2025-06-12 11:00:00',
                'created_at' => '2025-04-22 10:30:00',
                'updated_at' => '2025-04-22 10:30:00',
            ],
            [
                'id' => 11,
                'title' => 'Guest Lecture - Environmental Science',
                'body' => 'Join Dr. Green for a lecture on climate change impacts and sustainability practices.',
                'uni_user_id' => 2,
                'event_type' => 'lecture',
                'dateofevent' => '2025-06-15 16:00:00',
                'created_at' => '2025-04-23 13:00:00',
                'updated_at' => '2025-04-23 13:00:00',
            ],
            [
                'id' => 12,
                'title' => 'Study Group - Human Anatomy',
                'body' => 'Group study focused on the muscular and skeletal systems. Bring notes and textbooks.',
                'uni_user_id' => 2,
                'event_type' => 'study_group',
                'dateofevent' => '2025-06-09 17:00:00',
                'created_at' => '2025-04-19 15:00:00',
                'updated_at' => '2025-04-19 15:00:00',
            ],
            [
                'id' => 13,
                'title' => 'Workshop - Effective Study Techniques',
                'body' => 'Learn effective study techniques to boost your academic performance. This interactive workshop includes tips and group activities.',
                'uni_user_id' => 3,
                'event_type' => 'workshop',
                'dateofevent' => '2025-06-04 14:00:00',
                'created_at' => '2025-04-26 19:53:47',
                'updated_at' => '2025-04-26 19:55:17',
            ],
            [
                'id' => 14,
                'title' => 'Seminar - Career Planning for Students',
                'body' => 'Join our career planning seminar to explore potential career paths, develop a roadmap for success, and network with professionals.',
                'uni_user_id' => 3,
                'event_type' => 'seminar',
                'dateofevent' => '2025-06-12 10:30:00',
                'created_at' => '2025-04-26 19:53:47',
                'updated_at' => '2025-04-26 19:55:17',
            ],
            [
                'id' => 15,
                'title' => 'Orientation - Campus Tour',
                'body' => 'New students are invited to join a guided campus tour highlighting key facilities and services.',
                'uni_user_id' => 3,
                'event_type' => 'orientation',
                'dateofevent' => '2025-06-08 09:00:00',
                'created_at' => '2025-04-15 08:30:00',
                'updated_at' => '2025-04-15 08:30:00',
            ],
            [
                'id' => 16,
                'title' => 'Lecture - Introduction to Philosophy',
                'body' => 'Attend a lecture exploring foundational concepts and thinkers in philosophy.',
                'uni_user_id' => 3,
                'event_type' => 'lecture',
                'dateofevent' => '2025-06-14 13:00:00',
                'created_at' => '2025-04-18 11:00:00',
                'updated_at' => '2025-04-18 11:00:00',
            ],
            [
                'id' => 17,
                'title' => 'Final Exam - Sociology',
                'body' => 'Final exam covering all topics from the semester including social theories and case studies.',
                'uni_user_id' => 3,
                'event_type' => 'exam',
                'dateofevent' => '2025-06-20 09:30:00',
                'created_at' => '2025-04-20 10:00:00',
                'updated_at' => '2025-04-20 10:00:00',
            ],
            [
                'id' => 18,
                'title' => 'Study Group - Political Science',
                'body' => 'Weekly group study focusing on political systems and ideologies.',
                'uni_user_id' => 3,
                'event_type' => 'study_group',
                'dateofevent' => '2025-06-07 18:30:00',
                'created_at' => '2025-04-19 16:00:00',
                'updated_at' => '2025-04-19 16:00:00',
            ],
        ];
	foreach ($events as $ev) {
            DB::table('calendars')->insert($ev);
        }

 $todos = [
    // Todos for uni_user_id: 1
    [
        'id' => 1,
        'title' => 'Complete Project Report',
        'body' => 'Finalize the report for the software engineering project.',
        'status' => 'todo',
        'uni_user_id' => 1,
        'created_at' => '2025-04-13 21:51:46',
        'updated_at' => '2025-04-15 08:10:32',
    ],
    [
        'id' => 2,
        'title' => 'Prepare Presentation',
        'body' => 'Create slides for the end-of-semester presentation.',
        'status' => 'in-progress',
        'uni_user_id' => 1,
        'created_at' => '2025-04-13 21:51:46',
        'updated_at' => '2025-04-17 19:33:19',
    ],
    [
        'id' => 3,
        'title' => 'Research Paper Submission',
        'body' => 'Submit the draft for the AI research paper.',
        'status' => 'in-progress',
        'uni_user_id' => 1,
        'created_at' => '2025-04-13 21:51:46',
        'updated_at' => '2025-04-22 14:55:53',
    ],
    [
        'id' => 4,
        'title' => 'Library Visit',
        'body' => 'Visit the library to borrow reference materials.',
        'status' => 'todo',
        'uni_user_id' => 1,
        'created_at' => '2025-04-13 21:51:46',
        'updated_at' => '2025-04-14 17:13:03',
    ],
    [
        'id' => 5,
        'title' => 'Team Meeting',
        'body' => 'Attend the team meeting scheduled for April 20.',
        'status' => 'todo',
        'uni_user_id' => 1,
        'created_at' => '2025-04-15 05:44:45',
        'updated_at' => '2025-04-23 17:17:50',
    ],
    [
        'id' => 6,
        'title' => 'Revise Lecture Notes',
        'body' => 'Revise notes from the database systems class.',
        'status' => 'todo',
        'uni_user_id' => 1,
        'created_at' => '2025-04-15 08:00:00',
        'updated_at' => '2025-04-23 18:00:00',
    ],

    // Todos for uni_user_id: 2
    [
        'id' => 7,
        'title' => 'Plan Semester Activities',
        'body' => 'Draft a schedule for student club activities.',
        'status' => 'todo',
        'uni_user_id' => 2,
        'created_at' => '2025-04-14 09:00:00',
        'updated_at' => '2025-04-15 10:00:00',
    ],
    [
        'id' => 8,
        'title' => 'Organize Workshop',
        'body' => 'Coordinate logistics for the upcoming technical workshop.',
        'status' => 'todo',
        'uni_user_id' => 2,
        'created_at' => '2025-04-14 10:00:00',
        'updated_at' => '2025-04-15 11:00:00',
    ],
    [
        'id' => 9,
        'title' => 'Submit Funding Request',
        'body' => 'Prepare and submit the funding request for new lab equipment.',
        'status' => 'todo',
        'uni_user_id' => 2,
        'created_at' => '2025-04-14 11:00:00',
        'updated_at' => '2025-04-15 12:00:00',
    ],
    [
        'id' => 10,
        'title' => 'Conduct Peer Review',
        'body' => 'Review research papers submitted by peers.',
        'status' => 'todo',
        'uni_user_id' => 2,
        'created_at' => '2025-04-14 12:00:00',
        'updated_at' => '2025-04-15 13:00:00',
    ],
    [
        'id' => 11,
        'title' => 'Update Club Website',
        'body' => 'Refresh the content and design of the club website.',
        'status' => 'todo',
        'uni_user_id' => 2,
        'created_at' => '2025-04-14 13:00:00',
        'updated_at' => '2025-04-15 14:00:00',
    ],
    [
        'id' => 12,
        'title' => 'Organize Club Fair Booth',
        'body' => 'Set up the booth for the upcoming club fair.',
        'status' => 'todo',
        'uni_user_id' => 2,
        'created_at' => '2025-04-14 14:00:00',
        'updated_at' => '2025-04-15 15:00:00',
    ],

    // Todos for uni_user_id: 3
    [
        'id' => 13,
        'title' => 'Prepare Lab Report',
        'body' => 'Complete the lab report for the physics experiment.',
        'status' => 'todo',
        'uni_user_id' => 3,
        'created_at' => '2025-04-16 09:00:00',
        'updated_at' => '2025-04-16 10:00:00',
    ],
    [
        'id' => 14,
        'title' => 'Group Study Session',
        'body' => 'Attend the group study session for the upcoming exams.',
        'status' => 'todo',
        'uni_user_id' => 3,
        'created_at' => '2025-04-16 11:00:00',
        'updated_at' => '2025-04-16 12:00:00',
    ],
    [
        'id' => 15,
        'title' => 'Apply for Internship',
        'body' => 'Submit the application for the summer internship program.',
        'status' => 'todo',
        'uni_user_id' => 3,
        'created_at' => '2025-04-16 13:00:00',
        'updated_at' => '2025-04-16 14:00:00',
    ],
    [
        'id' => 16,
        'title' => 'Attend Career Counseling',
        'body' => 'Schedule and attend a session with the career counselor.',
        'status' => 'todo',
        'uni_user_id' => 3,
        'created_at' => '2025-04-16 15:00:00',
        'updated_at' => '2025-04-16 16:00:00',
    ],
    [
        'id' => 17,
        'title' => 'Update Resume',
        'body' => 'Revise and update the resume with recent accomplishments.',
        'status' => 'todo',
        'uni_user_id' => 3,
        'created_at' => '2025-04-16 17:00:00',
        'updated_at' => '2025-04-16 18:00:00',
    ],
    [
        'id' => 18,
        'title' => 'Join Networking Event',
        'body' => 'Attend the networking event hosted by alumni.',
        'status' => 'todo',
        'uni_user_id' => 3,
        'created_at' => '2025-04-16 19:00:00',
        'updated_at' => '2025-04-16 20:00:00',
    ],
];
        foreach ($todos as $todo) {
            DB::table('todos')->insert($todo);
        }

$Pevents = [
    [
        'id' => 1,
        'title' => 'Campus Open Day: Explore Our Facilities',
        'body' => 'Join us for the annual Campus Open Day to tour the new science labs, library, and sports complex. Meet faculty members and discover student resources.',
        'event_type' => 'Open to Public',
        'dateofevent' => '2025-06-11 12:46:51',
        'created_at' => '2025-04-13 21:51:46',
        'updated_at' => '2025-04-13 21:51:46',
    ],
    [
        'id' => 2,
        'title' => 'Student Government Elections Kickoff',
        'body' => 'Nominations are now open for the student government elections. Learn about the roles, responsibilities, and how to get involved in campus leadership.',
        'event_type' => 'Student Affairs',
        'dateofevent' => '2025-06-30 07:55:56',
        'created_at' => '2025-04-13 21:51:46',
        'updated_at' => '2025-04-13 21:51:46',
    ],
    [
        'id' => 3,
        'title' => 'Family Weekend: Activities for All Ages',
        'body' => 'Bring your family to campus for a weekend filled with fun activities, tours, and social events designed for students and their loved ones.',
        'event_type' => 'Family Affairs',
        'dateofevent' => '2025-06-13 09:54:31',
        'created_at' => '2025-04-13 21:51:46',
        'updated_at' => '2025-04-13 21:51:46',
    ],
    [
        'id' => 4,
        'title' => 'Mandatory Registration for Summer Workshops',
        'body' => 'Students interested in summer workshops must complete their registration by June 1. Workshops include creative writing, robotics, and leadership training.',
        'event_type' => 'Registration Required',
        'dateofevent' => '2025-06-25 10:19:13',
        'created_at' => '2025-04-13 21:51:46',
        'updated_at' => '2025-04-13 21:51:46',
    ],
    [
        'id' => 5,
        'title' => 'Career Services: Resume Review Sessions',
        'body' => 'Career Services offers one-on-one resume review appointments this month. Get professional feedback and tips to improve your job application materials.',
        'event_type' => 'Student Affairs',
        'dateofevent' => '2025-06-06 12:10:47',
        'created_at' => '2025-04-13 21:51:46',
        'updated_at' => '2025-04-13 21:51:46',
    ],
    [
        'id' => 6,
        'title' => 'Mental Health Awareness Workshop',
        'body' => 'Join our mental health awareness workshop to learn stress management techniques, campus resources, and how to support friends in need.',
        'event_type' => 'Student Affairs',
        'dateofevent' => '2025-06-02 08:28:17',
        'created_at' => '2025-04-13 21:51:46',
        'updated_at' => '2025-04-13 21:51:46',
    ],
    [
        'id' => 7,
        'title' => 'Public Lecture: Climate Change and Sustainability',
        'body' => 'Esteemed environmental scientists will discuss recent climate change research and sustainable practices in urban development. Open to all.',
        'event_type' => 'Open to Public',
        'dateofevent' => '2025-06-15 14:00:00',
        'created_at' => '2025-04-15 10:00:00',
        'updated_at' => '2025-04-15 10:00:00',
    ],
    [
        'id' => 8,
        'title' => 'Student Health Fair',
        'body' => 'The annual Student Health Fair provides free screenings, wellness information, and fitness challenges. Take steps to improve your health this semester.',
        'event_type' => 'Student Affairs',
        'dateofevent' => '2025-06-18 09:30:00',
        'created_at' => '2025-04-15 10:05:00',
        'updated_at' => '2025-04-15 10:05:00',
    ],
    [
        'id' => 9,
        'title' => 'Family Support Services Orientation',
        'body' => 'Learn about the family support services available on campus, including counseling, childcare options, and family-friendly study spaces.',
        'event_type' => 'Family Affairs',
        'dateofevent' => '2025-06-20 11:15:00',
        'created_at' => '2025-04-15 10:10:00',
        'updated_at' => '2025-04-15 10:10:00',
    ],
    [
        'id' => 10,
        'title' => 'Workshop Registration Deadline Reminder',
        'body' => 'Reminder: The deadline to register for fall semester workshops is June 25. Late registrations will not be accepted.',
        'event_type' => 'Registration Required',
        'dateofevent' => '2025-06-22 16:00:00',
        'created_at' => '2025-04-15 10:15:00',
        'updated_at' => '2025-04-15 10:15:00',
    ],
];

foreach ($Pevents as $event) {
    DB::table('public_calendars')->insert($event);
}

        Schoolevent_user::factory()->create(["uni_user_id" => 1, "schoolevent_id" => 1]);
        Schoolevent_user::factory()->create(["uni_user_id" => 2, "schoolevent_id" => 1]);
        Schoolevent_user::factory()->create(["uni_user_id" => 4, "schoolevent_id" => 2]);
        Schoolevent_user::factory()->create(["uni_user_id" => 2, "schoolevent_id" => 2]);
        Schoolevent_user::factory()->create(["uni_user_id" => 3, "schoolevent_id" => 3]);
        Schoolevent_user::factory()->create(["uni_user_id" => 2, "schoolevent_id" => 3]);

        User_Validation::factory()->create([
            'validUntil' => now()->addDays(15),
            'approved' => 0,
            'token' => '40OlKKcLo3zZORKBLtupK5IjI8Ybh9Z1',
        ]);

        DB::table('personal_access_tokens')->insert([
            'tokenable_type' => 'App\Models\UniUser',
            'tokenable_id' => 1,
            'name' => 'auth_token',
            'token' => hash("sha256" ,'i9sF06pWSKiUlegNWtYS3aoK0h7XH9JQ1f1fdfxI42c07ca2'),
            'abilities' => json_encode(['*']),
            'last_used_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

    }
}
