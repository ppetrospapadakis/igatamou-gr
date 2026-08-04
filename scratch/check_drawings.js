const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://hqabeqlvnqdvipnspjog.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYWJlcWx2bnFkdmlwbnNwam9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MDQzNDMsImV4cCI6MjEwMDk4MDM0M30.nmB5WOUN-WFQRhRxS14yCLK7X5I8OqJbWk-lRtR0yDg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkDrawings() {
    console.log('Fetching drawings from Supabase...');
    const { data, error } = await supabase.from('drawings').select('*');
    if (error) {
        console.error('Error fetching drawings:', error);
        return;
    }
    console.log(`Found ${data.length} drawings in Supabase:`);
    data.forEach(d => {
        console.log(`- ID: ${d.id}, Name: ${d.name}, Status: ${d.status}, Likes: ${d.likes}`);
    });
}

checkDrawings();
