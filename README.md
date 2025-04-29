# Global Pricing Platform

A sophisticated platform that enables digital product creators to implement intelligent, region-based pricing strategies to maximize global revenue while maintaining fair pricing across different markets.

## 🌟 Key Features

### 1. Smart Global Pricing
- Automatic currency detection and conversion
- Purchasing Power Parity (PPP) based pricing
- Region-specific discount management
- Revenue optimization algorithms

### 2. Product Management
- Multi-product support
- Customizable product details
- Domain integration
- Product analytics and tracking

### 3. Customization Tools
- Site configuration management
- Customizable banner system
- A/B testing capabilities
- Advanced analytics dashboard

### 4. User Management
- Multi-user support
- Role-based access control
- User activity tracking
- Secure authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Gokul-Nath-27/parity-promo-engine.git
cd parity-promo-engine
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Initialize the database:
```bash
pnpm db:migrate
```

5. Start the development server:
```bash
pnpm dev
```

## 📦 Project Structure

```
src/
├── app/                    # Next.js app router
├── components/            # Reusable UI components
├── features/             # Feature-specific modules
│   ├── products/        # Product management
│   ├── customization/   # Site customization
│   ├── discounts/      # Discount management
│   └── marketing/      # Marketing components
├── drizzle/             # Database schema and migrations
└── lib/                 # Utility functions and shared code
```

## 🔧 Configuration

### Database
The application uses PostgreSQL with Drizzle ORM. Database configuration can be found in:
- `src/drizzle/schemas/` - Database schemas
- `src/drizzle/migrations/` - Database migrations

### Environment Variables
Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL` - Application base URL
- `NEXTAUTH_SECRET` - Authentication secret
- `NEXTAUTH_URL` - Authentication callback URL

## 🛠️ Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Document complex logic with comments

### Database Changes
1. Create new migration:
```bash
pnpm db:generate
```

2. Apply migrations:
```bash
pnpm db:migrate
```

## 📈 Performance Optimization

- Implement caching strategies
- Optimize database queries
- Use proper indexing
- Monitor application performance

## 🔒 Security

- Implement proper authentication
- Use secure session management
- Validate all user inputs
- Regular security audits
- Keep dependencies updated

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email gokulnath0827@gmail.com

---

Built with ❤️ by Gokul Nath
