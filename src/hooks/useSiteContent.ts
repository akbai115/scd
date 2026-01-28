import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SiteContent {
    headerText: string;
    footerText: string;
    leftManifesto: string[];
    centerManifesto: string[];
    rightManifesto: string[];
    streamUrl: string;
    streamLive: boolean;
}

export const DEFAULTS: SiteContent = {
    headerText: "PHASE 2",
    footerText: "JAN 2026",
    leftManifesto: [
        "BUNDLERS TRYING TO FARM THE COMMUNITY",
        "WON’T BE REWARDED",
        "NO SHORTCUTS",
        "NO EXTRACTION",
        "NO FREE RIDE",
        "THIS ISN’T A LIQUIDITY EVENT",
        "IT’S ALIGNMENT",
        "IF YOU’RE HERE TO TAKE",
        "YOU’LL BE IGNORED",
        "IF YOU’RE HERE TO BUILD",
        "YOU’LL BE SEEN"
    ],
    centerManifesto: [
        "GREED ALWAYS SHOWS UP FIRST",
        "LOADING HEAVY BEFORE ANYTHING IS BUILT",
        "THINKING SIZE MEANS POWER",
        "THINKING CONTROL COMES FROM GRABBING",
        "THIS IS NOT A RACE",
        "THIS IS NOT A CASHOUT",
        "THIS IS NOT A GAME FOR EARLY HOARDERS",
        "WEIGHT TOO EARLY WARPS THE STRUCTURE",
        "AND THE STRUCTURE REMEMBERS WHO PRESSED IT",
        "CONVICTION IS QUIET",
        "PATIENCE IS DISCIPLINE",
        "IF YOU’RE HERE TO EXTRACT",
        "YOU WILL BE SEEN",
        "AND YOU WILL BE IGNORED",
        "THIS IS ABOUT BALANCE",
        "ABOUT TIMING",
        "ABOUT RESPECT FOR THE BUILD",
        "GREED DOESN’T GET REWARDED",
        "ALIGNMENT DOES"
    ],
    rightManifesto: [
        "THE ARK WAS NEVER ABOUT ESCAPE",
        "IT WAS ABOUT SELECTION",
        "THIS IS THE ONE",
        "DON’T DIVIDE",
        "NOT EVERYONE FITS",
        "NOT EVERYONE WANTS IT",
        "NOT EVERYONE SURVIVES",
        "THE FLOOD DOESN’T ANNOUNCE ITSELF",
        "THE ARK DOESN’T EXPLAIN",
        "THIS IS THE ONE",
        "DON’T DIVIDE",
        "THE ARK DOESN’T BEG",
        "IT WAITS 54F9DbbQqZJKQdweH8WnwBEa8MWVNhUUdP3NJFREpump"
    ],
    streamUrl: "",
    streamLive: false
};

export const useSiteContent = () => {
    const [content, setContent] = useState<SiteContent>(DEFAULTS);

    useEffect(() => {
        // 1. Fetch latest content updates
        const fetchContent = async () => {
            const { data } = await supabase
                .from('transmissions')
                .select('message, created_at')
                .eq('type', 'CONTENT_UPDATE')
                .order('created_at', { ascending: false })
                .limit(20);

            if (data) {
                // Reconstruct state from history (latest applied first)
                // Since we want the *latest* state, we can iterate backwards or just find the latest update for each key if we stored partials.
                // Simplified strategy: We assume 'CONTENT_UPDATE' messages contain a partial or full JSON object of updates.
                // We'll merge them onto defaults. 

                let merged = { ...DEFAULTS };
                // We process from oldest to newest to build up state, or just take the newest if it's a full snapshot.
                // Let's assume the admin panel sends the modified section.
                // We'll process from newest to oldest and pick the first found value for each key? 
                // No, simplest is: Look at the most recent update. If it's partial, we might miss previous partials. 
                // BETTER STRATEGY: Receive "SITE_STATE" type which is a full dump, or "CONTENT_UPDATE" which is partial.

                // Revised approach: iterate data (newest first).
                // If we want checking "Stream URL" we look for the first message that has it.

                const newContent: any = { ...DEFAULTS };
                const foundKeys = new Set();

                // This is a bit expensive if history is long, but for a few updates it's fine. 
                // Actually, let's just reverse and applying them.
                const reversed = [...data].reverse();
                reversed.forEach(record => {
                    try {
                        const payload = JSON.parse(record.message);
                        // payload could be { headerText: "..." }
                        Object.keys(payload).forEach(key => {
                            newContent[key] = payload[key];
                        });
                    } catch (e) {
                        // ignore non-json messages
                    }
                });

                setContent(newContent);
            }
        };

        fetchContent();

        // 2. Realtime listener
        const channel = supabase
            .channel('public:transmissions:content')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transmissions', filter: 'type=eq.CONTENT_UPDATE' }, (payload) => {
                const { message } = payload.new;
                try {
                    const updates = JSON.parse(message);
                    setContent(prev => ({ ...prev, ...updates }));
                } catch (e) {
                    console.error("Failed to parse content update", e);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return content;
};
