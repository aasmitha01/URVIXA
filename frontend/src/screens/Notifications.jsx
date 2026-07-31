import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import { PageHeader } from '../components/Layout.jsx';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../lib/auth.jsx';

export function Notifications() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  const load = async () => {
    if (!user) return;
    try {
      const { data } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setItems(data ?? []);
    } catch {}
  };

  useEffect(() => { load(); }, [user]);

  const markRead = async () => {
    if (!user) return;
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id);
      load();
    } catch {}
  };

  return (
    <div className="space-y-8 font-normal">
      <PageHeader
        title="Urvixa Notifications"
        subtitle="Weather alerts, soil analysis completions & market rate updates."
        action={
          <button onClick={markRead} className="btn-ghost text-xs sm:text-sm font-extrabold">
            <CheckCheck className="h-4.5 w-4.5" /> Mark All as Read
          </button>
        }
      />

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="glass-card p-12 text-center text-sm font-extrabold text-[#1E293B] dark:text-[#E2E8F0]">
            No new notifications.
          </div>
        ) : (
          items.map((item) => (
            <motion.div
              whileHover={{ y: -2 }}
              key={item.id}
              className={`glass-card p-5 flex items-start gap-4 ${!item.is_read ? 'border-[#0284C7] bg-white' : ''}`}
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#E0F2FE] dark:bg-[#0284C7]/30 text-[#0284C7] dark:text-[#7DD3FC]">
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-[#020617] dark:text-white">{item.title}</h4>
                  <span className="text-xs font-extrabold text-[#1E293B] dark:text-[#E2E8F0]">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-xs sm:text-sm font-extrabold text-[#1E293B] dark:text-[#E2E8F0] mt-1">{item.message}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
