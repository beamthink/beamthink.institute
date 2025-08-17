# BEAM Admin Dashboard

A comprehensive admin dashboard for managing BEAM Institute's NGOs, users, donations, and system events.

## Features

### 🏢 NGO Management
- View and manage all NGOs across 6 sectors
- Track subdomain status and deployments
- Monitor NGO partnerships and status
- ReadyAimGo integration status

### 👥 User Management
- View registered community members
- Filter users by NGO, city, role, and status
- Track user activity and last login
- Manage user roles and permissions

### 💰 Donation Tracking
- Monitor donations across all NGOs
- Track payment status and methods
- Filter by date ranges and amounts
- Export donation data

### 📊 Event Logs
- Real-time system event monitoring
- Webhook event tracking (donations, milestones)
- Error and warning notifications
- Event processing status

### 📈 Dashboard Overview
- Key metrics and statistics
- Recent activity feed
- Top performing NGOs
- System health indicators

## Tech Stack

- **Frontend**: Next.js 14 + React + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **API**: Next.js API Routes
- **State Management**: Custom React Hooks

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm or npm
- Supabase project setup

### Installation
1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

### Running the Dashboard
1. Start the development server: `pnpm dev`
2. Navigate to `/admin` in your browser
3. Access the admin dashboard

## API Endpoints

### `/api/admin/ngos`
- `GET`: Fetch all NGOs with metadata
- `POST`: Create new NGO

### `/api/admin/users`
- `GET`: Fetch users with filtering options
- `POST`: Create new user

### `/api/admin/donations`
- `GET`: Fetch donations with filtering
- `POST`: Record new donation

### `/api/admin/events`
- `GET`: Fetch system events
- `POST`: Log new event

## Data Structure

### NGO Data
```typescript
interface AdminNGO {
  id: string;
  name: string;
  description: string;
  sector: string;
  status: 'Active Partner' | 'Strategic Partner' | 'Emerging Partner';
  website?: string;
  readyaimgoLink?: string;
  subdomain_status?: 'active' | 'inactive';
  deployment_status?: 'deployed' | 'not_deployed';
}
```

### User Data
```typescript
interface AdminUser {
  id: number;
  name: string;
  email: string;
  ngo: string;
  city: string;
  role: string;
  status: 'active' | 'inactive';
  created_at: string;
  last_login: string | null;
}
```

### Donation Data
```typescript
interface AdminDonation {
  id: number;
  ngo: string;
  amount: number;
  donor: string;
  status: 'completed' | 'pending';
  payment_method: string;
  transaction_id: string;
  created_at: string;
}
```

### Event Data
```typescript
interface AdminEvent {
  id: number;
  type: string;
  ngo: string;
  data: any;
  timestamp: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  source: string;
  processed: boolean;
}
```

## Customization

### Adding New Sectors
1. Update `lib/ngo-data.ts` with new sector data
2. Add sector-specific styling in the dashboard
3. Update filtering logic in API routes

### Adding New Event Types
1. Define event type in the events API
2. Add severity levels and processing logic
3. Update the events display component

### Custom Filters
1. Extend the `AdminFilters` interface
2. Update API route filtering logic
3. Add filter UI components

## Security Considerations

- Admin routes should be protected with authentication
- Implement role-based access control
- Validate all input data
- Use Supabase RLS policies
- Audit logging for admin actions

## Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Advanced analytics and reporting
- [ ] Bulk operations for NGOs and users
- [ ] Integration with Vercel API for deployment status
- [ ] Automated health checks and alerts
- [ ] Export functionality for all data types
- [ ] Mobile-responsive admin interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of BEAM Institute and follows the same licensing terms.
