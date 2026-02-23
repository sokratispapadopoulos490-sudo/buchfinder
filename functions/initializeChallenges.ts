import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user || user.role !== 'admin') {
            return Response.json({ error: 'Admin only' }, { status: 403 });
        }

        // Check if challenges already exist
        const existingChallenges = await base44.asServiceRole.entities.ReadingChallenge.list();
        if (existingChallenges && existingChallenges.length > 0) {
            return Response.json({ message: 'Challenges already initialized' });
        }

        // Create default challenges
        const challenges = [
            {
                title: 'Jahresleser',
                description: 'Lese 12 Bücher in diesem Jahr',
                goal_type: 'books',
                goal_value: 12,
                start_date: '2026-01-01',
                end_date: '2026-12-31',
                is_public: true,
                participant_count: 0
            },
            {
                title: 'Seiten-Sprinter',
                description: 'Lese 1000 Seiten in einem Monat',
                goal_type: 'pages',
                goal_value: 1000,
                start_date: '2026-02-01',
                end_date: '2026-02-28',
                is_public: true,
                participant_count: 0
            },
            {
                title: 'Genre-Entdecker',
                description: 'Lese 5 verschiedene Genres',
                goal_type: 'genres',
                goal_value: 5,
                start_date: '2026-01-01',
                end_date: '2026-06-30',
                is_public: true,
                participant_count: 0
            },
            {
                title: 'Klassiker-Sammler',
                description: 'Lese 3 Klassiker der Literatur',
                goal_type: 'books',
                goal_value: 3,
                start_date: '2026-01-01',
                end_date: '2026-12-31',
                is_public: true,
                participant_count: 0
            }
        ];

        await base44.asServiceRole.entities.ReadingChallenge.bulkCreate(challenges);
        
        return Response.json({ message: 'Challenges initialized successfully', count: challenges.length });
    } catch (error) {
        console.error('Error initializing challenges:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});