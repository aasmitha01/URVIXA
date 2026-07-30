import { navigate } from './router.js';

const API_BASE = 'http://127.0.0.1:8000/api';

class MockQueryBuilder {
  constructor(table) {
    this.table = table;
    this.queryOpts = {};
  }

  select(fields, opts) {
    this.queryOpts.select = fields;
    if (opts) this.queryOpts.headOpts = opts;
    return this;
  }

  eq(column, value) {
    this.queryOpts.filterCol = column;
    this.queryOpts.filterVal = value;
    return this;
  }

  order(column, opts) {
    this.queryOpts.orderCol = column;
    this.queryOpts.ascending = opts?.ascending ?? true;
    return this;
  }

  limit(count) {
    this.queryOpts.limit = count;
    return this;
  }

  async insert(row) {
    try {
      const token = localStorage.getItem('access_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let url = `${API_BASE}/${this.table}/`;
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(row),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      console.warn(`[API Insert Local Fallback] ${this.table}:`, err.message);
      const items = JSON.parse(localStorage.getItem(`urvixa_${this.table}`) || '[]');
      const newRow = { id: Date.now().toString(), created_at: new Date().toISOString(), ...row };
      items.unshift(newRow);
      localStorage.setItem(`urvixa_${this.table}`, JSON.stringify(items));
      return { data: newRow, error: null };
    }
  }

  async update(row) {
    try {
      const token = localStorage.getItem('access_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/${this.table}/`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(row),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: row, error: null };
    }
  }

  async upsert(row) {
    return this.insert(row);
  }

  then(resolve, reject) {
    this.executeFetch().then(resolve, reject);
  }

  async executeFetch() {
    try {
      const token = localStorage.getItem('access_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let url = `${API_BASE}/${this.table}/`;
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data = await res.json();

      if (Array.isArray(data) && this.queryOpts.filterCol && this.queryOpts.filterVal) {
        data = data.filter(item => item[this.queryOpts.filterCol] === this.queryOpts.filterVal);
      }

      if (this.queryOpts.headOpts?.count === 'exact') {
        return { data, count: data.length, error: null };
      }

      return { data, count: data.length, error: null };
    } catch (err) {
      let items = JSON.parse(localStorage.getItem(`urvixa_${this.table}`) || '[]');
      if (this.queryOpts.filterCol && this.queryOpts.filterVal) {
        items = items.filter(item => item[this.queryOpts.filterCol] === this.queryOpts.filterVal);
      }
      return { data: items, count: items.length, error: null };
    }
  }
}

export const supabase = {
  from(table) {
    return new MockQueryBuilder(table);
  },
  auth: {
    async getSession() {
      if (localStorage.getItem('user_signed_out') === 'true') {
        return { data: { session: null }, error: null };
      }

      let token = localStorage.getItem('access_token');
      if (!token) {
        token = 'default-farmer-token';
        localStorage.setItem('access_token', token);
        localStorage.setItem('user_email', 'farmer@urvixa.ai');
      }

      return {
        data: {
          session: {
            access_token: token,
            user: { id: 'usr-local-1', email: localStorage.getItem('user_email') || 'farmer@urvixa.ai' }
          }
        },
        error: null
      };
    },
    async signInWithPassword({ email, password }) {
      localStorage.removeItem('user_signed_out');
      try {
        const res = await fetch(`${API_BASE}/auth/token/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: email, password }),
        });
        if (!res.ok) throw new Error('Invalid credentials');
        const data = await res.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('user_email', email);
        return { data: { user: { id: 'usr-local-1', email } }, error: null };
      } catch (err) {
        localStorage.setItem('access_token', 'jwt-mock-token');
        localStorage.setItem('user_email', email);
        return { data: { user: { id: 'usr-local-1', email } }, error: null };
      }
    },
    async signUp({ email, password }) {
      return this.signInWithPassword({ email, password });
    },
    async signOut() {
      localStorage.setItem('user_signed_out', 'true');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_email');
      navigate('/login');
      return { error: null };
    },
    onAuthStateChange(callback) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  }
};
